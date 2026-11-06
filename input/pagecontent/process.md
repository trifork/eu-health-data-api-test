**Status: demonstration test tooling, not an approved conformance specification.**
The checks below cover compilation, fixture validation and assertion behavior.
Implementation-specific execution results do not establish general conformance.

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
  canned data. **Server-side actors**: each scenario requests only its required token and
  reference identifiers. CapabilityStatement cases request none. Load matching
  fixtures before running searches; add a second patient as a filtering control.
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
| HL7 validator on published provider-v1 fixtures | 27 resources against core R4 plus both EU Core Patient profiles: 0 errors, 4 warnings; external terminology disabled (`-tx n/a`), no slicing-error suppression |
| Search assertion regression probes | 140 passed against the live FHIRPath service, including empty and wrong-patient responses |

### 4. Not covered

Address, telecom search parameters; `clinical-status`, `code` and the other
SHOULD parameters on clinical types; Binary content verification beyond non-empty;
MHD `Minimal` profile conformance on server responses; PDQm profile conformance.

### 5. Rerun

```
cd app && ITB_ASSET_ROOT=./public npx otb-gherkin compile public/features/eu-api-*.feature --out build
node scripts/build-test-ig.mjs public/data/eu-api-test-ig.json --package
```


### 6. Fixture contract (2026-11-06)

The TestPlan IG now ships `tests/fixtures/provider-v1/`: a 27-resource R4
conditional transaction, an assigned-ID bindings template, a manifest for all
67 cases and a human-readable contract. Fixtures may be entered/imported through
any supported route. The shared verifier checks 27 resource reads and 19 searches
using supplied ID bindings. Conditional transactions reuse matching resources;
import responses provide the actual assigned IDs. Wrong-patient controls and a same-patient laboratory document make
ignored filters observable. The source files are in `app/public/fixtures/eu-api/`;
`testAssets` copies them into the generated IG and packaging mirrors all of
`input/testing`, rather than only its Gherkin subdirectory.

The document-category queries now use the canonical actually present in the
pinned ballot package:
`http://hl7.eu/fhir/health-data-api/CodeSystem/eehrxf-document-priority-category-cs`.
The older EURIDICE URI was not known to the validator. Package loading is now
scenario-local: `dap-012`, `grp-012`, `rap-004`, `pub-003` and `pub-004` load the EU
API package for profile validation; metadata, authorization and core FHIRPath
checks do not. Loading profiles into the validator does not load fixtures into
the SUT.

The shared fixture verifier checks Binary data or standard content negotiation.
Current Gherkin Binary cases still only check nonempty response bodies. The manifest distinguishes the expected fixture
contract from the assertions the current Gherkin actually executes. Client cases
use the canned data in their features; these provider fixtures are not a client.
