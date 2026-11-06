# Resource Access Provider Test Plan - EU Health Data API: TestPlans and Gherkin for the EEHRxF API actors v0.1.0

## TestPlan: Resource Access Provider Test Plan (Experimental) 

**Scopes**

* **Reference**: `http://hl7.eu/fhir/health-data-api/ActorDefinition/resource-access-provider-actor-eu-api`
  * **Description**: The Resource Access Provider, a server offering read and search of Patient and clinical resources under the IPA server capabilities, is the system under test.

**1 Suite: The server declares what the actor requires**

Rule: The server declares what the actor requires — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-resource-access-provider.feature

**Tests**

* **Name**: rap-001 The CapabilityStatement declares Patient read and search and SMART security
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-001 (input bindings and expected data). Covers CapabilityStatement.rest.resource.Patient.
  * **Operation**: gherkin/Scenario

-------

**2 Suite: Authorization is required**

Rule: Authorization is required — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-resource-access-provider.feature

**Tests**

* **Name**: rap-002 A request without a token is refused
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-002 (input bindings and expected data). Covers security.authorization.
  * **Operation**: gherkin/Scenario
* **Name**: rap-003 A token with no usable scope is refused
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-003 (input bindings and expected data). Covers security.scope.
  * **Operation**: gherkin/Scenario

-------

**3 Suite: Patient read and search**

Rule: Patient read and search — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-resource-access-provider.feature

**Tests**

* **Name**: rap-004 Read the patient and conform to patient-eu-core
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-004 (input bindings and expected data). Covers Patient.read.
  * **Operation**: gherkin/Scenario
* **Name**: rap-005 Search Patient by identifier and by _id
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-005 (input bindings and expected data). Covers Patient.search.identifier, Patient.search.id.
  * **Operation**: gherkin/Scenario
* **Name**: rap-006 Search Patient by the demographics the reference patient carries
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-006 (input bindings and expected data). Covers Patient.search.family, Patient.search.given, Patient.search.birthdate, Patient.search.gender, Patient.search.active.
  * **Operation**: gherkin/Scenario

-------

**4 Suite: Search by patient for each clinical resource type**

Rule: Search by patient for each clinical resource type — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-resource-access-provider.feature

**Tests**

* **Name**: rap-007 Search Condition by patient returns a searchset of Condition
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-007 (input bindings and expected data). Covers Condition.search-type, Condition.search.patient.
  * **Operation**: gherkin/Scenario
* **Name**: rap-008 Search AllergyIntolerance by patient returns a searchset of AllergyIntolerance
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-008 (input bindings and expected data). Covers AllergyIntolerance.search-type, AllergyIntolerance.search.patient.
  * **Operation**: gherkin/Scenario
* **Name**: rap-009 Search Observation by patient returns a searchset of Observation
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-009 (input bindings and expected data). Covers Observation.search-type, Observation.search.patient.
  * **Operation**: gherkin/Scenario
* **Name**: rap-010 Search DiagnosticReport by patient returns a searchset of DiagnosticReport
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-010 (input bindings and expected data). Covers DiagnosticReport.search-type, DiagnosticReport.search.patient.
  * **Operation**: gherkin/Scenario
* **Name**: rap-011 Search ImagingStudy by patient returns a searchset of ImagingStudy
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-011 (input bindings and expected data). Covers ImagingStudy.search-type, ImagingStudy.search.patient.
  * **Operation**: gherkin/Scenario
* **Name**: rap-012 Search MedicationRequest by patient returns a searchset of MedicationRequest
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-012 (input bindings and expected data). Covers MedicationRequest.search-type, MedicationRequest.search.patient.
  * **Operation**: gherkin/Scenario
* **Name**: rap-013 Search MedicationDispense by patient returns a searchset of MedicationDispense
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-013 (input bindings and expected data). Covers MedicationDispense.search-type, MedicationDispense.search.patient.
  * **Operation**: gherkin/Scenario
* **Name**: rap-014 Search Immunization by patient returns a searchset of Immunization
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-014 (input bindings and expected data). Covers Immunization.search-type, Immunization.search.patient.
  * **Operation**: gherkin/Scenario
* **Name**: rap-015 Search MedicationStatement by patient returns a searchset of MedicationStatement
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-015 (input bindings and expected data). Covers MedicationStatement.search-type, MedicationStatement.search.patient.
  * **Operation**: gherkin/Scenario
* **Name**: rap-016 Search Encounter by patient returns a searchset of Encounter
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-016 (input bindings and expected data). Covers Encounter.search-type, Encounter.search.patient.
  * **Operation**: gherkin/Scenario

-------

**5 Suite: Read by id**

Rule: Read by id — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-resource-access-provider.feature

**Tests**

* **Name**: rap-017 A found resource can be read back by its id
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-017 (input bindings and expected data). Covers Observation.read, Condition.read.
  * **Operation**: gherkin/Scenario
* **Name**: rap-018 An unknown id gives 404 and an OperationOutcome
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-018 (input bindings and expected data). Covers Patient.read.
  * **Operation**: gherkin/Scenario



## Resource Content

```json
{
  "resourceType" : "TestPlan",
  "resourceDefinition" : "http://hl7.org/fhir/StructureDefinition/TestPlan|0.1.0-snapshot1",
  "id" : "eu-api-resource-access-provider-tests",
  "url" : "http://example.com/fhir/hl7.fhir.eu.health-data-api.test/TestPlan/eu-api-resource-access-provider-tests",
  "version" : "0.1.0",
  "name" : "ResourceAccessProviderTestPlan",
  "title" : "Resource Access Provider Test Plan",
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
  "description" : "Test plan for the **Resource Access Provider** actor of [EU Health Data API, 1.0.0-ballot](https://build.fhir.org/ig/euridice-org/eu-health-data-api/).\nThe SUT serves individual FHIR resources for a patient, behind SMART Backend Services.\nEach `suite` below is a `Rule:` of the Gherkin feature named by `suite.input.file`, and each `suite.test` one of its `Scenario:` lines, matched by the scenario's identifier. The assertions are the scenario's `Then` steps, verbatim.\nThe tests declare which specification obligations they cover (34 requirement paths named by the feature tags).\nFixture prerequisites, input bindings and expected data are in tests/fixtures/provider-v1/manifest.json, keyed by scenario ID. See the Testing page, Fixture contract and expected results. Provider fixtures are R4; client workflows use the canned data embedded in their feature.",
  "jurisdiction" : [{
    "coding" : [{
      "system" : "http://unstats.un.org/unsd/methods/m49/m49.htm",
      "code" : "001",
      "display" : "World"
    }]
  }],
  "purpose" : "To declare, in a machine-readable and runnable form, which behaviours a system claiming conformance to the Resource Access Provider actor must demonstrate.",
  "scope" : [{
    "reference" : "http://hl7.eu/fhir/health-data-api/ActorDefinition/resource-access-provider-actor-eu-api",
    "description" : "The Resource Access Provider, a server offering read and search of Patient and clinical resources under the IPA server capabilities, is the system under test."
  }],
  "runner" : "https://www.itb.ec.europa.eu/docs/guides/latest/",
  "suite" : [{
    "name" : "The server declares what the actor requires",
    "description" : "Rule: The server declares what the actor requires — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-resource-access-provider.feature"
    }],
    "test" : [{
      "name" : "rap-001 The CapabilityStatement declares Patient read and search and SMART security",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-001 (input bindings and expected data). Covers CapabilityStatement.rest.resource.Patient.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$capability at \"CapabilityStatement.rest.where(mode='server').resource.where(type='Patient').interaction.where(code='read').exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$capability at \"CapabilityStatement.rest.where(mode='server').resource.where(type='Patient').interaction.where(code='search-type').exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$capability at \"CapabilityStatement.rest.where(mode='server').security.service.coding.where(code='SMART-on-FHIR').exists()\" should be true"
      }]
    }]
  },
  {
    "name" : "Authorization is required",
    "description" : "Rule: Authorization is required — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-resource-access-provider.feature"
    }],
    "test" : [{
      "name" : "rap-002 A request without a token is refused",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-002 (input bindings and expected data). Covers security.authorization.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 401"
      }]
    },
    {
      "name" : "rap-003 A token with no usable scope is refused",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-003 (input bindings and expected data). Covers security.scope.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be one of \"401, 403\""
      }]
    }]
  },
  {
    "name" : "Patient read and search",
    "description" : "Rule: Patient read and search — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-resource-access-provider.feature"
    }],
    "test" : [{
      "name" : "rap-004 Read the patient and conform to patient-eu-core",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-004 (input bindings and expected data). Covers Patient.read.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$patient should conform to \"http://hl7.eu/fhir/base/StructureDefinition/patient-eu-core\" ignoring slicing errors"
      }]
    },
    {
      "name" : "rap-005 Search Patient by identifier and by _id",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-005 (input bindings and expected data). Covers Patient.search.identifier, Patient.search.id.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$byIdentifier at \"Bundle.type\" should be \"searchset\""
      },
      {
        "severity" : "error",
        "human" : "$byIdentifier at \"Bundle.entry.resource.ofType(Patient).count() >= 1\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$byIdentifier at \"Bundle.entry.resource.ofType(Patient).id.distinct().single()\" should be \"$patientId\""
      },
      {
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$byId at \"Bundle.entry.resource.ofType(Patient).count() = 1\" should be true"
      }]
    },
    {
      "name" : "rap-006 Search Patient by the demographics the reference patient carries",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-006 (input bindings and expected data). Covers Patient.search.family, Patient.search.given, Patient.search.birthdate, Patient.search.gender, Patient.search.active.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "extract \"/name/0/family\" from $response.body as $family"
      },
      {
        "severity" : "error",
        "human" : "extract \"/gender\" from $response.body as $gender"
      },
      {
        "severity" : "error",
        "human" : "extract \"/birthDate\" from $response.body as $birthdate"
      },
      {
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$byFamily at \"Bundle.entry.resource.ofType(Patient).exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$byFamily at \"Bundle.entry.resource.ofType(Patient).id.join(',')\" should contain $patientId"
      },
      {
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$byGender at \"Bundle.entry.resource.ofType(Patient).exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$byGender at \"Bundle.entry.resource.ofType(Patient).id.join(',')\" should contain $patientId"
      },
      {
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$byBirth at \"Bundle.entry.resource.ofType(Patient).exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$byBirth at \"Bundle.entry.resource.ofType(Patient).id.join(',')\" should contain $patientId"
      },
      {
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$byActive at \"Bundle.type\" should be \"searchset\""
      }]
    }]
  },
  {
    "name" : "Search by patient for each clinical resource type",
    "description" : "Rule: Search by patient for each clinical resource type — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-resource-access-provider.feature"
    }],
    "test" : [{
      "name" : "rap-007 Search Condition by patient returns a searchset of Condition",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-007 (input bindings and expected data). Covers Condition.search-type, Condition.search.patient.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.type\" should be \"searchset\""
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(Condition).exists() and resource.subject.reference.exists())\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()\" should be \"$patientId\""
      }]
    },
    {
      "name" : "rap-008 Search AllergyIntolerance by patient returns a searchset of AllergyIntolerance",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-008 (input bindings and expected data). Covers AllergyIntolerance.search-type, AllergyIntolerance.search.patient.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.type\" should be \"searchset\""
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(AllergyIntolerance).exists() and resource.patient.reference.exists())\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.patient.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.patient.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()\" should be \"$patientId\""
      }]
    },
    {
      "name" : "rap-009 Search Observation by patient returns a searchset of Observation",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-009 (input bindings and expected data). Covers Observation.search-type, Observation.search.patient.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.type\" should be \"searchset\""
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(Observation).exists() and resource.subject.reference.exists())\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()\" should be \"$patientId\""
      }]
    },
    {
      "name" : "rap-010 Search DiagnosticReport by patient returns a searchset of DiagnosticReport",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-010 (input bindings and expected data). Covers DiagnosticReport.search-type, DiagnosticReport.search.patient.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.type\" should be \"searchset\""
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(DiagnosticReport).exists() and resource.subject.reference.exists())\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()\" should be \"$patientId\""
      }]
    },
    {
      "name" : "rap-011 Search ImagingStudy by patient returns a searchset of ImagingStudy",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-011 (input bindings and expected data). Covers ImagingStudy.search-type, ImagingStudy.search.patient.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.type\" should be \"searchset\""
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(ImagingStudy).exists() and resource.subject.reference.exists())\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()\" should be \"$patientId\""
      }]
    },
    {
      "name" : "rap-012 Search MedicationRequest by patient returns a searchset of MedicationRequest",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-012 (input bindings and expected data). Covers MedicationRequest.search-type, MedicationRequest.search.patient.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.type\" should be \"searchset\""
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(MedicationRequest).exists() and resource.subject.reference.exists())\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()\" should be \"$patientId\""
      }]
    },
    {
      "name" : "rap-013 Search MedicationDispense by patient returns a searchset of MedicationDispense",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-013 (input bindings and expected data). Covers MedicationDispense.search-type, MedicationDispense.search.patient.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.type\" should be \"searchset\""
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(MedicationDispense).exists() and resource.subject.reference.exists())\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()\" should be \"$patientId\""
      }]
    },
    {
      "name" : "rap-014 Search Immunization by patient returns a searchset of Immunization",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-014 (input bindings and expected data). Covers Immunization.search-type, Immunization.search.patient.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.type\" should be \"searchset\""
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(Immunization).exists() and resource.patient.reference.exists())\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.patient.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.patient.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()\" should be \"$patientId\""
      }]
    },
    {
      "name" : "rap-015 Search MedicationStatement by patient returns a searchset of MedicationStatement",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-015 (input bindings and expected data). Covers MedicationStatement.search-type, MedicationStatement.search.patient.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.type\" should be \"searchset\""
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(MedicationStatement).exists() and resource.subject.reference.exists())\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()\" should be \"$patientId\""
      }]
    },
    {
      "name" : "rap-016 Search Encounter by patient returns a searchset of Encounter",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-016 (input bindings and expected data). Covers Encounter.search-type, Encounter.search.patient.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.type\" should be \"searchset\""
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(Encounter).exists() and resource.subject.reference.exists())\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()\" should be \"$patientId\""
      }]
    }]
  },
  {
    "name" : "Read by id",
    "description" : "Rule: Read by id — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-resource-access-provider.feature"
    }],
    "test" : [{
      "name" : "rap-017 A found resource can be read back by its id",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-017 (input bindings and expected data). Covers Observation.read, Condition.read.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "extract \"/entry/0/resource/id\" from $response.body as $obsId"
      },
      {
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$one at \"Observation.id\" should be \"$obsId\""
      }]
    },
    {
      "name" : "rap-018 An unknown id gives 404 and an OperationOutcome",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.rap-018 (input bindings and expected data). Covers Patient.read.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 404"
      },
      {
        "severity" : "error",
        "human" : "$missing at \"OperationOutcome.issue.exists()\" should be true"
      }]
    }]
  }]
}

```
