# EEHRxF grouped Document Publisher/Access Provider — hl7.fhir.eu.health-data-api
# 1.0.0-ballot. Publication (ITI-105) is internal, so only query and retrieval are
# exposed (CapabilityStatement document-publisher-access-provider-eu-api).
@lang:itb-core-en@^2 @dialect:fhir-validator@^2 @actor:DocumentPublisherAccessProvider @spec:hl7.fhir.eu.health-data-api@1.0.0-ballot
Feature: EEHRxF grouped Document Publisher/Access Provider — ITI-67 and ITI-68
  The SUT produces and serves its own documents; only the read side is external.

  Background:
    Given GroupedProvider is the system under test at "http://ehr.example.org/fhir" as defined by "http://hl7.eu/fhir/health-data-api/CapabilityStatement/document-publisher-access-provider-eu-api"
    And Client is infrastructure
    And FHIRValidator is a fhir-validator at "http://fhir-validator:8080"
    And FHIRValidator is loaded with package "hl7.fhir.eu.health-data-api#1.0.0-ballot"
    And set header "Accept" to "application/fhir+json"

  Rule: The server declares what the actor requires

    @covers:CapabilityStatement.rest.resource.DocumentReference,CapabilityStatement.rest.resource.Binary
    Scenario: grp-001 The CapabilityStatement declares DocumentReference and Binary
      When Client gets from GroupedProvider at "/metadata" as $capability
      Then $response.status should be 200
      And $capability at "CapabilityStatement.rest.where(mode='server').resource.where(type='DocumentReference').interaction.where(code='search-type').exists()" should be true
      And $capability at "CapabilityStatement.rest.where(mode='server').resource.where(type='DocumentReference').interaction.where(code='read').exists()" should be true
      And $capability at "CapabilityStatement.rest.where(mode='server').resource.where(type='Binary').interaction.where(code='read').exists()" should be true

    @covers:CapabilityStatement.rest.security
    Scenario: grp-002 The CapabilityStatement declares SMART on FHIR security
      When Client gets from GroupedProvider at "/metadata" as $capability
      Then $response.status should be 200
      And $capability at "CapabilityStatement.rest.where(mode='server').security.service.coding.where(code='SMART-on-FHIR').exists()" should be true

  Rule: Every transaction requires SMART Backend Services authorization

    @covers:security.authorization
    Scenario: grp-003 A request without a token is refused
      Given Client is asked for $patientId with "The logical id of the reference patient on the server"
      When Client gets from GroupedProvider at "/DocumentReference?patient=" with id $patientId as $unauth
      Then $response.status should be 401

    @covers:security.scope
    Scenario: grp-004 A token with no usable scope is refused
      Given Client is asked for $narrowToken with "An access token that lacks every system/ scope this server protects, as 'Bearer <token>'"
      And Client is asked for $patientId with "The logical id of the reference patient on the server"
      And set header "Authorization" to $narrowToken
      When Client gets from GroupedProvider at "/DocumentReference?patient=" with id $patientId as $denied
      Then $response.status should be one of "401, 403"

  Rule: Find Document References [ITI-67]

    @covers:DocumentReference.search-type
    Scenario: grp-005 Search by patient returns a searchset of conformant DocumentReferences
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scopes system/DocumentReference.rs, system/Binary.r, system/Patient.rs)"
      And Client is asked for $patientId with "The logical id of the reference patient on the server"
      And set header "Authorization" to $accessToken
      When Client gets from GroupedProvider at "/DocumentReference?patient=" with id $patientId as $found
      Then $response.status should be 200
      And $found at "Bundle.type" should be "searchset"
      And $found at "Bundle.entry.resource.ofType(DocumentReference).exists()" should be true
      And $found at "Bundle.entry.resource.ofType(DocumentReference).all(status = 'current' or status = 'superseded' or status = 'entered-in-error')" should be true
      And $found at "Bundle.entry.resource.ofType(DocumentReference).all(content.attachment.exists())" should be true

    @covers:DocumentReference.search-type
    Scenario: grp-006 Search by EEHRxF priority category
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scopes system/DocumentReference.rs, system/Binary.r, system/Patient.rs)"
      And Client is asked for $patientId with "The logical id of the reference patient on the server"
      And set header "Authorization" to $accessToken
      When Client gets from GroupedProvider at "/DocumentReference?category=https://euridice.ec.europa.eu/fhir/eehrxf/CodeSystem/document-priority-category-eu-api|Patient-Summaries&patient=" with id $patientId as $byCategory
      Then $response.status should be 200
      And $byCategory at "Bundle.type" should be "searchset"
      And $byCategory at "Bundle.entry.resource.ofType(DocumentReference).all(category.coding.where(code='Patient-Summaries').exists())" should be true

    @covers:DocumentReference.search-type
    Scenario: grp-007 Search by LOINC document type
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scopes system/DocumentReference.rs, system/Binary.r, system/Patient.rs)"
      And Client is asked for $patientId with "The logical id of the reference patient on the server"
      And set header "Authorization" to $accessToken
      When Client gets from GroupedProvider at "/DocumentReference?type=http://loinc.org|60591-5&patient=" with id $patientId as $byType
      Then $response.status should be 200
      And $byType at "Bundle.type" should be "searchset"
      And $byType at "Bundle.entry.resource.ofType(DocumentReference).all(type.coding.where(system='http://loinc.org' and code='60591-5').exists())" should be true

    @covers:DocumentReference.read
    Scenario: grp-008 Read a DocumentReference by id
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scopes system/DocumentReference.rs, system/Binary.r, system/Patient.rs)"
      And Client is asked for $documentId with "The logical id of a reference DocumentReference on the server"
      And set header "Authorization" to $accessToken
      When Client gets from GroupedProvider at "/DocumentReference/" with id $documentId as $docRef
      Then $response.status should be 200
      And $docRef at "DocumentReference.id" should be "$documentId"
      And $docRef at "DocumentReference.subject.exists()" should be true
      And $docRef at "DocumentReference.content.attachment.contentType.exists()" should be true

    @covers:DocumentReference.read
    Scenario: grp-009 An unknown DocumentReference id gives 404 and an OperationOutcome
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scopes system/DocumentReference.rs, system/Binary.r, system/Patient.rs)"
      And set header "Authorization" to $accessToken
      When Client gets from GroupedProvider at "/DocumentReference/otb-no-such-document-000" as $missing
      Then $response.status should be 404
      And $missing at "OperationOutcome.issue.exists()" should be true

  Rule: Retrieve Document [ITI-68]

    @covers:Binary.read
    Scenario: grp-010 Read the document content as a Binary
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scopes system/DocumentReference.rs, system/Binary.r, system/Patient.rs)"
      And Client is asked for $binaryId with "The logical id of a reference Binary on the server"
      And set header "Authorization" to $accessToken
      When Client gets from GroupedProvider at "/Binary/" with id $binaryId as $binary
      Then $response.status should be 200
      And $response.body should not be empty

  Rule: Patient lookup (PDQm ITI-78) is available when the server offers it

    # Patient is SHOULD on the Access Provider: a server that does not offer it
    # answers 404 or 501 and these scenarios are not applicable to it. A server
    # that does offer it SHALL support all of the search parameters below.
    @covers:Patient.read,Patient.search-type,Patient.search.identifier
    Scenario: grp-011 Search Patient by identifier
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scopes system/DocumentReference.rs, system/Binary.r, system/Patient.rs)"
      And Client is asked for $patientIdentifier with "The identifier (system|value) of the reference patient who has documents on the server"
      And set header "Authorization" to $accessToken
      When Client gets from GroupedProvider at "/Patient?identifier=" with id $patientIdentifier as $patients
      Then $response.status should be 200
      And $patients at "Bundle.type" should be "searchset"
      And $patients at "Bundle.entry.resource.ofType(Patient).count() >= 1" should be true
      And $patients should conform to "http://hl7.org/fhir/StructureDefinition/Bundle" ignoring slicing errors

    @covers:Patient.read,Patient.search.id
    Scenario: grp-012 Read Patient by id and conform to patient-eu-core
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scopes system/DocumentReference.rs, system/Binary.r, system/Patient.rs)"
      And Client is asked for $patientId with "The logical id of the reference patient on the server"
      And set header "Authorization" to $accessToken
      When Client gets from GroupedProvider at "/Patient/" with id $patientId as $patient
      Then $response.status should be 200
      And $patient should conform to "http://hl7.eu/fhir/base/StructureDefinition/patient-eu-core" ignoring slicing errors

    @covers:Patient.search.family,Patient.search.given,Patient.search.birthdate,Patient.search.gender
    Scenario: grp-013 Search Patient by demographics the reference patient has
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scopes system/DocumentReference.rs, system/Binary.r, system/Patient.rs)"
      And Client is asked for $patientId with "The logical id of the reference patient on the server"
      And set header "Authorization" to $accessToken
      When Client gets from GroupedProvider at "/Patient/" with id $patientId as $ref
      Then $response.status should be 200
      And extract "/name/0/family" from $response.body as $family
      And extract "/gender" from $response.body as $gender
      When Client gets from GroupedProvider at "/Patient?family=" with id $family as $byFamily
      Then $response.status should be 200
      And $byFamily at "Bundle.entry.resource.ofType(Patient).exists()" should be true
      When Client gets from GroupedProvider at "/Patient?gender=" with id $gender as $byGender
      Then $response.status should be 200
      And $byGender at "Bundle.entry.resource.ofType(Patient).exists()" should be true
