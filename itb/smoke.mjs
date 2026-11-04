// Real engine check using a temporary suite; never invokes a supplied IG test.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';

const root = path.dirname(fileURLToPath(import.meta.url));
const state = JSON.parse(fs.readFileSync(path.join(root, '.state.json'), 'utf8'));
const out = path.join(root, 'build/smoke');
const cli = path.join(root, 'node_modules/@opentestbed/otb-gherkin/bin/otb-gherkin.mjs');
const compiled = JSON.parse(execFileSync(process.execPath, [cli, 'compile',
  path.join(root, 'tests/smoke.feature'), '--out', out, '--json'], {
  encoding: 'utf8', env: { ...process.env, ITB_ASSET_ROOT: path.join(root, 'build/assets') },
}));
assert.equal(compiled.ok, true);
execFileSync('python3', [path.join(root, 'normalize.py'), out]);
async function api(method, endpoint, key, body) {
  const response = await fetch(`http://localhost:${process.env.ITB_PORT || 9000}/api/rest${endpoint}`, {
    method, headers: { ITB_API_KEY: key, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(60000),
  });
  assert.equal(response.ok, true, `${endpoint}: HTTP ${response.status}`);
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
let deployed = false;
try {
  const result = await api('POST', '/testsuite/deploy', state.community, {
    specification: state.specification, testSuite: fs.readFileSync(path.join(out, 'suite.zip')).toString('base64'),
    updateSpecification: false, showIdentifiers: true, ignoreWarnings: false,
  });
  assert.equal(result.completed, true, JSON.stringify(result));
  deployed = true;
  const actors = await api('GET', `/specification/${state.specification}/actors`, state.community);
  const actor = actors.find(a => a.identifier === 'DocumentConsumer').apiKey;
  for (const [index, expected] of ['SUCCESS', 'FAILURE'].entries()) {
    const started = await api('POST', '/tests/start', state.organisation, {
      system: state.system, actor, testCase: [result.identifiers.testCases[index]], waitForCompletion: false,
    });
    const session = started.createdSessions[0].session;
    await new Promise(resolve => setTimeout(resolve, 1000));
    const callback = await fetch(`http://localhost:${process.env.ITB_CALLBACK_PORT || 8080}/itbsrv/api/http/${state.system}/probe`, {
      method: 'POST', headers: { Authorization: index ? 'Wrong scheme' : 'Bearer smoke-token', 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify({ resourceType: 'Patient', active: true }), signal: AbortSignal.timeout(30000),
    });
    const body = await callback.text();
    let status;
    for (let attempt = 0; attempt < 30; attempt++) {
      status = (await api('POST', '/tests/status', state.organisation,
        { session: [session], withLogs: true })).sessions[0];
      if (status.result !== 'UNDEFINED') break;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    fs.writeFileSync(path.join(out, `result-${index}.json`), JSON.stringify(status, null, 2) + '\n', { mode: 0o600 });
    assert.equal(status.result, expected, `Smoke ${index + 1}: see ${out}/result-${index}.json`);
    if (!index) {
      assert.equal(callback.status, 201);
      assert.equal(JSON.parse(body).accepted, true);
    }
    console.log(`Smoke ${index + 1}: ${expected} as expected`);
  }
} finally {
  if (deployed) {
    await api('POST', '/testsuite/undeploy', state.community, {
      specification: state.specification, testSuite: compiled.files[0].suite,
    });
    console.log('Removed temporary smoke suite.');
  }
}
