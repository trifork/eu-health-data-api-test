// Optional transaction loader and read-only fixture contract verifier.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const directory = new URL('../input/testing/fixtures/provider-v1/', import.meta.url);
export const bundle = JSON.parse(fs.readFileSync(new URL('bundle.json', directory)));
export const manifest = JSON.parse(fs.readFileSync(new URL('manifest.json', directory)));
export const defaultBindings = JSON.parse(fs.readFileSync(new URL('bindings.example.json', directory)));

export function fixtureInputs(bindings = defaultBindings) {
  assert.equal(bindings.fixtureSet, manifest.fixtureSet, 'Wrong fixture binding version');
  const seen = new Set();
  for (const [key, resource] of Object.entries(manifest.resources)) {
    const id = bindings.resourceIds[key];
    assert.match(id || '', /^[A-Za-z0-9.-]{1,64}$/, `Missing or invalid ID for ${key}`);
    const reference = `${resource.resourceType}/${id}`;
    assert.ok(!seen.has(reference), `Two fixtures map to ${reference}`);
    seen.add(reference);
  }
  return { patientIdentifier: manifest.patientIdentifier, patientId: bindings.resourceIds['patient-target'],
    documentId: bindings.resourceIds['document-target'], binaryId: bindings.resourceIds['binary-target'],
    submitPatientRef: `Patient/${bindings.resourceIds['patient-target']}` };
}

function endpoint(base, relative = '') {
  const url = relative ? new URL(relative, base.replace(/\/$/, '') + '/') : new URL(base.replace(/\/$/, ''));
  url.search = new URLSearchParams(url.search).toString();
  return url;
}
async function request(url, authorization, body) {
  const response = await fetch(url, { method: body ? 'POST' : 'GET',
    headers: { Accept: 'application/fhir+json', ...(authorization ? { Authorization: authorization } : {}),
      ...(body ? { 'Content-Type': 'application/fhir+json' } : {}) },
    body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(120000) });
  assert.ok(response.ok, `FHIR ${body ? 'POST' : 'GET'} ${url.pathname}: HTTP ${response.status}`);
  return response.json();
}
export async function loadFixtures(base, authorization) {
  const result = await request(endpoint(base), authorization, bundle);
  assert.equal(result.resourceType, 'Bundle');
  assert.equal(result.type, 'transaction-response');
  assert.equal(result.entry?.length, bundle.entry.length);
  result.entry.forEach((entry, i) => assert.match(entry.response?.status || '', /^20[01]( |$)/, `Fixture ${i}: transaction failed`));
  const bindings = { fixtureSet: manifest.fixtureSet, resourceIds: {} };
  for (const [index, entry] of bundle.entry.entries()) {
    const key = Object.keys(manifest.resources).find(k => manifest.resources[k].id === entry.resource.id);
    const location = result.entry[index].response.location;
    const match = location?.match(new RegExp(`(?:^|/)${entry.resource.resourceType}/([A-Za-z0-9.-]+)(?:/_history/[^/]+)?$`));
    assert.ok(match, `Missing transaction response location for ${key}`);
    bindings.resourceIds[key] = match[1];
  }
  fixtureInputs(bindings);
  return bindings;
}

// A server may add fields, change narratives, or reorder multivalued elements.
// The supplied fixture facts must still be present. References may be absolute
// or versioned; map logical fixture IDs before comparing them.
export function assertFixture(actual, expected, referenceMap, location = '') {
  const isReference = location.endsWith('.reference') || location.endsWith('.url');
  if (isReference && typeof expected === 'string' && referenceMap.has(expected)) {
    const normalized = String(actual).replace(/\/_history\/[^/]+$/, '').split('/').slice(-2).join('/');
    assert.equal(normalized, referenceMap.get(expected), location);
  } else if (Array.isArray(expected)) {
    assert.ok(Array.isArray(actual), `${location}: array missing`);
    for (const value of expected) assert.ok(actual.some(item => {
      try { assertFixture(item, value, referenceMap, location + '[]'); return true; } catch { return false; }
    }), `${location}: required fixture value missing`);
  } else if (expected && typeof expected === 'object') {
    assert.ok(actual && typeof actual === 'object', `${location}: object missing`);
    for (const [key, value] of Object.entries(expected)) {
      if (key === 'text' && location === '') continue; // Server-generated narrative.
      assertFixture(actual[key], value, referenceMap, `${location}.${key}`);
    }
  } else assert.equal(actual, expected, location);
}

export function checkSearch(bundle, check, bindings) {
  assert.equal(bundle.resourceType, 'Bundle');
  assert.equal(bundle.type, 'searchset');
  const matches = (bundle.entry || []).filter(e => e.search?.mode !== 'include');
  assert.ok(matches.every(e => e.resource?.resourceType === check.resourceType), 'Unexpected matching resource type');
  const ids = new Set(matches.map(e => e.resource.id));
  for (const key of check.mustInclude) assert.ok(ids.has(bindings.resourceIds[key]), `Missing expected fixture ${key}`);
  for (const key of check.mustExclude) assert.ok(!ids.has(bindings.resourceIds[key]), `Search incorrectly includes ${key}`);
  const parameters = new URLSearchParams(check.query.replaceAll('{patientId}', bindings.resourceIds['patient-target']).split('?')[1]);
  const coded = (concept, token) => {
    const [system, code] = token.split('|');
    return concept?.coding?.some(c => c.system === system && c.code === code);
  };
  for (const { resource } of matches) {
    for (const [parameter, value] of parameters) {
      let matchesFilter = true;
      if (parameter === '_id') matchesFilter = resource.id === value;
      else if (parameter === 'identifier') {
        const [system, identifier] = value.split('|');
        matchesFilter = resource.identifier?.some(i => i.system === system && i.value === identifier);
      } else if (parameter === 'family') matchesFilter = resource.name?.some(n => n.family === value);
      else if (parameter === 'gender') matchesFilter = resource.gender === value;
      else if (parameter === 'birthdate') matchesFilter = resource.birthDate === value;
      else if (parameter === 'active') matchesFilter = String(resource.active) === value;
      else if (parameter === 'category') matchesFilter = resource.category?.some(c => coded(c, value));
      else if (parameter === 'type') matchesFilter = coded(resource.type, value);
      assert.ok(matchesFilter, `Returned ${resource.resourceType}/${resource.id} does not match ${parameter}`);
    }
  }
  if (check.query.includes('patient={patientId}')) {
    const field = ['AllergyIntolerance', 'Immunization'].includes(check.resourceType) ? 'patient' : 'subject';
    for (const entry of matches) {
      const ref = entry.resource[field]?.reference;
      assert.ok(ref, `Missing ${field} reference`);
      assert.equal(ref.replace(/\/_history\/[^/]+$/, '').split('/').slice(-2).join('/'), `Patient/${bindings.resourceIds['patient-target']}`, 'Wrong patient in search');
    }
  }
}

export async function readBinaryContent({ base, authorization, resource }) {
  const response = await fetch(endpoint(base, `Binary/${resource.id}`), {
    headers: { Accept: resource.contentType, ...(authorization ? { Authorization: authorization } : {}) },
    signal: AbortSignal.timeout(120000),
  });
  return { response, method: 'native content negotiation' };
}

export async function verifyFixtures(base, authorization, bindings = defaultBindings,
  { binaryContentReader = readBinaryContent } = {}) {
  const inputs = fixtureInputs(bindings);
  const referenceMap = new Map(Object.entries(manifest.resources).map(([key, r]) => [`${r.resourceType}/${r.id}`, `${r.resourceType}/${bindings.resourceIds[key]}`]));
  for (const entry of bundle.entry) referenceMap.set(entry.fullUrl, referenceMap.get(`${entry.resource.resourceType}/${entry.resource.id}`));
  const reads = [];
  const binaryRetrieval = {};
  for (const [key, resource] of Object.entries(manifest.resources)) {
    const expected = structuredClone(bundle.entry.find(e => e.resource.resourceType === resource.resourceType && e.resource.id === resource.id).resource);
    expected.id = bindings.resourceIds[key];
    delete expected.meta; // Loader tags and server-maintained metadata are not clinical facts.
    const actual = await request(endpoint(base, `${resource.resourceType}/${expected.id}`), authorization);
    if (resource.resourceType === 'Binary' && actual.data == null) {
      // Default to standard content negotiation; adapters may supply a reader.
      // Validate returned bytes and content type regardless of the reader used.
      const { response: content, method } = await binaryContentReader({ base, authorization, resource: expected, actual });
      assert.ok(content.ok, `${key}: binary content HTTP ${content.status}`);
      assert.equal(content.headers.get('content-type')?.split(';')[0], expected.contentType, `${key}: content type`);
      assert.deepEqual(Buffer.from(await content.arrayBuffer()), Buffer.from(expected.data, 'base64'), `${key}: document bytes`);
      binaryRetrieval[key] = method;
      delete expected.data;
    } else if (resource.resourceType === 'Binary') binaryRetrieval[key] = 'Binary.data';
    assertFixture(actual, expected, referenceMap);
    reads.push(key);
  }
  const searches = [];
  for (const [key, check] of Object.entries(manifest.searchChecks)) {
    let next = endpoint(base, check.query.replaceAll('{patientId}', encodeURIComponent(inputs.patientId)));
    const seen = new Set();
    const merged = { resourceType: 'Bundle', type: 'searchset', entry: [] };
    while (next) {
      assert.equal(next.origin, endpoint(base).origin, 'Refusing to forward credentials to a different pagination origin');
      assert.ok(!seen.has(next.href) && seen.size < 100, 'Search pagination loop or limit reached');
      seen.add(next.href);
      const page = await request(next, authorization);
      assert.equal(page.type, 'searchset', key);
      merged.entry.push(...(page.entry || []));
      const link = page.link?.find(l => l.relation === 'next')?.url;
      next = link ? new URL(link, next) : null;
    }
    try { checkSearch(merged, check, bindings); } catch (error) { throw new Error(`${key}: ${error.message}`, { cause: error }); }
    searches.push(key);
  }
  return { fixtureSet: manifest.fixtureSet, resourceReads: reads.length, searches: searches.length, binaryRetrieval, result: 'SUCCESS' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [mode, bindingFile] = process.argv.slice(2);
  assert.ok(['load', 'verify'].includes(mode), 'Usage: FHIR_BASE_URL=... node scripts/fixture-data.mjs load|verify <bindings.json>');
  const base = process.env.FHIR_BASE_URL;
  assert.ok(base, 'Set FHIR_BASE_URL to the test server');
  const authorization = process.env.FHIR_AUTHORIZATION;
  if (mode === 'load') {
    assert.ok(bindingFile, 'Specify a bindings output file to record server-assigned IDs');
    assert.ok(!fs.existsSync(bindingFile), 'Bindings output already exists; choose a new output file');
    fs.mkdirSync(new URL('.', pathToFileURL(bindingFile)), { recursive: true });
    const bindings = await loadFixtures(base, authorization);
    fs.writeFileSync(bindingFile, JSON.stringify(bindings, null, 2) + '\n', { flag: 'wx' });
    console.log(`Loaded ${bundle.entry.length} fixtures; assigned IDs saved to ${bindingFile}.`);
  } else {
    const bindings = bindingFile ? JSON.parse(fs.readFileSync(bindingFile)) : defaultBindings;
    console.log(JSON.stringify(await verifyFixtures(base, authorization, bindings), null, 2));
  }
}
