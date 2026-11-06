// Evaluate the source feature's assertions using the real FHIRPath service.
// Uses shared synthetic resources; no implementation under test is contacted.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { clinicalFixtures } from '../scripts/lib/clinical-resources.mjs';

const source = fs.readFileSync(new URL('../input/testing/gherkin/eu-api-resource-access-provider.feature', import.meta.url), 'utf8');
const endpoint = process.env.FHIR_VALIDATOR_URL || 'http://fhir-validator:8080';
const results = [];
for (const resource of clinicalFixtures('target-patient')) {
  const scenario = source.split(/    Scenario: /).find(s => s.startsWith(`rap-`) &&
    s.split('\n')[0].includes(`Search ${resource.resourceType} by patient`));
  assert.ok(scenario, `Missing scenario for ${resource.resourceType}`);
  const assertions = [...scenario.matchAll(/And \$found at "([^"]+)" should be (true|"[^"]*")/g)]
    .map(([, expression, expected]) => ({ expression,
      expected: expected === 'true' ? 'true' : JSON.parse(expected).replace('$patientId', 'target-patient') }));
  assert.equal(assertions.length, 5, `Expected five search assertions for ${resource.resourceType}`);
  const field = ['AllergyIntolerance', 'Immunization'].includes(resource.resourceType) ? 'patient' : 'subject';
  const wrongPatient = { ...resource, [field]: { reference: 'Patient/other-patient' } };
  const withoutReference = { ...resource };
  delete withoutReference[field];
  const entry = (r, mode = 'match') => ({ resource: r, ...(mode ? { search: { mode } } : {}) });
  const wrongType = { resourceType: 'Patient', id: 'wrong-type' };
  const probes = [
    ['matching resource', [entry(resource)], true],
    ['search metadata absent', [entry(resource, null)], true],
    ['absolute reference', [entry({ ...resource, [field]: { reference: 'https://fhir.invalid/Patient/target-patient' } })], true],
    ['versioned reference', [entry({ ...resource, [field]: { reference: 'Patient/target-patient/_history/1' } })], true],
    ['unrelated include', [entry(resource), entry(wrongType, 'include')], true],
    ['empty searchset', [], false],
    ['include only', [entry(wrongType, 'include')], false],
    ['wrong resource type', [entry(wrongType)], false],
    ['wrong type without metadata', [entry(wrongType, null)], false],
    ['mixed resource types', [entry(resource), entry(wrongType)], false],
    ['wrong patient', [entry(wrongPatient)], false],
    ['mixed patients', [entry(resource), entry(wrongPatient)], false],
    ['missing patient reference', [entry(withoutReference)], false],
    ['missing resource', [{}], false],
  ];
  for (const [name, entries, expected] of probes) {
    const bundle = { resourceType: 'Bundle', type: 'searchset', entry: entries };
    let accepted = true;
    for (const check of assertions) {
      const response = await fetch(`${endpoint}/itb/fhirPath/process`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'evaluate', input: [
          { name: 'content', value: JSON.stringify(bundle), embeddingMethod: 'STRING' },
          { name: 'expression', value: check.expression, embeddingMethod: 'STRING' },
        ] }), signal: AbortSignal.timeout(30000),
      });
      assert.ok(response.ok, `FHIRPath HTTP ${response.status}`);
      const result = await response.json();
      assert.ok(result.output?.[0], `FHIRPath failed: ${JSON.stringify(result)}`);
      if (result.output[0].value !== check.expected) { accepted = false; break; }
    }
    assert.equal(accepted, expected, `${resource.resourceType}: ${name}`);
    results.push({ resourceType: resource.resourceType, probe: name, accepted });
  }
}
assert.equal(results.length, 140);
console.log(JSON.stringify({ passed: results.length, results }, null, 2));
