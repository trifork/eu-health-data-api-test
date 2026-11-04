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

## Configure an implementation

The provider features currently use `http://ehr.example.org/fhir`. Replace that
placeholder in the relevant source feature with your implementation's base URL,
then rerun `./itb/start.sh`. For a server running on the Docker host, use
`http://host.docker.internal:<port>/<path>` so the engine can reach it.

Provider cases prompt for SMART access tokens, patient/resource identifiers and
other reference data. Consumer and publisher cases instruct the operator and
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
timeouts to milliseconds, and substring checks to `ExpressionValidator`.
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
