import test from 'node:test';
import assert from 'node:assert/strict';
import { bundle, manifest, defaultBindings, fixtureInputs, assertFixture, checkSearch } from './fixture-data.mjs';
const search = resources => ({resourceType:'Bundle',type:'searchset',entry:resources.map(resource=>({resource}))});
const resource = key => structuredClone(bundle.entry.find(e=>e.resource.id===manifest.resources[key].id).resource);

test('fixture references resolve within the transaction and each resource has a stable conditional key',()=>{
  const urls=new Set(bundle.entry.map(e=>e.fullUrl));
  assert.equal(urls.size,27);
  for(const entry of bundle.entry){
    assert.equal(entry.request.method,'POST');
    assert.ok(entry.request.ifNoneExist);
    JSON.parse(JSON.stringify(entry.resource),(key,value)=>{
      if(['reference','url'].includes(key)&&typeof value==='string'&&value.startsWith('urn:uuid:')) assert.ok(urls.has(value),value);
      return value;
    });
  }
  assert.equal(Object.keys(manifest.cases).length,67);
  for(const c of Object.values(manifest.cases))for(const key of c.fixtureKeys)assert.ok(manifest.resources[key]);
  for(const id of ['dap-001','dap-002','dap-014','grp-001','grp-002','rap-001'])assert.deepEqual(manifest.cases[id].inputNames,[]);
});

test('server-assigned IDs map to scenario inputs and invalid aliases fail',()=>{
  const bindings=structuredClone(defaultBindings);
  bindings.resourceIds['patient-target']='server-generated-123';
  assert.equal(fixtureInputs(bindings).submitPatientRef,'Patient/server-generated-123');
  bindings.resourceIds['patient-control']='server-generated-123';
  assert.throws(()=>fixtureInputs(bindings),/Two fixtures/);
});

test('fixture field checks accept extra fields and rewritten references but reject missing/wrong values',()=>{
  const expected={resourceType:'Observation',subject:{reference:'urn:uuid:fixture-patient'},valueQuantity:{value:14,unit:'g/dL'}};
  const actual={resourceType:'Observation',id:'assigned',subject:{reference:'https://server/fhir/Patient/123/_history/2'},valueQuantity:{value:14,unit:'g/dL',code:'g/dL'}};
  const refs=new Map([['urn:uuid:fixture-patient','Patient/123']]);
  assertFixture(actual,expected,refs);
  assert.throws(()=>assertFixture({...actual,valueQuantity:{value:15}},expected,refs));
  assert.throws(()=>assertFixture({...actual,subject:{reference:'Patient/other'}},expected,refs));
});

test('search expectations reject empty and wrong-patient results, including mixed matches',()=>{
  const check=manifest.searchChecks['observation-patient'];
  const target=resource('observation-target');target.subject.reference='Patient/'+defaultBindings.resourceIds['patient-target'];
  const control=resource('observation-control');control.subject.reference='Patient/'+defaultBindings.resourceIds['patient-control'];
  checkSearch(search([target]),check,defaultBindings);
  assert.throws(()=>checkSearch(search([]),check,defaultBindings),/Missing expected fixture/);
  assert.throws(()=>checkSearch(search([target,control]),check,defaultBindings),/incorrectly includes/);
  assert.throws(()=>checkSearch(search([{...target,subject:control.subject}]),check,defaultBindings),/Wrong patient/);
});

test('category/type filters exclude same-patient distractors, and includes are not matches',()=>{
  const target=resource('document-target');target.subject.reference='Patient/'+defaultBindings.resourceIds['patient-target'];
  const lab=resource('document-laboratory');lab.subject=target.subject;
  for(const name of ['documents-category','documents-type']){
    const check=manifest.searchChecks[name];
    checkSearch(search([target]),check,defaultBindings);
    assert.throws(()=>checkSearch(search([target,lab]),check,defaultBindings),/incorrectly includes/);
    assert.throws(()=>checkSearch(search([target,{...lab,id:'unrelated'}]),check,defaultBindings),/does not match/);
    const included=search([target]);included.entry.push({resource:lab,search:{mode:'include'}});
    checkSearch(included,check,defaultBindings);
  }
});
