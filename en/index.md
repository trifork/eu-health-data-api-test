# Home - EU Health Data API: TestPlans and Gherkin for the EEHRxF API actors v0.1.0

## Home

A demonstration IG that declares, as TestPlan resources and Gherkin feature files, the conformance tests for the six actors of the EU Health Data API IG (EHDS Annex II): Document Publisher, Document Access Provider (with the Document Submission Option), Document Consumer, grouped Document Publisher/Access Provider, Resource Access Provider and Resource Consumer. The IG states its requirements as capabilitystatement-expectation extensions rather than profile obligations, so every test case is traceable to the CapabilityStatement expectation it tests.

> **This is not an approved HL7 Europe test specification. Successful test execution does not establish conformance; this guide exists to exercise the tooling.**The guide publishes actor-scoped TestPlans, executable Gherkin, and a versioned synthetic fixture contract.

### What is here

| | |
| :--- | :--- |
| [Testing](testing.md) | Test prerequisites, fixtures, input bindings, expected results and executable Gherkin. |
| [Method](process.md) | The step-by-step record of how these tests were produced and checked. |
| [Artifacts](artifacts.md) | The six TestPlan resources, one per actor, and the Gherkin scripts they name. |
| [Downloads](downloads.md) | The published package, including the raw`.feature`files under`tests/gherkin/`. |

One test plan per actor of the [EU Health Data API](https://build.fhir.org/ig/euridice-org/eu-health-data-api/). The IG states its requirements as SHALL/SHOULD expectations on its CapabilityStatements, so each test names the expectation it tests:

* **[Document Publisher Test Plan](TestPlan-eu-api-document-publisher-tests.md)** — the publisher authenticates, finds the patient and publishes a conformant DocumentReference with embedded content ([Gherkin](Binary-eu-api-document-publisher-gherkin-script.md))
* **[Document Access Provider Test Plan](TestPlan-eu-api-document-access-provider-tests.md)** — the server enforces SMART Backend Services, answers document search and retrieval, and where claimed accepts and refuses submissions correctly ([Gherkin](Binary-eu-api-document-access-provider-gherkin-script.md))
* **[Document Consumer Test Plan](TestPlan-eu-api-document-consumer-tests.md)** — the consumer authenticates, looks the patient up, and searches and retrieves documents with the transactions the IG names ([Gherkin](Binary-eu-api-document-consumer-gherkin-script.md))
* **[Grouped Document Publisher/Access Provider Test Plan](TestPlan-eu-api-document-publisher-access-provider-tests.md)** — the server exposes document search and retrieval behind SMART Backend Services ([Gherkin](Binary-eu-api-document-publisher-access-provider-gherkin-script.md))
* **[Resource Access Provider Test Plan](TestPlan-eu-api-resource-access-provider-tests.md)** — the server enforces authorization and answers patient and search-by-patient requests for each resource type it offers ([Gherkin](Binary-eu-api-resource-access-provider-gherkin-script.md))
* **[Resource Consumer Test Plan](TestPlan-eu-api-resource-consumer-tests.md)** — the consumer authenticates, finds the patient and searches resources by patient ([Gherkin](Binary-eu-api-resource-consumer-gherkin-script.md))

All are written for the [Interoperability Test Bed](https://www.itb.ec.europa.eu/docs/guides/latest/) in the OTB Gherkin language (generation 2).

The top menu navigates the sections, and a [Table of Contents](toc.md) lists the full content.

