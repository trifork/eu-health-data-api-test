**Status: authored and compiling. Not yet run.** No system under test exists
yet, so nothing here is evidence of conformance, only of the tests' shape.

### 1. Scope

**Specification.** EU Health Data API (`hl7.fhir.eu.health-data-api`
1.0.0-ballot, FHIR R4), HL7 Europe / EURIDICE, built from the local checkout of
<https://github.com/euridice-org/eu-health-data-api>. It composes MHD, PDQm,
IPA and SMART Backend Services into six conformance targets.

**Shape: actor-scoped, no obligations.** `ips-obligations.mjs extract` against
the published package found 6 actors, 0 profiles, 0 obligations. The IG states its
requirements as `capabilitystatement-expectation` extensions (SHALL/SHOULD/MAY)
on seven CapabilityStatements, plus narrative. The tests are therefore derived
from those expectations by hand; each scenario names what it tests in `@covers:`.

| Actor | Role of the SUT | Features |
|---|---|---|
| Document Publisher | client | token, ITI-78, ITI-105 |
| Document Access Provider (+ Submission Option) | server | ITI-67, ITI-68, ITI-78, ITI-105 |
| Document Consumer | client | token, ITI-78, ITI-67, ITI-68 |
| Grouped Document Publisher/Access Provider | server | ITI-67, ITI-68, ITI-78 |
| Resource Access Provider | server | Patient, ten clinical resource types |
| Resource Consumer | client | token, Patient, search by patient |

### 2. Decisions

- **Client-side actors** (Publisher, Consumer, Resource Consumer): the test bed
  plays the provider, receives what the SUT sends, checks it and answers with
  canned data. **Server-side actors**: the tester pastes a token and the ids of a
  reference patient, document and binary; the reference data must be loaded first.
- **Authorization** is a scenario of its own per actor: a request without a token
  gets 401; a token with no usable scope gets 401 or 403; a client's token request
  carries `client_credentials` and a JWT client assertion (RFC 7523).
- **SHOULD vs SHALL.** Patient on the Document Access Provider and every clinical
  type on the Resource Access Provider are SHOULD for the actor but SHALL for the
  interactions when offered. The scenarios are written for a system that offers
  them; one that does not will fail them, and the feature header says so. Nothing
  enforces option gating.
- **Document Submission Option** is its own Rule inside the Access Provider
  feature, to be read as applicable only to a system that claims the option.
- **TLS 1.2+** is operator-judged: the tester attaches evidence and confirms.
- **Search parameters.** Only parameters whose value can be taken from the reference
  patient (identifier, _id, family, gender, birthdate, active) are exercised; the
  address parameters and telecom are not yet covered.

### 3. Results

| Check | Result |
|---|---|
| `otb-gherkin compile` on all six features | clean: 6, errors: 0 (17, 6, 13, 6, 18, 7 test cases) |
| Selftest against the spec's own examples | **not run**: no obligations, so no generated assertions; the IG's DocumentReference examples were not run against these features |
| HL7 validator on a reference dataset | **not run**: the IG ships no reference patient dataset |
| Run on an ITB | **not run**: no system under test |

### 4. Not covered

Address, telecom search parameters; `clinical-status`, `code` and the other
SHOULD parameters on clinical types; Binary content verification beyond non-empty;
MHD `Minimal` profile conformance on server responses; PDQm profile conformance.

### 5. Rerun

```
cd app && ITB_ASSET_ROOT=./public npx otb-gherkin compile public/features/eu-api-*.feature --out build
node scripts/build-test-ig.mjs public/data/eu-api-test-ig.json --package
```
