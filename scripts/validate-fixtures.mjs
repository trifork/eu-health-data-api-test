// Offline structural/profile validation in an isolated JVM. No slicing errors
// are suppressed. External terminology validation is deliberately not claimed.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { bundle } from './fixture-data.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(root,'itb/build/fixture-validation');
fs.mkdirSync(output,{recursive:true});
const validationBundle=structuredClone(bundle);
const patientProfile='http://hl7.eu/fhir/base/StructureDefinition/patient-eu-core';
for(const entry of validationBundle.entry)if(entry.resource.resourceType==='Patient')entry.resource.meta.profile=[patientProfile];
fs.writeFileSync(path.join(output,'validation-input.json'),JSON.stringify(validationBundle,null,2)+'\n');
const log=fs.openSync(path.join(output,'cli.log'),'w');
console.log('Validating all fixture resources, with explicit EU Core Patient profile checks; external terminology disabled.');
try {
  execFileSync('docker',['run','--rm','--network','none','--entrypoint','java',
    '--mount',`type=bind,source=${output},target=/results`,
    '--mount',`type=volume,source=${process.env.FHIR_CACHE_VOLUME || 'eu-health-data-api-itb_fhir-cache'},target=/root/.fhir`,
    process.env.FHIR_VALIDATOR_IMAGE || 'eu-health-data-api-fhir-validator:local',
    '-jar','/app/validator_cli.jar','/results/validation-input.json','-version','4.0.1',
    '-ig','hl7.fhir.eu.health-data-api#1.0.0-ballot','-tx','n/a','-output','/results/outcome.json'],
    {stdio:['ignore',log,log],timeout:180000});
} finally {fs.closeSync(log);}
const outcome=JSON.parse(fs.readFileSync(path.join(output,'outcome.json')));
assert.equal(outcome.resourceType,'OperationOutcome');
const counts=Object.fromEntries(['fatal','error','warning','information'].map(severity=>[severity,(outcome.issue||[]).filter(i=>i.severity===severity).length]));
const report={fixtureSet:'eu-api-provider-v1',resourceCount:bundle.entry.length,patientProfile,
  terminology:'External terminology service disabled (-tx n/a); local bindings still checked where supported.',
  counts,report:'outcome.json'};
fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
assert.equal(counts.fatal+counts.error,0,'Fixture validation errors: inspect itb/build/fixture-validation/outcome.json');
