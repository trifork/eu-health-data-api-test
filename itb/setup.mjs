import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const base = `http://localhost:${process.env.ITB_PORT || 9000}`;
const stateFile = path.join(root, '.state.json');
const state = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, 'utf8')) : {};
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'build/manifest.json'), 'utf8'));
const master = process.env.ITB_AUTOMATION_API_MASTER_KEY;
if (!master) throw new Error('Run with node --env-file=itb/.env itb/setup.mjs');
function save() {
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2) + '\n', { mode: 0o600 });
  fs.chmodSync(stateFile, 0o600);
}
async function api(method, endpoint, key, body) {
  const res = await fetch(`${base}/api/rest${endpoint}`, {
    method, headers: { ITB_API_KEY: key, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(180000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${endpoint}: HTTP ${res.status}: ${text.slice(0, 1500)}`);
  return text ? JSON.parse(text) : null;
}
async function ensure(key, endpoint, credential, body) {
  if (!state[key]) {
    const result = await api('PUT', endpoint, credential, body);
    if (!result.apiKey) throw new Error(`No API key returned for ${endpoint}`);
    state[key] = result.apiKey;
    save();
    console.log(`Created ${key}`);
  }
  return state[key];
}
let ready = false;
for (let attempt = 0; attempt < 90; attempt++) {
  try {
    ready = (await fetch(`${base}/api/rest/swagger`, { signal: AbortSignal.timeout(2000) })).ok;
  } catch { /* JVM startup */ }
  if (ready) break;
  if (attempt % 10 === 0) console.log('Waiting for ITB REST API...');
  await new Promise(resolve => setTimeout(resolve, 2000));
}
if (!ready) throw new Error('ITB REST API did not become ready');
await ensure('domain', '/domain', master, { shortName: 'EU Health Data API',
  fullName: 'EU Health Data API testing', description: 'TestPlans and Gherkin from this demonstration IG.' });
await ensure('community', '/community', master, { shortName: 'EU Health Data API',
  fullName: 'EU Health Data API testing', domain: state.domain });
await ensure('specification', '/specification', state.community, { shortName: 'EU API 1.0.0-ballot',
  fullName: 'EU Health Data API 1.0.0-ballot', domain: state.domain });
await ensure('organisation', '/organisation', state.community, {
  shortName: 'EU API local testing', fullName: 'EU API local testing' });
await ensure('system', '/system', state.community, { shortName: 'Implementation under test',
  fullName: 'Implementation under test', organisation: state.organisation });
state.suites ??= {};
for (const suite of manifest) {
  const archive = fs.readFileSync(path.join(root, 'build', suite.archive));
  const deployed = await api('POST', '/testsuite/deploy', state.community, {
    specification: state.specification, testSuite: archive.toString('base64'),
    ignoreWarnings: false, replaceTestHistory: false, updateSpecification: true, showIdentifiers: true,
  });
  fs.writeFileSync(path.join(root, 'build', path.dirname(suite.archive), 'import.json'),
    JSON.stringify({ completed: deployed.completed, errors: deployed.errors, warnings: deployed.warnings }, null, 2) + '\n');
  if (deployed.completed !== true || deployed.identifiers?.testCases?.length !== suite.testCases.length) {
    throw new Error(`Import failed for ${suite.feature}: ${JSON.stringify(deployed)}`);
  }
  state.suites[suite.feature] = deployed.identifiers;
  save();
  console.log(`Imported ${suite.actor}: ${suite.testCases.length} test cases`);
}
const actors = await api('GET', `/specification/${state.specification}/actors`, state.community);
const statements = await api('GET', `/conformance/${state.system}`, state.organisation);
for (const suite of manifest) {
  const actor = actors.find(a => a.identifier === suite.actor);
  if (!actor) throw new Error(`Imported actor missing: ${suite.actor}`);
  if (!statements.some(s => s.actor === actor.apiKey)) {
    await api('PUT', `/conformance/${state.system}/${actor.apiKey}`, state.organisation);
  }
}
console.log(`ITB ready: ${base}\n${manifest.length} suites loaded; no implementation tests have been executed.`);
