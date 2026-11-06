# Resource Consumer Test Plan - EU Health Data API: TestPlans and Gherkin for the EEHRxF API actors v0.1.0

## TestPlan: Resource Consumer Test Plan (Experimental) 

**Scopes**

* **Reference**: `http://hl7.eu/fhir/health-data-api/ActorDefinition/resource-consumer-actor-eu-api`
  * **Description**: The Resource Consumer, a client that reads patient resources from a Resource Access Provider, is the system under test. The test bed plays the provider.

**1 Suite: SMART Backend Services authorization**

Rule: SMART Backend Services authorization — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-resource-consumer.feature

**Tests**

* **Name**: rc-001 The SUT authenticates with a signed JWT client assertion (RFC 7523)
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-001 (input bindings and expected data). Covers security.smart-backend-services.
  * **Operation**: gherkin/Scenario

-------

**2 Suite: Patient lookup**

Rule: Patient lookup — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-resource-consumer.feature

**Tests**

* **Name**: rc-002 The SUT searches Patient by the identifier parameter
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-002 (input bindings and expected data). Covers Patient.search-type, Patient.search.identifier.
  * **Operation**: gherkin/Scenario
* **Name**: rc-003 The SUT reads the patient by logical id
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-003 (input bindings and expected data). Covers Patient.read.
  * **Operation**: gherkin/Scenario

-------

**3 Suite: Search by patient**

Rule: Search by patient — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-resource-consumer.feature

**Tests**

* **Name**: rc-004 The SUT searches Condition by the patient parameter
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-004 (input bindings and expected data). Covers Condition.search.patient.
  * **Operation**: gherkin/Scenario
* **Name**: rc-005 The SUT searches Observation by patient and category
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-005 (input bindings and expected data). Covers Observation.search.patient, Observation.search.category, Observation.search.code, Observation.search.date.
  * **Operation**: gherkin/Scenario
* **Name**: rc-006 The SUT searches AllergyIntolerance by the patient parameter
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-006 (input bindings and expected data). Covers AllergyIntolerance.search.patient.
  * **Operation**: gherkin/Scenario

-------

**4 Suite: Transport security**

Rule: Transport security — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-resource-consumer.feature

**Tests**

* **Name**: rc-007 TLS 1.2 or higher is used for all communications
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-007 (input bindings and expected data). Covers security.tls.
  * **Operation**: gherkin/Scenario



## Resource Content

```json
{
  "resourceType" : "TestPlan",
  "resourceDefinition" : "http://hl7.org/fhir/StructureDefinition/TestPlan|0.1.0-snapshot1",
  "id" : "eu-api-resource-consumer-tests",
  "url" : "http://example.com/fhir/hl7.fhir.eu.health-data-api.test/TestPlan/eu-api-resource-consumer-tests",
  "version" : "0.1.0",
  "name" : "ResourceConsumerTestPlan",
  "title" : "Resource Consumer Test Plan",
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
  "description" : "Test plan for the **Resource Consumer** actor of [EU Health Data API, 1.0.0-ballot](https://build.fhir.org/ig/euridice-org/eu-health-data-api/).\nThe SUT obtains a token, finds the patient and reads that patient's resources.\nEach `suite` below is a `Rule:` of the Gherkin feature named by `suite.input.file`, and each `suite.test` one of its `Scenario:` lines, matched by the scenario's identifier. The assertions are the scenario's `Then` steps, verbatim.\nThe tests declare which specification obligations they cover (11 requirement paths named by the feature tags).\nFixture prerequisites, input bindings and expected data are in tests/fixtures/provider-v1/manifest.json, keyed by scenario ID. See the Testing page, Fixture contract and expected results. Provider fixtures are R4; client workflows use the canned data embedded in their feature.",
  "jurisdiction" : [{
    "coding" : [{
      "system" : "http://unstats.un.org/unsd/methods/m49/m49.htm",
      "code" : "001",
      "display" : "World"
    }]
  }],
  "purpose" : "To declare, in a machine-readable and runnable form, which behaviours a system claiming conformance to the Resource Consumer actor must demonstrate.",
  "scope" : [{
    "reference" : "http://hl7.eu/fhir/health-data-api/ActorDefinition/resource-consumer-actor-eu-api",
    "description" : "The Resource Consumer, a client that reads patient resources from a Resource Access Provider, is the system under test. The test bed plays the provider."
  }],
  "runner" : "https://www.itb.ec.europa.eu/docs/guides/latest/",
  "suite" : [{
    "name" : "SMART Backend Services authorization",
    "description" : "Rule: SMART Backend Services authorization — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-resource-consumer.feature"
    }],
    "test" : [{
      "name" : "rc-001 The SUT authenticates with a signed JWT client assertion (RFC 7523)",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-001 (input bindings and expected data). Covers security.smart-backend-services.",
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
        "human" : "ResourceProvider replies to ResourceConsumer with status 200 and:"
      }]
    }]
  },
  {
    "name" : "Patient lookup",
    "description" : "Rule: Patient lookup — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-resource-consumer.feature"
    }],
    "test" : [{
      "name" : "rc-002 The SUT searches Patient by the identifier parameter",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-002 (input bindings and expected data). Covers Patient.search-type, Patient.search.identifier.",
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
        "human" : "ResourceProvider replies to ResourceConsumer with status 200 and:"
      }]
    },
    {
      "name" : "rc-003 The SUT reads the patient by logical id",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-003 (input bindings and expected data). Covers Patient.read.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$received.method should be \"GET\""
      },
      {
        "severity" : "error",
        "human" : "$received.path should contain \"/Patient/otb-pat-1\""
      },
      {
        "severity" : "error",
        "human" : "ResourceProvider replies to ResourceConsumer with status 200 and:"
      }]
    }]
  },
  {
    "name" : "Search by patient",
    "description" : "Rule: Search by patient — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-resource-consumer.feature"
    }],
    "test" : [{
      "name" : "rc-004 The SUT searches Condition by the patient parameter",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-004 (input bindings and expected data). Covers Condition.search.patient.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$received.method should be \"GET\""
      },
      {
        "severity" : "error",
        "human" : "$received.path should contain \"/Condition\""
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
        "human" : "ResourceProvider replies to ResourceConsumer with status 200 and:"
      }]
    },
    {
      "name" : "rc-005 The SUT searches Observation by patient and category",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-005 (input bindings and expected data). Covers Observation.search.patient, Observation.search.category, Observation.search.code, Observation.search.date.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$received.method should be \"GET\""
      },
      {
        "severity" : "error",
        "human" : "$received.path should contain \"/Observation\""
      },
      {
        "severity" : "error",
        "human" : "$received.path should match \"patient=(Patient(/|%2F))?otb-pat-1([&]|$)\""
      },
      {
        "severity" : "error",
        "human" : "$received.path should contain \"category=\""
      },
      {
        "severity" : "error",
        "human" : "ResourceProvider replies to ResourceConsumer with status 200 and:"
      }]
    },
    {
      "name" : "rc-006 The SUT searches AllergyIntolerance by the patient parameter",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-006 (input bindings and expected data). Covers AllergyIntolerance.search.patient.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$received.method should be \"GET\""
      },
      {
        "severity" : "error",
        "human" : "$received.path should contain \"/AllergyIntolerance\""
      },
      {
        "severity" : "error",
        "human" : "$received.path should match \"patient=(Patient(/|%2F))?otb-pat-1([&]|$)\""
      },
      {
        "severity" : "error",
        "human" : "ResourceProvider replies to ResourceConsumer with status 200 and:"
      }]
    }]
  },
  {
    "name" : "Transport security",
    "description" : "Rule: Transport security — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-resource-consumer.feature"
    }],
    "test" : [{
      "name" : "rc-007 TLS 1.2 or higher is used for all communications",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-007 (input bindings and expected data). Covers security.tls.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "TLS >= 1.2 — ResourceConsumer confirms each of these is accepted for \"the connection\""
      }]
    }]
  }]
}

```
