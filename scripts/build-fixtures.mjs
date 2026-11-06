// Build the published, synthetic R4 fixture contract. No server access.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { clinicalFixtures } from './lib/clinical-resources.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'input/testing/fixtures/provider-v1');
const system = 'urn:uuid:47df6faa-4581-4545-9f2d-7d8c8db0c3e7';
const categorySystem = 'http://hl7.eu/fhir/health-data-api/CodeSystem/eehrxf-document-priority-category-cs';
const resources = {};
function add(key, resource) {
  resource.id = `eu-api-${key}`;
  if (resource.resourceType !== 'Binary') {
    resource.identifier = [{ system, value: `EU-API-${key.toUpperCase()}` }];
    resource.text = { status: 'generated', div: `<div xmlns="http://www.w3.org/1999/xhtml">Synthetic EU API fixture: ${key}. Not clinical data.</div>` };
  }
  resource.meta = { tag: [{ system, code: `EU-API-${key.toUpperCase()}` }] };
  resources[key] = resource;
  return `${resource.resourceType}/${resource.id}`;
}
for (const role of ['target', 'control']) {
  const patient = add(`patient-${role}`, { resourceType: 'Patient', active: true,
    name: [{ use: 'official', family: role === 'target' ? 'EUAPITestpatient' : 'EUAPIControlpatient', given: ['Synthetic'] }],
    gender: role === 'target' ? 'unknown' : 'female', birthDate: role === 'target' ? '1990-01-01' : '1980-01-01' });
  for (const resource of clinicalFixtures(patient.split('/')[1])) add(`${resource.resourceType.toLowerCase()}-${role}`, resource);
  const binary = add(`binary-${role}`, { resourceType: 'Binary', contentType: 'text/plain',
    securityContext: { reference: patient }, data: Buffer.from(`EU API ${role} document. Synthetic test data only.\n`).toString('base64') });
  add(`document-${role}`, { resourceType: 'DocumentReference', status: 'current', subject: { reference: patient },
    type: { coding: [{ system: 'http://loinc.org', code: '60591-5' }] },
    category: [{ coding: [{ system: categorySystem, code: 'Patient-Summaries' }] }],
    content: [{ attachment: { contentType: 'text/plain', url: binary } }] });
}
// A same-patient distractor makes ignored category/type filters observable.
const alternative = structuredClone(resources['document-target']);
alternative.type = { coding: [{ system: 'http://loinc.org', code: '11502-2' }] };
alternative.category = [{ coding: [{ system: categorySystem, code: 'Laboratory-Reports' }] }];
add('document-laboratory', alternative);
const fullUrls = new Map(Object.values(resources).map(r => {
  const hash = createHash('sha256').update(`eu-api-provider-v1/${r.resourceType}/${r.id}`).digest('hex');
  const uuid = `${hash.slice(0,8)}-${hash.slice(8,12)}-5${hash.slice(13,16)}-a${hash.slice(17,20)}-${hash.slice(20,32)}`;
  return [`${r.resourceType}/${r.id}`, `urn:uuid:${uuid}`];
}));
const bundle = { resourceType: 'Bundle', id: 'eu-api-provider-v1', type: 'transaction',
  entry: Object.values(resources).map(resource => ({
    fullUrl: fullUrls.get(`${resource.resourceType}/${resource.id}`),
    resource: JSON.parse(JSON.stringify(resource), (key, value) => ['reference', 'url'].includes(key) && fullUrls.has(value) ? fullUrls.get(value) : value),
    request: { method: 'POST', url: resource.resourceType,
      ifNoneExist: `${resource.resourceType === 'Binary' ? '_tag' : 'identifier'}=${encodeURIComponent(system+'|'+resource.meta.tag[0].code)}` },
  })) };
const bindings = { fixtureSet: 'eu-api-provider-v1',
  resourceIds: Object.fromEntries(Object.entries(resources).map(([key, resource]) => [key, resource.id])) };
const checks = {};
function search(key, query, include, exclude, cases) {
  checks[key] = { query, resourceType: query.split('?')[0], mustInclude: include, mustExclude: exclude, cases };
}
search('patient-identifier', `Patient?identifier=${system}|EU-API-PATIENT-TARGET`, ['patient-target'], ['patient-control'], ['dap-011', 'grp-011', 'rap-005']);
search('patient-id', 'Patient?_id={patientId}', ['patient-target'], ['patient-control'], ['rap-005']);
for (const [field, value, cases] of [
  ['family', 'EUAPITestpatient', ['dap-013', 'grp-013', 'rap-006']],
  ['gender', 'unknown', ['dap-013', 'grp-013', 'rap-006']],
  ['birthdate', '1990-01-01', ['rap-006']],
  ['active', 'true&_id={patientId}', ['rap-006']],
]) search(`patient-${field}`, `Patient?${field}=${value}`, ['patient-target'], ['patient-control'], cases);
search('documents-patient', 'DocumentReference?patient={patientId}', ['document-target', 'document-laboratory'], ['document-control'], ['dap-005', 'grp-005']);
search('documents-category', `DocumentReference?category=${categorySystem}|Patient-Summaries&patient={patientId}`, ['document-target'], ['document-control', 'document-laboratory'], ['dap-006', 'grp-006']);
search('documents-type', 'DocumentReference?type=http://loinc.org|60591-5&patient={patientId}', ['document-target'], ['document-control', 'document-laboratory'], ['dap-007', 'grp-007']);
const clinical = clinicalFixtures('unused');
clinical.forEach((r, i) => search(`${r.resourceType.toLowerCase()}-patient`, `${r.resourceType}?patient={patientId}`, [`${r.resourceType.toLowerCase()}-target`], [`${r.resourceType.toLowerCase()}-control`], [`rap-${String(i + 7).padStart(3, '0')}`, ...(r.resourceType === 'Observation' ? ['rap-017'] : [])]));
const cases = {};
for (const file of fs.readdirSync(path.join(root, 'input/testing/gherkin')).filter(f => f.endsWith('.feature')).sort()) {
  const source = fs.readFileSync(path.join(root, 'input/testing/gherkin', file), 'utf8');
  for (const match of source.matchAll(/^    Scenario: ((\w+-\d+) [^\n]+)\n([\s\S]*?)(?=^    Scenario:|$(?![\s\S]))/gm)) {
    const [, title, id, body] = match;
    const inputNames = [...body.matchAll(/is asked for \$(\w+)/g)].map(m => m[1]);
    const provider = /^(dap|grp|rap)-/.test(id);
    const fixtureKeys = new Set();
    for (const name of inputNames) {
      if (['patientId', 'patientIdentifier', 'submitPatientRef'].includes(name)) fixtureKeys.add('patient-target');
      if (name === 'documentId') fixtureKeys.add('document-target');
      if (name === 'binaryId') fixtureKeys.add('binary-target');
    }
    const searchChecks = Object.keys(checks).filter(k => checks[k].cases.includes(id));
    for (const key of searchChecks) for (const fixture of [...checks[key].mustInclude, ...checks[key].mustExclude]) fixtureKeys.add(fixture);
    if (/^(dap|grp)-012$|^rap-004$/.test(id)) fixtureKeys.add('patient-target');
    const assertions = [];
    let inThen = false;
    for (const line of body.split('\n')) {
      const step = line.match(/^      (Given|When|Then|And|But) (.*)$/);
      if (!step) continue;
      if (step[1] === 'Then') inThen = true;
      else if (['Given', 'When'].includes(step[1])) inThen = false;
      if (inThen) assertions.push(step[2]);
    }
    // Include referenced fixtures as prerequisites without adding operator prompts.
    for (const key of fixtureKeys) {
      const text = JSON.stringify(resources[key]);
      for (const [related, r] of Object.entries(resources)) {
        if (text.includes(`"${r.resourceType}/${r.id}"`)) fixtureKeys.add(related);
      }
    }
    cases[id] = { title, feature: file, fixtureUse: provider ? (fixtureKeys.size ? 'provider-v1' : 'none') : 'embedded-client-workflow',
      fixtureKeys: [...fixtureKeys], inputNames, searchChecks, assertions,
      expected: !provider ? 'The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used.' :
        /CapabilityStatement/.test(title) ? 'No fixture or token required. The live server must declare the capabilities named by the assertions.' :
        /without a token|no usable scope|cannot create/.test(title) ? 'Reject the request with the status in the assertions. Authorization and scope configuration are external prerequisites, not fixture resources.' :
        /unknown .*id/.test(title) ? 'The reserved otb-no-such-* identifier in the feature must not exist; expect 404 and an OperationOutcome.' :
        /without content/.test(title) ? 'Reject the malformed submission with 400 or 422. No invalid resource is preloaded.' :
        id === 'dap-015' ? 'Create a new document for the bound target patient, return 201 and Location. This changes server state; the fixture search expectations are inclusion/exclusion checks, not global exact counts.' :
        searchChecks.length ? `The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query.` :
        /binaryId/.test(inputNames.join(' ')) ? 'Read the bound target Binary. Its content type is text/plain and decoded data matches the bundled synthetic target document.' :
        /documentId/.test(inputNames.join(' ')) ? 'Read the bound target DocumentReference: current, type 60591-5, category Patient-Summaries, subject target patient and attachment URL pointing to the target Binary.' :
        'Read the bound target patient: active, Synthetic EUAPITestpatient, gender unknown, birth date 1990-01-01, and the declared fixture identifier.' };
  }
}
assert.equal(Object.keys(cases).length, 67);
const manifest = { fixtureSet: 'eu-api-provider-v1', version: '1.0.0', fhirVersion: '4.0.1',
  bundle: 'bundle.json', bindings: 'bindings.example.json',
  identifierSystem: system, patientIdentifier: `${system}|EU-API-PATIENT-TARGET`,
  resources: Object.fromEntries(Object.entries(resources).map(([key, r]) => [key, { resourceType: r.resourceType, id: r.id, validationProfiles: [`http://hl7.org/fhir/StructureDefinition/${r.resourceType}`, ...(r.resourceType === 'Patient' ? ['http://hl7.eu/fhir/base/StructureDefinition/patient-eu-core'] : [])] }])),
  externalInputs: { accessToken: 'A valid Bearer token for the scenario operations; dap-015/016 require DocumentReference create permission.', narrowToken: 'A valid Bearer token without the scopes required by the negative authorization scenarios.' },
  searchChecks: checks, cases };
const readme = `# EU API provider fixtures v1\n\nSynthetic FHIR R4 (4.0.1) data, fixture contract version 1.0.0. No real people or clinical records.\n\n## Files\n\n- \`bundle.json\`: ${bundle.entry.length} resources in a transaction using conditional POST and internal UUID references.\n- \`bindings.example.json\`: maps logical fixture names to IDs in your implementation.\n- \`manifest.json\`: all 67 case IDs, per-case prerequisites and inputs, expected fixture outcomes, current Gherkin assertions, and reusable search checks.\n\n## Load by any supported method\n\nUse a transaction, an administrative import, or enter equivalent data through the application's normal workflow. Transaction support is **not** a conformance requirement of these tests. Keep the specified identifiers, demographic values, codes, document content, and relationships. The JSON resources are the concrete data specification. If the server assigns IDs, copy the bindings template and replace the IDs; also map all patient and document references when importing. Do not change the business identifiers.\n\nFor a test server supporting transactions and conditional create, POST \`bundle.json\` to its FHIR base URL with \`Content-Type: application/fhir+json\`. Conditional creates use the fixture identifiers (and Binary tags) to avoid duplicates on repeat loads. Existing fixtures are not reset: changed data must be reconciled by the operator. Capture each transaction-response location and use its assigned ID in the bindings. Internal UUID references are resolved by the transaction processor; manual imports must preserve the same relationships. Binary content is synthetic plain text, not an IPS clinical document.\n\nThe repository helper can load and verify the complete dataset:\n\n\`\`\`sh\nFHIR_BASE_URL=https://your-test-server/fhir node scripts/fixture-data.mjs load itb/build/fixture-bindings.json\nFHIR_BASE_URL=https://your-test-server/fhir node scripts/fixture-data.mjs verify itb/build/fixture-bindings.json\n# For manually imported data with different IDs:\nFHIR_BASE_URL=https://your-test-server/fhir node scripts/fixture-data.mjs verify /path/to/bindings.json\n\`\`\`\n\nUse \`FHIR_AUTHORIZATION\` for the helper's existing authorization header when needed. It is never stored in the fixtures. The helper's full-dataset verification requires read/search access to every supplied type. For a partial implementation, load the applicable subset and use the case-specific requirements in the manifest. Unsupported optional capabilities are not made mandatory by supplying fixtures.\n\n## Inputs supplied to ITB\n\n- \`patientIdentifier\`: \`${manifest.patientIdentifier}\`\n- \`patientId\`: ID mapped by \`patient-target\`.\n- \`documentId\`: ID mapped by \`document-target\`.\n- \`binaryId\`: ID mapped by \`binary-target\`.\n- \`submitPatientRef\`: \`Patient/<mapped patient-target ID>\`.\n- \`accessToken\` and \`narrowToken\`: issued by the implementation's authorization system, never sample credentials. The positive token needs the read/search or create permissions used by that case.\n\n## Expected results\n\nThe reference patient is active, given name Synthetic, family EUAPITestpatient, gender unknown, born 1990-01-01. The control patient has a different identifier, family, gender and birth date. Each has one of each of the ten clinical resource types.\n\nDocument search for the target patient includes the target summary and target laboratory document; it excludes the control patient's document. Category Patient-Summaries and type 60591-5 each select the target summary and exclude both the laboratory distractor and control document. Each clinical patient search includes its target fixture and excludes its control fixture. Patient identifier and ID searches identify the target patient. Do not require global exact counts in a populated server; evaluate all pages. \`dap-015\` creates additional matching data.\n\n| Case | Required fixture keys | Inputs | Expected outcome |\n| --- | --- | --- | --- |\n${Object.entries(cases).map(([id,c])=>`| ${id} | ${c.fixtureKeys.join(', ') || (c.fixtureUse==='embedded-client-workflow'?'Embedded client workflow':'None')} | ${c.inputNames.join(', ') || 'None'} | ${c.expected.replaceAll('|','\\|')} |`).join('\n')}\n\n## What this establishes\n\nThe manifest expresses the fixture contract; its \`assertions\` list records what the existing Gherkin actually checks. The generic Gherkin cases are not yet assertions of every fixture field. For example, a Patient read currently checks profile conformance, whereas the fixture verifier also checks the declared demographic values. The current Gherkin profile checks ignore slicing errors. The separate fixture validation command validates all 27 resources against core R4 and both patients against EU Core Patient without suppressing slicing errors; external terminology is disabled and its warnings are reported. This fixture set does not claim MHD Minimal metadata or IPS document-content conformance. The fixture checker verifies Binary data or standard content negotiation. The fixture checker verifies data and search membership; it does not replace a FHIR profile validator or the authorization tests.\n\nThe 19 client cases use embedded requests/responses and operator-driven workflows from their features. This provider dataset is not an executable client implementation. CapabilityStatement, TLS and token/scope behavior are external prerequisites, not properties a transaction bundle can install.\n\nR4 fixtures travel under \`package/tests/fixtures/provider-v1/\`, not as R6 examples or resources in this TestPlan IG. Generate/check with \`node scripts/build-fixtures.mjs\` / \`node scripts/build-fixtures.mjs --check\`.\n`;
const files = { 'bundle.json': JSON.stringify(bundle, null, 2)+'\n', 'bindings.example.json': JSON.stringify(bindings, null, 2)+'\n', 'manifest.json': JSON.stringify(manifest, null, 2)+'\n', 'README.md': readme };
for (const [name, content] of Object.entries(files)) {
  const target = path.join(output, name);
  if (process.argv.includes('--check')) assert.equal(fs.readFileSync(target, 'utf8'), content, `${name} is stale; rebuild fixtures`);
  else { fs.mkdirSync(output, { recursive: true }); fs.writeFileSync(target, content); }
}
console.log(`${bundle.entry.length} resources, ${Object.keys(checks).length} search checks, ${Object.keys(cases).length} cases${process.argv.includes('--check') ? ' verified' : ' generated'}.`);
