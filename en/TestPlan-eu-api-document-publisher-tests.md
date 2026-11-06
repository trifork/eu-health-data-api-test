# Document Publisher Test Plan - EU Health Data API: TestPlans and Gherkin for the EEHRxF API actors v0.1.0

## TestPlan: Document Publisher Test Plan (Experimental) 

**Scopes**

* **Reference**: `http://hl7.eu/fhir/health-data-api/ActorDefinition/document-publisher-actor-eu-api`
  * **Description**: The Document Publisher, a client that obtains a SMART Backend Services token, looks the patient up and publishes documents by Simplified Publish [ITI-105], is the system under test. The test bed plays the Access Provider.

**1 Suite: SMART Backend Services authorization**

Rule: SMART Backend Services authorization — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-document-publisher.feature

**Tests**

* **Name**: pub-001 The SUT authenticates with a signed JWT client assertion (RFC 7523)
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.pub-001 (input bindings and expected data). Covers security.smart-backend-services.
  * **Operation**: gherkin/Scenario

-------

**2 Suite: Patient lookup [ITI-78]**

Rule: Patient lookup [ITI-78] — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-document-publisher.feature

**Tests**

* **Name**: pub-002 The SUT looks the patient up by identifier with a bearer token
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.pub-002 (input bindings and expected data). Covers Patient.search-type, Patient.search.identifier.
  * **Operation**: gherkin/Scenario

-------

**3 Suite: Simplified Publish [ITI-105]**

Rule: Simplified Publish [ITI-105] — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-document-publisher.feature

**Tests**

* **Name**: pub-003 The SUT creates a DocumentReference with the document embedded
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.pub-003 (input bindings and expected data). Covers DocumentReference.create.
  * **Operation**: gherkin/Scenario
* **Name**: pub-004 The SUT publishes only the minimal metadata profile it claims
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.pub-004 (input bindings and expected data). Covers DocumentReference.create.
  * **Operation**: gherkin/Scenario
* **Name**: pub-005 After a 401 the SUT obtains a fresh token before retrying
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.pub-005 (input bindings and expected data). Covers security.authorization.
  * **Operation**: gherkin/Scenario

-------

**4 Suite: Transport security**

Rule: Transport security — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-document-publisher.feature

**Tests**

* **Name**: pub-006 TLS 1.2 or higher is used for all communications
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.pub-006 (input bindings and expected data). Covers security.tls.
  * **Operation**: gherkin/Scenario



## Resource Content

```json
{
  "resourceType" : "TestPlan",
  "resourceDefinition" : "http://hl7.org/fhir/StructureDefinition/TestPlan|0.1.0-snapshot1",
  "id" : "eu-api-document-publisher-tests",
  "url" : "http://example.com/fhir/hl7.fhir.eu.health-data-api.test/TestPlan/eu-api-document-publisher-tests",
  "version" : "0.1.0",
  "name" : "DocumentPublisherTestPlan",
  "title" : "Document Publisher Test Plan",
  "status" : "draft",
  "experimental" : true,
  "date" : "2026-11-06",
  "publisher" : "Jens Kristian Villadsen",
  "contact" : [{
    "name" : "Jens Kristian Villadsen",
    "telecom" : [{
      "system" : "url",
      "value" : "https://trifork.com"
    }]
  }],
  "description" : "Test plan for the **Document Publisher** actor of [EU Health Data API, 1.0.0-ballot](https://build.fhir.org/ig/euridice-org/eu-health-data-api/).\nThe SUT obtains a token, finds the patient, and publishes a document with embedded content.\nEach `suite` below is a `Rule:` of the Gherkin feature named by `suite.input.file`, and each `suite.test` one of its `Scenario:` lines, matched by the scenario's identifier. The assertions are the scenario's `Then` steps, verbatim.\nThe tests declare which specification obligations they cover (7 requirement paths named by the feature tags).\nFixture prerequisites, input bindings and expected data are in tests/fixtures/provider-v1/manifest.json, keyed by scenario ID. See the Testing page, Fixture contract and expected results. Provider fixtures are R4; client workflows use the canned data embedded in their feature.",
  "jurisdiction" : [{
    "coding" : [{
      "system" : "http://unstats.un.org/unsd/methods/m49/m49.htm",
      "code" : "001",
      "display" : "World"
    }]
  }],
  "purpose" : "To declare, in a machine-readable and runnable form, which behaviours a system claiming conformance to the Document Publisher actor must demonstrate.",
  "scope" : [{
    "reference" : "http://hl7.eu/fhir/health-data-api/ActorDefinition/document-publisher-actor-eu-api",
    "description" : "The Document Publisher, a client that obtains a SMART Backend Services token, looks the patient up and publishes documents by Simplified Publish [ITI-105], is the system under test. The test bed plays the Access Provider."
  }],
  "runner" : "https://www.itb.ec.europa.eu/docs/guides/latest/",
  "suite" : [{
    "name" : "SMART Backend Services authorization",
    "description" : "Rule: SMART Backend Services authorization — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-document-publisher.feature"
    }],
    "test" : [{
      "name" : "pub-001 The SUT authenticates with a signed JWT client assertion (RFC 7523)",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.pub-001 (input bindings and expected data). Covers security.smart-backend-services.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$received.method should be \"POST\""
      },
      {
        "severity" : "error",
        "human" : "$received.body should contain \"grant_type=client_credentials\""
      },
      {
        "severity" : "error",
        "human" : "$received.body should contain \"client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer\""
      },
      {
        "severity" : "error",
        "human" : "$received.body should match \"client_assertion=[A-Za-z0-9_-]+[.][A-Za-z0-9_-]+[.][A-Za-z0-9_-]+([&]|$)\""
      },
      {
        "severity" : "error",
        "human" : "$received.body should contain \"scope=\""
      },
      {
        "severity" : "error",
        "human" : "AccessProvider replies to DocumentPublisher with status 200 and:"
      }]
    }]
  },
  {
    "name" : "Patient lookup [ITI-78]",
    "description" : "Rule: Patient lookup [ITI-78] — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-document-publisher.feature"
    }],
    "test" : [{
      "name" : "pub-002 The SUT looks the patient up by identifier with a bearer token",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.pub-002 (input bindings and expected data). Covers Patient.search-type, Patient.search.identifier.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$received.method should be \"GET\""
      },
      {
        "severity" : "error",
        "human" : "$received.path should contain \"/Patient\""
      },
      {
        "severity" : "error",
        "human" : "$received.path should contain \"identifier=\""
      },
      {
        "severity" : "error",
        "human" : "$received.headers.Authorization should contain \"Bearer\""
      },
      {
        "severity" : "error",
        "human" : "AccessProvider replies to DocumentPublisher with status 200 and:"
      }]
    }]
  },
  {
    "name" : "Simplified Publish [ITI-105]",
    "description" : "Rule: Simplified Publish [ITI-105] — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-document-publisher.feature"
    }],
    "test" : [{
      "name" : "pub-003 The SUT creates a DocumentReference with the document embedded",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.pub-003 (input bindings and expected data). Covers DocumentReference.create.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$received.method should be \"POST\""
      },
      {
        "severity" : "error",
        "human" : "$received.path should contain \"/DocumentReference\""
      },
      {
        "severity" : "error",
        "human" : "$received.headers.Authorization should contain \"Bearer\""
      },
      {
        "severity" : "error",
        "human" : "$received.body at \"DocumentReference.resourceType\" should be \"DocumentReference\""
      },
      {
        "severity" : "error",
        "human" : "$received.body at \"DocumentReference.content.attachment.data.exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$received.body at \"DocumentReference.subject.exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$received.body should conform to \"https://profiles.ihe.net/ITI/MHD/StructureDefinition/IHE.MHD.SimplifiedPublish.DocumentReference\" ignoring slicing errors"
      },
      {
        "severity" : "error",
        "human" : "AccessProvider replies to DocumentPublisher with status 201 and:"
      }]
    },
    {
      "name" : "pub-004 The SUT publishes only the minimal metadata profile it claims",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.pub-004 (input bindings and expected data). Covers DocumentReference.create.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$received.body should conform to \"https://profiles.ihe.net/ITI/MHD/StructureDefinition/IHE.MHD.Minimal.DocumentReference\" ignoring slicing errors"
      },
      {
        "severity" : "error",
        "human" : "AccessProvider replies to DocumentPublisher with status 201 and:"
      }]
    },
    {
      "name" : "pub-005 After a 401 the SUT obtains a fresh token before retrying",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.pub-005 (input bindings and expected data). Covers security.authorization.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$received.method should be \"POST\""
      },
      {
        "severity" : "error",
        "human" : "$received.path should contain \"/DocumentReference\""
      },
      {
        "severity" : "error",
        "human" : "AccessProvider replies to DocumentPublisher with status 401 and:"
      },
      {
        "severity" : "error",
        "human" : "$received.method should be \"POST\""
      },
      {
        "severity" : "error",
        "human" : "$received.body should contain \"grant_type=client_credentials\""
      },
      {
        "severity" : "error",
        "human" : "$received.body should match \"client_assertion=[A-Za-z0-9_-]+[.][A-Za-z0-9_-]+[.][A-Za-z0-9_-]+([&]|$)\""
      },
      {
        "severity" : "error",
        "human" : "AccessProvider replies to DocumentPublisher with status 200 and:"
      },
      {
        "severity" : "error",
        "human" : "$received.method should be \"POST\""
      },
      {
        "severity" : "error",
        "human" : "$received.path should contain \"/DocumentReference\""
      },
      {
        "severity" : "error",
        "human" : "$received.headers.Authorization should contain \"otb-fresh-token\""
      },
      {
        "severity" : "error",
        "human" : "AccessProvider replies to DocumentPublisher with status 201 and:"
      }]
    }]
  },
  {
    "name" : "Transport security",
    "description" : "Rule: Transport security — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-document-publisher.feature"
    }],
    "test" : [{
      "name" : "pub-006 TLS 1.2 or higher is used for all communications",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.pub-006 (input bindings and expected data). Covers security.tls.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "TLS >= 1.2 — DocumentPublisher confirms each of these is accepted for \"the connection\""
      }]
    }]
  }]
}

```
