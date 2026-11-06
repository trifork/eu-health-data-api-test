# Document Access Provider Test Plan - EU Health Data API: TestPlans and Gherkin for the EEHRxF API actors v0.1.0

## TestPlan: Document Access Provider Test Plan (Experimental) 

**Scopes**

* **Reference**: `http://hl7.eu/fhir/health-data-api/ActorDefinition/document-access-provider-actor-eu-api`
  * **Description**: The Document Access Provider, a server answering Find Document References [ITI-67] and Retrieve Document [ITI-68] and, with the Document Submission Option, accepting Simplified Publish [ITI-105], is the system under test.

**1 Suite: The server declares what the actor requires**

Rule: The server declares what the actor requires — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-document-access-provider.feature

**Tests**

* **Name**: dap-001 The CapabilityStatement declares DocumentReference and Binary
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-001 (input bindings and expected data). Covers CapabilityStatement.rest.resource.DocumentReference, CapabilityStatement.rest.resource.Binary.
  * **Operation**: gherkin/Scenario
* **Name**: dap-002 The CapabilityStatement declares SMART on FHIR security
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-002 (input bindings and expected data). Covers CapabilityStatement.rest.security.
  * **Operation**: gherkin/Scenario

-------

**2 Suite: Every transaction requires SMART Backend Services authorization**

Rule: Every transaction requires SMART Backend Services authorization — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-document-access-provider.feature

**Tests**

* **Name**: dap-003 A request without a token is refused
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-003 (input bindings and expected data). Covers security.authorization.
  * **Operation**: gherkin/Scenario
* **Name**: dap-004 A token with no usable scope is refused
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-004 (input bindings and expected data). Covers security.scope.
  * **Operation**: gherkin/Scenario

-------

**3 Suite: Find Document References [ITI-67]**

Rule: Find Document References [ITI-67] — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-document-access-provider.feature

**Tests**

* **Name**: dap-005 Search by patient returns a searchset of conformant DocumentReferences
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-005 (input bindings and expected data). Covers DocumentReference.search-type.
  * **Operation**: gherkin/Scenario
* **Name**: dap-006 Search by EEHRxF priority category
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-006 (input bindings and expected data). Covers DocumentReference.search-type.
  * **Operation**: gherkin/Scenario
* **Name**: dap-007 Search by LOINC document type
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-007 (input bindings and expected data). Covers DocumentReference.search-type.
  * **Operation**: gherkin/Scenario
* **Name**: dap-008 Read a DocumentReference by id
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-008 (input bindings and expected data). Covers DocumentReference.read.
  * **Operation**: gherkin/Scenario
* **Name**: dap-009 An unknown DocumentReference id gives 404 and an OperationOutcome
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-009 (input bindings and expected data). Covers DocumentReference.read.
  * **Operation**: gherkin/Scenario

-------

**4 Suite: Retrieve Document [ITI-68]**

Rule: Retrieve Document [ITI-68] — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-document-access-provider.feature

**Tests**

* **Name**: dap-010 Read the document content as a Binary
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-010 (input bindings and expected data). Covers Binary.read.
  * **Operation**: gherkin/Scenario

-------

**5 Suite: Patient lookup (PDQm ITI-78) is available when the server offers it**

Rule: Patient lookup (PDQm ITI-78) is available when the server offers it — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-document-access-provider.feature

**Tests**

* **Name**: dap-011 Search Patient by identifier
  * **Description**: Patient is SHOULD on the Access Provider: a server that does not offer it answers 404 or 501 and these scenarios are not applicable to it. A server that does offer it SHALL support all of the search parameters below. Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-011 (input bindings and expected data). Covers Patient.read, Patient.search-type, Patient.search.identifier.
  * **Operation**: gherkin/Scenario
* **Name**: dap-012 Read Patient by id and conform to patient-eu-core
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-012 (input bindings and expected data). Covers Patient.read, Patient.search.id.
  * **Operation**: gherkin/Scenario
* **Name**: dap-013 Search Patient by demographics the reference patient has
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-013 (input bindings and expected data). Covers Patient.search.family, Patient.search.given, Patient.search.birthdate, Patient.search.gender.
  * **Operation**: gherkin/Scenario

-------

**6 Suite: Document Submission Option — Simplified Publish [ITI-105]**

Rule: Document Submission Option — Simplified Publish [ITI-105] — the scenarios grouped under it in the feature file.

**Inputs**

* **Name**: gherkin-script
  * **File**: eu-api-document-access-provider.feature

**Tests**

* **Name**: dap-014 The CapabilityStatement declares create on DocumentReference
  * **Description**: Only for a system that claims the Document Submission Option (CapabilityStatement document-access-provider-submission-option-eu-api). The option adds to the base: everything above still applies. Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-014 (input bindings and expected data). Covers DocumentReference.create.
  * **Operation**: gherkin/Scenario
* **Name**: dap-015 A Simplified Publish with embedded content is accepted and then findable
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-015 (input bindings and expected data). Covers DocumentReference.create.
  * **Operation**: gherkin/Scenario
* **Name**: dap-016 A submission without content is refused
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-016 (input bindings and expected data). Covers DocumentReference.create.
  * **Operation**: gherkin/Scenario
* **Name**: dap-017 A submission with a token that cannot create is refused
  * **Description**: Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-017 (input bindings and expected data). Covers DocumentReference.create.
  * **Operation**: gherkin/Scenario



## Resource Content

```json
{
  "resourceType" : "TestPlan",
  "resourceDefinition" : "http://hl7.org/fhir/StructureDefinition/TestPlan|0.1.0-snapshot1",
  "id" : "eu-api-document-access-provider-tests",
  "url" : "http://example.com/fhir/hl7.fhir.eu.health-data-api.test/TestPlan/eu-api-document-access-provider-tests",
  "version" : "0.1.0",
  "name" : "DocumentAccessProviderTestPlan",
  "title" : "Document Access Provider Test Plan",
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
  "description" : "Test plan for the **Document Access Provider** actor of [EU Health Data API, 1.0.0-ballot](https://build.fhir.org/ig/euridice-org/eu-health-data-api/).\nThe SUT serves EEHRxF documents to Document Consumers, behind SMART Backend Services.\nEach `suite` below is a `Rule:` of the Gherkin feature named by `suite.input.file`, and each `suite.test` one of its `Scenario:` lines, matched by the scenario's identifier. The assertions are the scenario's `Then` steps, verbatim.\nThe tests declare which specification obligations they cover (24 requirement paths named by the feature tags).\nFixture prerequisites, input bindings and expected data are in tests/fixtures/provider-v1/manifest.json, keyed by scenario ID. See the Testing page, Fixture contract and expected results. Provider fixtures are R4; client workflows use the canned data embedded in their feature.",
  "jurisdiction" : [{
    "coding" : [{
      "system" : "http://unstats.un.org/unsd/methods/m49/m49.htm",
      "code" : "001",
      "display" : "World"
    }]
  }],
  "purpose" : "To declare, in a machine-readable and runnable form, which behaviours a system claiming conformance to the Document Access Provider actor must demonstrate.",
  "scope" : [{
    "reference" : "http://hl7.eu/fhir/health-data-api/ActorDefinition/document-access-provider-actor-eu-api",
    "description" : "The Document Access Provider, a server answering Find Document References [ITI-67] and Retrieve Document [ITI-68] and, with the Document Submission Option, accepting Simplified Publish [ITI-105], is the system under test."
  }],
  "runner" : "https://www.itb.ec.europa.eu/docs/guides/latest/",
  "suite" : [{
    "name" : "The server declares what the actor requires",
    "description" : "Rule: The server declares what the actor requires — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-document-access-provider.feature"
    }],
    "test" : [{
      "name" : "dap-001 The CapabilityStatement declares DocumentReference and Binary",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-001 (input bindings and expected data). Covers CapabilityStatement.rest.resource.DocumentReference, CapabilityStatement.rest.resource.Binary.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$capability at \"CapabilityStatement.rest.where(mode='server').resource.where(type='DocumentReference').interaction.where(code='search-type').exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$capability at \"CapabilityStatement.rest.where(mode='server').resource.where(type='DocumentReference').interaction.where(code='read').exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$capability at \"CapabilityStatement.rest.where(mode='server').resource.where(type='Binary').interaction.where(code='read').exists()\" should be true"
      }]
    },
    {
      "name" : "dap-002 The CapabilityStatement declares SMART on FHIR security",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-002 (input bindings and expected data). Covers CapabilityStatement.rest.security.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$capability at \"CapabilityStatement.rest.where(mode='server').security.service.coding.where(code='SMART-on-FHIR').exists()\" should be true"
      }]
    }]
  },
  {
    "name" : "Every transaction requires SMART Backend Services authorization",
    "description" : "Rule: Every transaction requires SMART Backend Services authorization — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-document-access-provider.feature"
    }],
    "test" : [{
      "name" : "dap-003 A request without a token is refused",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-003 (input bindings and expected data). Covers security.authorization.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 401"
      }]
    },
    {
      "name" : "dap-004 A token with no usable scope is refused",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-004 (input bindings and expected data). Covers security.scope.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be one of \"401, 403\""
      }]
    }]
  },
  {
    "name" : "Find Document References [ITI-67]",
    "description" : "Rule: Find Document References [ITI-67] — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-document-access-provider.feature"
    }],
    "test" : [{
      "name" : "dap-005 Search by patient returns a searchset of conformant DocumentReferences",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-005 (input bindings and expected data). Covers DocumentReference.search-type.",
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
        "human" : "$found at \"Bundle.entry.resource.ofType(DocumentReference).exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.resource.ofType(DocumentReference).all(status = 'current' or status = 'superseded' or status = 'entered-in-error')\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$found at \"Bundle.entry.resource.ofType(DocumentReference).all(content.attachment.exists())\" should be true"
      }]
    },
    {
      "name" : "dap-006 Search by EEHRxF priority category",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-006 (input bindings and expected data). Covers DocumentReference.search-type.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$byCategory at \"Bundle.type\" should be \"searchset\""
      },
      {
        "severity" : "error",
        "human" : "$byCategory at \"Bundle.entry.resource.ofType(DocumentReference).all(category.coding.where(code='Patient-Summaries').exists())\" should be true"
      }]
    },
    {
      "name" : "dap-007 Search by LOINC document type",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-007 (input bindings and expected data). Covers DocumentReference.search-type.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$byType at \"Bundle.type\" should be \"searchset\""
      },
      {
        "severity" : "error",
        "human" : "$byType at \"Bundle.entry.resource.ofType(DocumentReference).all(type.coding.where(system='http://loinc.org' and code='60591-5').exists())\" should be true"
      }]
    },
    {
      "name" : "dap-008 Read a DocumentReference by id",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-008 (input bindings and expected data). Covers DocumentReference.read.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$docRef at \"DocumentReference.id\" should be \"$documentId\""
      },
      {
        "severity" : "error",
        "human" : "$docRef at \"DocumentReference.subject.exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$docRef at \"DocumentReference.content.attachment.contentType.exists()\" should be true"
      }]
    },
    {
      "name" : "dap-009 An unknown DocumentReference id gives 404 and an OperationOutcome",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-009 (input bindings and expected data). Covers DocumentReference.read.",
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
  },
  {
    "name" : "Retrieve Document [ITI-68]",
    "description" : "Rule: Retrieve Document [ITI-68] — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-document-access-provider.feature"
    }],
    "test" : [{
      "name" : "dap-010 Read the document content as a Binary",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-010 (input bindings and expected data). Covers Binary.read.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$response.body should not be empty"
      }]
    }]
  },
  {
    "name" : "Patient lookup (PDQm ITI-78) is available when the server offers it",
    "description" : "Rule: Patient lookup (PDQm ITI-78) is available when the server offers it — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-document-access-provider.feature"
    }],
    "test" : [{
      "name" : "dap-011 Search Patient by identifier",
      "description" : "Patient is SHOULD on the Access Provider: a server that does not offer it answers 404 or 501 and these scenarios are not applicable to it. A server that does offer it SHALL support all of the search parameters below. Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-011 (input bindings and expected data). Covers Patient.read, Patient.search-type, Patient.search.identifier.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$patients at \"Bundle.type\" should be \"searchset\""
      },
      {
        "severity" : "error",
        "human" : "$patients at \"Bundle.entry.resource.ofType(Patient).count() >= 1\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$patients at \"Bundle.entry.resource.ofType(Patient).id.distinct().single()\" should be \"$patientId\""
      },
      {
        "severity" : "error",
        "human" : "$patients should conform to \"http://hl7.org/fhir/StructureDefinition/Bundle\" ignoring slicing errors"
      }]
    },
    {
      "name" : "dap-012 Read Patient by id and conform to patient-eu-core",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-012 (input bindings and expected data). Covers Patient.read, Patient.search.id.",
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
      "name" : "dap-013 Search Patient by demographics the reference patient has",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-013 (input bindings and expected data). Covers Patient.search.family, Patient.search.given, Patient.search.birthdate, Patient.search.gender.",
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
      }]
    }]
  },
  {
    "name" : "Document Submission Option — Simplified Publish [ITI-105]",
    "description" : "Rule: Document Submission Option — Simplified Publish [ITI-105] — the scenarios grouped under it in the feature file.",
    "input" : [{
      "name" : "gherkin-script",
      "file" : "eu-api-document-access-provider.feature"
    }],
    "test" : [{
      "name" : "dap-014 The CapabilityStatement declares create on DocumentReference",
      "description" : "Only for a system that claims the Document Submission Option (CapabilityStatement document-access-provider-submission-option-eu-api). The option adds to the base: everything above still applies. Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-014 (input bindings and expected data). Covers DocumentReference.create.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$capability at \"CapabilityStatement.rest.where(mode='server').resource.where(type='DocumentReference').interaction.where(code='create').exists()\" should be true"
      }]
    },
    {
      "name" : "dap-015 A Simplified Publish with embedded content is accepted and then findable",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-015 (input bindings and expected data). Covers DocumentReference.create.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be 201"
      },
      {
        "severity" : "error",
        "human" : "$response.headers.Location should match \"/DocumentReference/[^/]+\""
      },
      {
        "severity" : "error",
        "human" : "extract \"/id\" from $response.body as $createdId"
      },
      {
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$created at \"DocumentReference.subject.reference\" should contain \"$submitPatientRef\""
      },
      {
        "severity" : "error",
        "human" : "$created at \"DocumentReference.content.attachment.contentType.exists()\" should be true"
      },
      {
        "severity" : "error",
        "human" : "$response.status should be 200"
      },
      {
        "severity" : "error",
        "human" : "$findable at \"Bundle.entry.resource.ofType(DocumentReference).count() = 1\" should be true"
      }]
    },
    {
      "name" : "dap-016 A submission without content is refused",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-016 (input bindings and expected data). Covers DocumentReference.create.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be one of \"400, 422\""
      }]
    },
    {
      "name" : "dap-017 A submission with a token that cannot create is refused",
      "description" : "Fixture contract: fixtures/provider-v1/manifest.json, cases.dap-017 (input bindings and expected data). Covers DocumentReference.create.",
      "operation" : "gherkin/Scenario",
      "assertion" : [{
        "severity" : "error",
        "human" : "$response.status should be one of \"401, 403\""
      }]
    }]
  }]
}

```
