# Local European Interoperability Test Bed

This directory runs the European Commission's stock ITB 1.30.2 for this IG,
following the Compose and REST bootstrap approach in
[trifork/itb-dk-extensions](https://github.com/trifork/itb-dk-extensions).
It imports every `input/testing/gherkin/*.feature` as its own suite: currently
six suites and 67 cases. The original features remain the source of truth.

## Start and sign in

Prerequisites: Docker with Compose, Node.js 22 or newer, npm, Python 3.9 or newer and OpenSSL.
The first start needs network access to npm, Docker Hub, GitHub and FHIR package
servers. Allow several minutes for the validator's first startup.

From the repository root:

```sh
./itb/start.sh
```

Open **http://localhost:9000** and sign in as **eu-api-test@itb**. The generated
password is the `password` property in `itb/.users.json`. The same file contains
`adminPassword` for `admin@itb`. Credentials and API keys are generated locally,
stored with owner-only permissions, and excluded from Git.

Choose the **Implementation under test** system in **EU API local testing**,
then its conformance statements:

| Actor | Cases |
| --- | ---: |
| DocumentAccessProvider | 17 |
| DocumentConsumer | 6 |
| DocumentPublisher | 6 |
| GroupedProvider | 13 |
| ResourceAccessProvider | 18 |
| ResourceConsumer | 7 |

`GroupedProvider` is the SUT identifier used inside the grouped publisher/access
provider feature; its descriptive `@actor` tag is `DocumentPublisherAccessProvider`.

Startup compiles, imports and assigns the tests. It does **not** execute the
67 conformance cases or establish compliance. They are demonstration tests;
their clinical/specification coverage has not been validated by this integration.

## Inspect response bodies

Response-body dialogs include a **Pretty print JSON** button for valid JSON
objects and arrays. **Show raw** restores the exact original text; **Copy to
clipboard** copies the currently displayed version. Formatting changes only the
viewer, never stored reports, and preserves numeric precision and duplicate keys.
This also works on historical sessions after refreshing the browser.

The local `gitb-ui` image extends pinned ITB 1.30.2 using `ui/Dockerfile` and a
guarded asset patch. `./itb/start.sh` builds it automatically. To update only the UI:

```sh
docker compose --env-file itb/.env up -d --build --no-deps gitb-ui
node --test itb/ui/json-viewer.test.mjs
```

Hard-refresh the ITB page after rebuilding. The patch is specific to the pinned
bundle and fails the build if its component hook changes; review it when upgrading
ITB. Editable documents, annotated reports, invalid JSON and other formats retain
their normal viewer.

## Configure an implementation

The provider features currently use `http://ehr.example.org/fhir`. Replace that
placeholder in the relevant source feature with your implementation's base URL,
then rerun `./itb/start.sh`. For a server running on the Docker host, use
`http://host.docker.internal:<port>/<path>` so the engine can reach it.

Provider cases prompt only for the tokens and reference identifiers used by that
scenario. CapabilityStatement checks (`dap-001`, `dap-002`, `dap-014`, `grp-001`,
`grp-002`, `rap-001`) need no operator input. Keep input prompts inside their
scenarios: prompts in `Background` run before every case, including metadata checks.
Consumer and publisher cases instruct the operator and
wait for the implementation to call ITB. Configure that implementation with the
HTTP callback address shown in the session log, of the form:

```text
http://localhost:8080/itbsrv/api/http/<system-api-key>/<FHIR-or-token-path>
```

Use the same system's key from the local `.state.json` (`system`). Run these
interactive cases one at a time for a given system. ITB routes callbacks by
system key. The loopback bindings are intended for local development; a remote
implementation requires a reachable callback address and deployment configuration.

The FHIR validator runs at `http://fhir-validator:8080` inside Compose and uses
FHIR R4, as required by the specification under test. The IG itself packages
TestPlans using R6. Features that require it load
`hl7.fhir.eu.health-data-api#1.0.0-ballot` through the validator's IG manager.

## Everyday commands

```sh
# Recompile all features without Docker or network (after npm ci).
npm run --prefix itb compile

# Import the compiled suites again, retaining test history and assignments.
node --env-file=itb/.env itb/setup.mjs

# Check the test user's login and all actor/case counts through the UI API.
node --env-file=itb/.env itb/users.mjs

# Real engine check: callback, FHIRPath, response and negative assertion.
# Deploys and removes a temporary suite; never executes an IG conformance case.
node --env-file=itb/.env itb/smoke.mjs

# Inspect or stop this project's containers; persistent volumes remain.
docker compose --env-file itb/.env ps
docker compose --env-file itb/.env logs --tail 100 gitb-srv
docker compose --env-file itb/.env stop
```

Rerunning startup reuses the domain, community, specification, organisation,
system and login. Do not delete `.env`, `.state.json` or `.users.json` while
retaining the database: they belong together. Do not use `down --volumes` unless
you intend to erase this installation's data and test history.

Optional ports: add `ITB_PORT=9001` and/or `ITB_CALLBACK_PORT=8081` to `itb/.env`
before startup if the defaults are occupied. Compose uses a dedicated project
name and volumes and does not claim fixed container names.

## Build and compatibility details

The npm lockfile pins `@opentestbed/otb-gherkin` 0.5.0 and the FHIR validator
dialect 2.0.0. Each feature is compiled independently because that compiler's
multi-file ZIP output contains only the final suite. Archives, TDL and import
diagnostics are generated under `itb/build/`; `manifest.json` records all cases.

`normalize.py` adapts generated TDL to stock ITB 1.30.2. It preserves assertions
while translating incoming HTTP references to `request`, `path` to `uri`,
timeouts to milliseconds, and substring checks to `ExpressionValidator`. Outgoing
URIs use `iri-to-uri` to encode characters such as token-search pipes, and response
header lookups use the lowercase names returned by the HTTP handler.
Validator calls originate from the simulated test-harness actor, and the user
lane is named **Test operator**. Compact evaluation/check labels keep FHIRPath
expressions from dominating the diagram; the full expressions remain in step
request reports. HTTP responses remain part of the corresponding send report.
HTTP replies become `receive/result` steps and outputs, preserving the checks
before the response. It fails on unsupported transformations. This follows the
[ITB 1.30.2 receive-result contract](https://github.com/ISAITB/gitb/blob/1.30.2/gitb-testbed-service/src/test/resources/tdl/msg/msg-http-receive-result-steps.xml).
No generated TDL is committed, and source Gherkin is not rewritten by the build.

The stock ITB images and Java base image are pinned by digest. The validator is
built from the same upstream JAR used by
[OpenTestBed's FHIR plugin](https://github.com/OpenTestBed/itb-plugin-fhir-validator/blob/main/Dockerfile),
with its SHA-256 checked during the build. That upstream `wip` download is
mutable: a replacement fails the checksum until the pin is deliberately updated.
The validator's package cache and the ITB database/repository use named volumes.

| File | Purpose |
| --- | --- |
| `../docker-compose.yml` | Isolated ITB core, FHIR validator and persistent volumes |
| `start.sh` | Install, compile, start, import and provision the test user |
| `compile.mjs`, `normalize.py` | Build a deployable ZIP per feature |
| `setup.mjs` | REST bootstrap, suite import and actor assignment |
| `users.mjs` | Local login provisioning and UI access verification |
| `smoke.mjs`, `tests/smoke.feature` | Positive and negative engine integration checks |
| `validator/Dockerfile` | Checksum-pinned FHIR validator REST service |
| `.env`, `.state.json`, `.users.json` | Ignored local configuration and credentials |

## Exercise the provider scenarios against EIR

For the proposed shared-instance workflow, see [Fixture campaigns for a central
ITB installation](fixture-campaign-proposal.md). It distinguishes the existing
local ID mapping from the campaign lifecycle still needing discussion.

The optional EIR setup uses a pinned server image, an in-memory database and the
`dev,disable-security` profiles. It listens only on `localhost:8082`; restarting
the server clears its FHIR data. This is an execution check, not a secured EHDS
conformance deployment.

```sh
./itb/start.sh
docker compose -f itb/eir-compose.yml up -d
# Wait until http://localhost:8082/fhir/metadata responds.
node --env-file=itb/.env itb/eir-run.mjs
```

The runner seeds two synthetic patients, all ten clinical resource types for each
patient, and Binary/DocumentReference fixtures. It runs all 48 Document Access Provider, Grouped Provider and Resource
Access Provider cases. It creates a separate **EIR development server** system
and **EU API — EIR development run** specification, visible to the same test user.
Consumer and publisher cases need a client implementation and are not run.

The source features and assertions remain unchanged. Copies of the compiled suites
target `http://host.docker.internal:8082/fhir` and add a two-minute input timeout:
ITB otherwise automatically completes REST-launched input forms with empty inputs.
The runner answers those forms through the UI API. Tokens are explicit dummy
values because EIR security is disabled; authorization rejection cases are
expected to fail. The ten clinical search cases require matching entries of the
expected resource type, a patient reference on every match, and the requested
patient ID on all matches. Explicit `_include` entries are excluded from these
checks; missing search metadata is treated as a match. Target and control
fixtures use the same filters so a server ignoring the patient filter is caught.

Results, session IDs and XML reports are saved under `itb/build/eir/`, with the
latest run summarized in `results.json`. An optional regular expression selects
cases, for example `node --env-file=itb/.env itb/eir-run.mjs 'rap-005|dap-015'`.
Every run loads the published transaction from
`input/testing/fixtures/provider-v1/bundle.json`, records the server-assigned IDs,
and checks 27 resources and 19 searches before running ITB cases. All fixtures,
including Binary and DocumentReference, use conditional create. Results are in
`fixture-bindings.json` and `fixture-verification.json` under `itb/build/eir/`.
The fixture contract and per-case expectations are in the fixture directory's
README and manifest. The helper can also verify manually imported data with
different IDs. Stop this optional stack with
`docker compose -f itb/eir-compose.yml stop`.

Only `dap-012`, `grp-012`, `rap-004`, `pub-003` and `pub-004` load the EU API IG
into the validator: they validate against its dependency profiles. Core Bundle
validation and FHIRPath checks do not require that package load. Loading the IG
configures the validator; loading the fixture transaction populates the SUT.

Check fixture consistency and run isolated structural/profile validation:

```sh
node scripts/build-fixtures.mjs --check
node --test scripts/fixture-data.test.mjs
node scripts/validate-fixtures.mjs
```

The last command uses the pinned validator image and existing cache in an isolated
JVM with external terminology disabled (`-tx n/a`). It validates all resources
and both EU Core Patient profiles without ignoring slicing errors. Reports are
under `itb/build/fixture-validation/`; it is not evidence of complete terminology
validation. EIR's externalized Binary bytes are verified using `$binary-access-read`
and recorded as such, not counted as proof of standard Binary content retrieval.

Run the 140 positive/negative FHIRPath regression checks from the repository root:

```sh
docker run --rm --network eu-health-data-api-itb_default \
  --mount type=bind,source="$PWD",target=/work,readonly -w /work \
  node:22-alpine node itb/test-search-assertions.mjs
```

These evaluate the actual source-feature assertions against the running validator,
including empty results, wrong types, wrong/mixed patients, missing references,
explicit includes, and relative/absolute/versioned references. Historical ITB
sessions retain their original diagrams; open a newly executed session to see
the corrected mapping and assertions.
