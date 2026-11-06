# EU API provider fixtures v1

Synthetic FHIR R4 (4.0.1) data, fixture contract version 1.0.0. No real people or clinical records.

## Files

- `bundle.json`: 27 resources in a transaction using conditional POST and internal UUID references.
- `bindings.example.json`: maps logical fixture names to IDs in your implementation.
- `manifest.json`: all 67 case IDs, per-case prerequisites and inputs, expected fixture outcomes, current Gherkin assertions, and reusable search checks.

## Load by any supported method

Use a transaction, an administrative import, or enter equivalent data through the application's normal workflow. Transaction support is **not** a conformance requirement of these tests. Keep the specified identifiers, demographic values, codes, document content, and relationships. The JSON resources are the concrete data specification. If the server assigns IDs, copy the bindings template and replace the IDs; also map all patient and document references when importing. Do not change the business identifiers.

For a test server supporting transactions and conditional create, POST `bundle.json` to its FHIR base URL with `Content-Type: application/fhir+json`. Conditional creates use the fixture identifiers (and Binary tags) to avoid duplicates on repeat loads. Existing fixtures are not reset: changed data must be reconciled by the operator. Capture each transaction-response location and use its assigned ID in the bindings. Internal UUID references are resolved by the transaction processor; manual imports must preserve the same relationships. Binary content is synthetic plain text, not an IPS clinical document.

The repository helper can load and verify the complete dataset:

```sh
FHIR_BASE_URL=http://localhost:8082/fhir node scripts/fixture-data.mjs load itb/build/fixture-bindings.json
FHIR_BASE_URL=http://localhost:8082/fhir node scripts/fixture-data.mjs verify itb/build/fixture-bindings.json
# For manually imported data with different IDs:
FHIR_BASE_URL=https://your-test-server/fhir node scripts/fixture-data.mjs verify /path/to/bindings.json
```

Use `FHIR_AUTHORIZATION` for the helper's existing authorization header when needed. It is never stored in the fixtures. The helper's full-dataset verification requires read/search access to every supplied type. For a partial implementation, load the applicable subset and use the case-specific requirements in the manifest. Unsupported optional capabilities are not made mandatory by supplying fixtures.

## Inputs supplied to ITB

- `patientIdentifier`: `urn:uuid:47df6faa-4581-4545-9f2d-7d8c8db0c3e7|EU-API-PATIENT-TARGET`
- `patientId`: ID mapped by `patient-target`.
- `documentId`: ID mapped by `document-target`.
- `binaryId`: ID mapped by `binary-target`.
- `submitPatientRef`: `Patient/<mapped patient-target ID>`.
- `accessToken` and `narrowToken`: issued by the implementation's authorization system, never sample credentials. The positive token needs the read/search or create permissions used by that case.

## Expected results

The reference patient is active, given name Synthetic, family EUAPITestpatient, gender unknown, born 1990-01-01. The control patient has a different identifier, family, gender and birth date. Each has one of each of the ten clinical resource types.

Document search for the target patient includes the target summary and target laboratory document; it excludes the control patient's document. Category Patient-Summaries and type 60591-5 each select the target summary and exclude both the laboratory distractor and control document. Each clinical patient search includes its target fixture and excludes its control fixture. Patient identifier and ID searches identify the target patient. Do not require global exact counts in a populated server; evaluate all pages. `dap-015` creates additional matching data.

| Case | Required fixture keys | Inputs | Expected outcome |
| --- | --- | --- | --- |
| dap-001 | None | None | No fixture or token required. The live server must declare the capabilities named by the assertions. |
| dap-002 | None | None | No fixture or token required. The live server must declare the capabilities named by the assertions. |
| dap-003 | patient-target | patientId | Reject the request with the status in the assertions. Authorization and scope configuration are external prerequisites, not fixture resources. |
| dap-004 | patient-target | narrowToken, patientId | Reject the request with the status in the assertions. Authorization and scope configuration are external prerequisites, not fixture resources. |
| dap-005 | patient-target, document-target, document-laboratory, document-control, binary-target, patient-control, binary-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| dap-006 | patient-target, document-target, document-control, document-laboratory, binary-target, patient-control, binary-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| dap-007 | patient-target, document-target, document-control, document-laboratory, binary-target, patient-control, binary-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| dap-008 | document-target, patient-target, binary-target | accessToken, documentId | Read the bound target DocumentReference: current, type 60591-5, category Patient-Summaries, subject target patient and attachment URL pointing to the target Binary. |
| dap-009 | None | accessToken | The reserved otb-no-such-* identifier in the feature must not exist; expect 404 and an OperationOutcome. |
| dap-010 | binary-target, patient-target | accessToken, binaryId | Read the bound target Binary. Its content type is text/plain and decoded data matches the bundled synthetic target document. |
| dap-011 | patient-target, patient-control | accessToken, patientIdentifier | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| dap-012 | patient-target | accessToken, patientId | Read the bound target patient: active, Synthetic EUAPITestpatient, gender unknown, birth date 1990-01-01, and the declared fixture identifier. |
| dap-013 | patient-target, patient-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| dap-014 | None | None | No fixture or token required. The live server must declare the capabilities named by the assertions. |
| dap-015 | patient-target | accessToken, submitPatientRef | Create a new document for the bound target patient, return 201 and Location. This changes server state; the fixture search expectations are inclusion/exclusion checks, not global exact counts. |
| dap-016 | None | accessToken | Reject the malformed submission with 400 or 422. No invalid resource is preloaded. |
| dap-017 | None | narrowToken | Reject the request with the status in the assertions. Authorization and scope configuration are external prerequisites, not fixture resources. |
| con-001 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |
| con-002 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |
| con-003 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |
| con-004 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |
| con-005 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |
| con-006 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |
| grp-001 | None | None | No fixture or token required. The live server must declare the capabilities named by the assertions. |
| grp-002 | None | None | No fixture or token required. The live server must declare the capabilities named by the assertions. |
| grp-003 | patient-target | patientId | Reject the request with the status in the assertions. Authorization and scope configuration are external prerequisites, not fixture resources. |
| grp-004 | patient-target | narrowToken, patientId | Reject the request with the status in the assertions. Authorization and scope configuration are external prerequisites, not fixture resources. |
| grp-005 | patient-target, document-target, document-laboratory, document-control, binary-target, patient-control, binary-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| grp-006 | patient-target, document-target, document-control, document-laboratory, binary-target, patient-control, binary-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| grp-007 | patient-target, document-target, document-control, document-laboratory, binary-target, patient-control, binary-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| grp-008 | document-target, patient-target, binary-target | accessToken, documentId | Read the bound target DocumentReference: current, type 60591-5, category Patient-Summaries, subject target patient and attachment URL pointing to the target Binary. |
| grp-009 | None | accessToken | The reserved otb-no-such-* identifier in the feature must not exist; expect 404 and an OperationOutcome. |
| grp-010 | binary-target, patient-target | accessToken, binaryId | Read the bound target Binary. Its content type is text/plain and decoded data matches the bundled synthetic target document. |
| grp-011 | patient-target, patient-control | accessToken, patientIdentifier | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| grp-012 | patient-target | accessToken, patientId | Read the bound target patient: active, Synthetic EUAPITestpatient, gender unknown, birth date 1990-01-01, and the declared fixture identifier. |
| grp-013 | patient-target, patient-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| pub-001 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |
| pub-002 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |
| pub-003 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |
| pub-004 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |
| pub-005 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |
| pub-006 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |
| rap-001 | None | None | No fixture or token required. The live server must declare the capabilities named by the assertions. |
| rap-002 | patient-target | patientIdentifier | Reject the request with the status in the assertions. Authorization and scope configuration are external prerequisites, not fixture resources. |
| rap-003 | patient-target | narrowToken, patientId | Reject the request with the status in the assertions. Authorization and scope configuration are external prerequisites, not fixture resources. |
| rap-004 | patient-target | accessToken, patientId | Read the bound target patient: active, Synthetic EUAPITestpatient, gender unknown, birth date 1990-01-01, and the declared fixture identifier. |
| rap-005 | patient-target, patient-control | accessToken, patientIdentifier, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| rap-006 | patient-target, patient-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| rap-007 | patient-target, condition-target, condition-control, patient-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| rap-008 | patient-target, allergyintolerance-target, allergyintolerance-control, patient-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| rap-009 | patient-target, observation-target, observation-control, patient-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| rap-010 | patient-target, diagnosticreport-target, diagnosticreport-control, patient-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| rap-011 | patient-target, imagingstudy-target, imagingstudy-control, patient-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| rap-012 | patient-target, medicationrequest-target, medicationrequest-control, patient-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| rap-013 | patient-target, medicationdispense-target, medicationdispense-control, patient-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| rap-014 | patient-target, immunization-target, immunization-control, patient-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| rap-015 | patient-target, medicationstatement-target, medicationstatement-control, patient-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| rap-016 | patient-target, encounter-target, encounter-control, patient-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| rap-017 | patient-target, observation-target, observation-control, patient-control | accessToken, patientId | The searches must include and exclude the fixture resources specified in searchChecks. Extra unrelated server data is allowed only if it matches the query. |
| rap-018 | None | accessToken | The reserved otb-no-such-* identifier in the feature must not exist; expect 404 and an OperationOutcome. |
| rc-001 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |
| rc-002 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |
| rc-003 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |
| rc-004 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |
| rc-005 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |
| rc-006 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |
| rc-007 | Embedded client workflow | None | The test bed supplies the canned responses in the feature; configure the client to perform the requested workflow. Provider preload is not used. |

## What this establishes

The manifest expresses the fixture contract; its `assertions` list records what the existing Gherkin actually checks. The generic Gherkin cases are not yet assertions of every fixture field. For example, a Patient read currently checks profile conformance, whereas the fixture verifier also checks the declared demographic values. The current Gherkin profile checks ignore slicing errors. The separate fixture validation command validates all 27 resources against core R4 and both patients against EU Core Patient without suppressing slicing errors; external terminology is disabled and its warnings are reported. This fixture set does not claim MHD Minimal metadata or IPS document-content conformance. When Binary data is externalized with the HAPI extension, the fixture checker verifies stored bytes using `$binary-access-read` and reports this explicitly; this does not prove standard Binary content retrieval. The fixture checker verifies data and search membership; it does not replace a FHIR profile validator or the authorization tests.

The 19 client cases use embedded requests/responses and operator-driven workflows from their features. This provider dataset is not an executable client implementation. CapabilityStatement, TLS and token/scope behavior are external prerequisites, not properties a transaction bundle can install.

R4 fixtures travel under `package/tests/fixtures/provider-v1/`, not as R6 examples or resources in this TestPlan IG. Generate/check with `node scripts/build-fixtures.mjs` / `node scripts/build-fixtures.mjs --check`. The local EIR runner loads this same bundle and uses these bindings.
