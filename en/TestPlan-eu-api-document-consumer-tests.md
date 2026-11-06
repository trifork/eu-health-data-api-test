# Document Consumer Test Plan - EU Health Data API: TestPlans and Gherkin for the EEHRxF API actors v0.1.0

## TestPlan: Document Consumer Test Plan (Experimental) 

**Scopes**

* **Reference**: `http://hl7.eu/fhir/health-data-api/ActorDefinition/document-consumer-actor-eu-api`
  * **Description**: The Document Consumer, a client that finds and retrieves documents from an Access Provider, is the system under test. The test bed plays the Access Provider.

**1 Suite: SMART Backend Services authorization**

Rule: SMART Backend Services authorization — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-document-consumer.feature

**Tests**

* **Name**: con-001 The SUT authenticates with a signed JWT client assertion (RFC 7523)
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.con-001 (input bindings and expected data). Covers security.smart-backend-services.
  * **Operation**: gherkin/Scenario

-------

**2 Suite: Patient lookup [ITI-78]**

Rule: Patient lookup [ITI-78] — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-document-consumer.feature

**Tests**

* **Name**: con-002 The SUT searches Patient by the identifier parameter
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.con-002 (input bindings and expected data). Covers Patient.search-type, Patient.search.identifier.
  * **Operation**: gherkin/Scenario

-------

**3 Suite: Find Document References [ITI-67]**

Rule: Find Document References [ITI-67] — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-document-consumer.feature

**Tests**

* **Name**: con-003 The SUT searches DocumentReference by patient
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.con-003 (input bindings and expected data). Covers DocumentReference.search-type.
  * **Operation**: gherkin/Scenario
* **Name**: con-004 The SUT can narrow the search by category or type
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.con-004 (input bindings and expected data). Covers DocumentReference.search-type.
  * **Operation**: gherkin/Scenario

-------

**4 Suite: Retrieve Document [ITI-68]**

Rule: Retrieve Document [ITI-68] — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-document-consumer.feature

**Tests**

* **Name**: con-005 The SUT retrieves the document content with a bearer token
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.con-005 (input bindings and expected data). Covers Binary.read, DocumentReference.read.
  * **Operation**: gherkin/Scenario

-------

**5 Suite: Transport security**

Rule: Transport security — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-document-consumer.feature

**Tests**

* **Name**: con-006 TLS 1.2 or higher is used for all communications
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.con-006 (input bindings and expected data). Covers security.tls.
  * **Operation**: gherkin/Scenario



## Resource Content

```json
{
  "resourceType" : "TestPlan",
  "resourceDefinition" : "http://hl7.org/fhir/StructureDefinition/TestPlan|0.1.0-snapshot1",
  "id" : "eu-api-document-consumer-tests",
  "url" : "http://example.com/fhir/hl7.fhir.eu.health-data-api.test/TestPlan/eu-api-document-consumer-tests",
  "version" : "0.1.0",
  "name" : "DocumentConsumerTestPlan",
  "title" : "Document Consumer Test Plan",
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
  "description" : "Test plan for the **Document Consumer** actor of [EU Health Data API, 1.0.0-ballot](https://build.fhir.org/ig/euridice-org/eu-health-data-api/).\nThe SUT obtains a token, finds the patient, finds the documents and retrieves one.\nEach `suite` below is a `Rule:` of the Gherkin feature named by `suite.input.file`, and each `suite.test` one of its `Scenario:` lines, matched by the scenario's identifier. The assertions are the scenario's `Then` steps, verbatim.\nThe tests declare which specification obligations they cover (8 requirement paths named by the feature tags).\nFixture prerequisites, input bindings and expected data are in tests/fixtures/provider-v1/manifest.json, keyed by scenario ID. See the Testing page, Fixture contract and expected results. Provider fixtures are R4; client workflows use the canned data embedded in their feature.",
  "jurisdiction" : [{
    "coding" : [{
      "system" : "http://unstats.un.org/unsd/methods/m49/m49.htm",
      "code" : "001",
      "display" : "World"
    }]
  }],
  "purpose" : "To declare, in a machine-readable and runnable form, which behaviours a system claiming conformance to the Document Consumer actor must demonstrate.",
  "scope" : [{
    "reference" : "http://hl7.eu/fhir/health-data-api/ActorDefinition/document-consumer-actor-eu-api",
    "description" : "The Document Consumer, a client that finds and retrieves documents from an Access Provider, is the system under test. The test bed plays the Access Provider."
  }],
  "runner" : "https://www.itb.ec.europa.eu/docs/guides/latest/",
  "suite" : [{
    "name" : "SMART Backend Services authorization",
    "description" : "Rule: SMART Backend Services authorization — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-document-consumer.feature"
    }],
    "test" : [{
      "name" : "con-001 The SUT authenticates with a signed JWT client assertion (RFC 7523)",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.con-001 (input bindings and expected data). Covers security.smart-backend-services.",
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
        "human" : "AccessProvider replies to DocumentConsumer with status 200 and:"
      }]
    }]
  },
  {
    "name" : "Patient lookup [ITI-78]",
    "description" : "Rule: Patient lookup [ITI-78] — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-document-consumer.feature"
    }],
    "test" : [{
      "name" : "con-002 The SUT searches Patient by the identifier parameter",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.con-002 (input bindings and expected data). Covers Patient.search-type, Patient.search.identifier.",
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
        "human" : "AccessProvider replies to DocumentConsumer with status 200 and:"
      }]
    }]
  },
  {
    "name" : "Find Document References [ITI-67]",
    "description" : "Rule: Find Document References [ITI-67] — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-document-consumer.feature"
    }],
    "test" : [{
      "name" : "con-003 The SUT searches DocumentReference by patient",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.con-003 (input bindings and expected data). Covers DocumentReference.search-type.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$received.method should be \"GET\""
      },
      {
        "severity" : "error",
        "human" : "$received.path should contain \"/DocumentReference\""
      },
      {
        "severity" : "error",
        "human" : "$received.path should match \"patient=(Patient(/|%2F))?otb-pat-1([&]|$)\""
      },
      {
        "severity" : "error",
        "human" : "$received.headers.Authorization should contain \"Bearer\""
      },
      {
        "severity" : "error",
        "human" : "AccessProvider replies to DocumentConsumer with status 200 and:"
      }]
    },
    {
      "name" : "con-004 The SUT can narrow the search by category or type",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.con-004 (input bindings and expected data). Covers DocumentReference.search-type.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$received.method should be \"GET\""
      },
      {
        "severity" : "error",
        "human" : "$received.path should contain \"/DocumentReference\""
      },
      {
        "severity" : "error",
        "human" : "$received.path should match \"patient=(Patient(/|%2F))?otb-pat-1([&]|$)\""
      },
      {
        "severity" : "error",
        "human" : "$received.path should match \"[?&](type|category)=\""
      },
      {
        "severity" : "error",
        "human" : "AccessProvider replies to DocumentConsumer with status 200 and:"
      }]
    }]
  },
  {
    "name" : "Retrieve Document [ITI-68]",
    "description" : "Rule: Retrieve Document [ITI-68] — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-document-consumer.feature"
    }],
    "test" : [{
      "name" : "con-005 The SUT retrieves the document content with a bearer token",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.con-005 (input bindings and expected data). Covers Binary.read, DocumentReference.read.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$received.method should be \"GET\""
      },
      {
        "severity" : "error",
        "human" : "$received.path should match \"Binary/otb-bin-1([?#]|$)\""
      },
      {
        "severity" : "error",
        "human" : "$received.headers.Authorization should contain \"Bearer\""
      },
      {
        "severity" : "error",
        "human" : "AccessProvider replies to DocumentConsumer with status 200 and:"
      }]
    }]
  },
  {
    "name" : "Transport security",
    "description" : "Rule: Transport security — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-document-consumer.feature"
    }],
    "test" : [{
      "name" : "con-006 TLS 1.2 or higher is used for all communications",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.con-006 (input bindings and expected data). Covers security.tls.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "TLS >= 1.2 — DocumentConsumer confirms each of these is accepted for \"the connection\""
      }]
    }]
  }]
}

```
