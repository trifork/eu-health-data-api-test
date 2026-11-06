# EEHRxF Resource Access Provider — hl7.fhir.eu.health-data-api 1.0.0-ballot.
# Instantiates the IPA server CapabilityStatement and constrains it to read and
# search of Patient and the clinical resource types below. Everything except
# Patient is SHOULD on the actor; a type the system does not offer answers 404 or
# 501 and its scenario does not apply. Source: CapabilityStatement
# resource-access-provider-eu-api.
@lang:itb-core-en@^2 @dialect:fhir-validator@^2 @actor:ResourceAccessProvider @spec:hl7.fhir.eu.health-data-api@1.0.0-ballot
Feature: EEHRxF Resource Access Provider — read and search of patient resources
  The SUT serves individual FHIR resources for a patient, behind SMART Backend Services.

  Background:
    Given ResourceAccessProvider is the system under test at "http://ehr.example.org/fhir" as defined by "http://hl7.eu/fhir/health-data-api/CapabilityStatement/resource-access-provider-eu-api"
    And Client is infrastructure
    And FHIRValidator is a fhir-validator at "http://fhir-validator:8080"
    And set header "Accept" to "application/fhir+json"

  Rule: The server declares what the actor requires

    @covers:CapabilityStatement.rest.resource.Patient
    Scenario: rap-001 The CapabilityStatement declares Patient read and search and SMART security
      When Client gets from ResourceAccessProvider at "/metadata" as $capability
      Then $response.status should be 200
      And $capability at "CapabilityStatement.rest.where(mode='server').resource.where(type='Patient').interaction.where(code='read').exists()" should be true
      And $capability at "CapabilityStatement.rest.where(mode='server').resource.where(type='Patient').interaction.where(code='search-type').exists()" should be true
      And $capability at "CapabilityStatement.rest.where(mode='server').security.service.coding.where(code='SMART-on-FHIR').exists()" should be true

  Rule: Authorization is required

    @covers:security.authorization
    Scenario: rap-002 A request without a token is refused
      Given Client is asked for $patientIdentifier with "The identifier (system|value) of the reference patient"
      When Client gets from ResourceAccessProvider at "/Patient?identifier=" with id $patientIdentifier as $unauth
      Then $response.status should be 401

    @covers:security.scope
    Scenario: rap-003 A token with no usable scope is refused
      Given Client is asked for $narrowToken with "An access token that lacks every system/ scope this server protects, as 'Bearer <token>'"
      And Client is asked for $patientId with "The logical id of the reference patient, with at least one matching fixture for each resource type being tested"
      And set header "Authorization" to $narrowToken
      When Client gets from ResourceAccessProvider at "/Patient/" with id $patientId as $denied
      Then $response.status should be one of "401, 403"

  Rule: Patient read and search

    @covers:Patient.read
    Scenario: rap-004 Read the patient and conform to patient-eu-core
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scope system/*.rs)"
      And Client is asked for $patientId with "The logical id of the reference patient, with at least one matching fixture for each resource type being tested"
      And set header "Authorization" to $accessToken
      When Client gets from ResourceAccessProvider at "/Patient/" with id $patientId as $patient
      Then $response.status should be 200
      And $patient should conform to "http://hl7.eu/fhir/base/StructureDefinition/patient-eu-core" ignoring slicing errors

    @covers:Patient.search.identifier,Patient.search.id
    Scenario: rap-005 Search Patient by identifier and by _id
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scope system/*.rs)"
      And Client is asked for $patientIdentifier with "The identifier (system|value) of the reference patient"
      And Client is asked for $patientId with "The logical id of the reference patient, with at least one matching fixture for each resource type being tested"
      And set header "Authorization" to $accessToken
      When Client gets from ResourceAccessProvider at "/Patient?identifier=" with id $patientIdentifier as $byIdentifier
      Then $response.status should be 200
      And $byIdentifier at "Bundle.type" should be "searchset"
      And $byIdentifier at "Bundle.entry.resource.ofType(Patient).count() >= 1" should be true
      When Client gets from ResourceAccessProvider at "/Patient?_id=" with id $patientId as $byId
      Then $response.status should be 200
      And $byId at "Bundle.entry.resource.ofType(Patient).count() = 1" should be true

    @covers:Patient.search.family,Patient.search.given,Patient.search.birthdate,Patient.search.gender,Patient.search.active
    Scenario: rap-006 Search Patient by the demographics the reference patient carries
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scope system/*.rs)"
      And Client is asked for $patientId with "The logical id of the reference patient, with at least one matching fixture for each resource type being tested"
      And set header "Authorization" to $accessToken
      When Client gets from ResourceAccessProvider at "/Patient/" with id $patientId as $ref
      Then $response.status should be 200
      And extract "/name/0/family" from $response.body as $family
      And extract "/gender" from $response.body as $gender
      And extract "/birthDate" from $response.body as $birthdate
      When Client gets from ResourceAccessProvider at "/Patient?family=" with id $family as $byFamily
      Then $response.status should be 200
      And $byFamily at "Bundle.entry.resource.ofType(Patient).exists()" should be true
      When Client gets from ResourceAccessProvider at "/Patient?gender=" with id $gender as $byGender
      Then $response.status should be 200
      And $byGender at "Bundle.entry.resource.ofType(Patient).exists()" should be true
      When Client gets from ResourceAccessProvider at "/Patient?birthdate=" with id $birthdate as $byBirth
      Then $response.status should be 200
      And $byBirth at "Bundle.entry.resource.ofType(Patient).exists()" should be true
      When Client gets from ResourceAccessProvider at "/Patient?active=true&_id=" with id $patientId as $byActive
      Then $response.status should be 200
      And $byActive at "Bundle.type" should be "searchset"

  # For each supported type, seed at least one resource for the reference patient
  # matching the query filters below. Explicit _include entries are not matches.
  Rule: Search by patient for each clinical resource type

    @covers:Condition.search-type,Condition.search.patient
    Scenario: rap-007 Search Condition by patient returns a searchset of Condition
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scope system/*.rs)"
      And Client is asked for $patientId with "The logical id of the reference patient, with at least one matching fixture for each resource type being tested"
      And set header "Authorization" to $accessToken
      When Client gets from ResourceAccessProvider at "/Condition?patient=" with id $patientId as $found
      Then $response.status should be 200
      And $found at "Bundle.type" should be "searchset"
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(Condition).exists() and resource.subject.reference.exists())" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()" should be "$patientId"

    @covers:AllergyIntolerance.search-type,AllergyIntolerance.search.patient
    Scenario: rap-008 Search AllergyIntolerance by patient returns a searchset of AllergyIntolerance
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scope system/*.rs)"
      And Client is asked for $patientId with "The logical id of the reference patient, with at least one matching fixture for each resource type being tested"
      And set header "Authorization" to $accessToken
      When Client gets from ResourceAccessProvider at "/AllergyIntolerance?patient=" with id $patientId as $found
      Then $response.status should be 200
      And $found at "Bundle.type" should be "searchset"
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(AllergyIntolerance).exists() and resource.patient.reference.exists())" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.patient.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.patient.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()" should be "$patientId"

    @covers:Observation.search-type,Observation.search.patient
    Scenario: rap-009 Search Observation by patient returns a searchset of Observation
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scope system/*.rs)"
      And Client is asked for $patientId with "The logical id of the reference patient, with at least one matching fixture for each resource type being tested"
      And set header "Authorization" to $accessToken
      When Client gets from ResourceAccessProvider at "/Observation?category=laboratory&date=ge2000-01-01&patient=" with id $patientId as $found
      Then $response.status should be 200
      And $found at "Bundle.type" should be "searchset"
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(Observation).exists() and resource.subject.reference.exists())" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()" should be "$patientId"

    @covers:DiagnosticReport.search-type,DiagnosticReport.search.patient
    Scenario: rap-010 Search DiagnosticReport by patient returns a searchset of DiagnosticReport
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scope system/*.rs)"
      And Client is asked for $patientId with "The logical id of the reference patient, with at least one matching fixture for each resource type being tested"
      And set header "Authorization" to $accessToken
      When Client gets from ResourceAccessProvider at "/DiagnosticReport?category=LAB&date=ge2000-01-01&patient=" with id $patientId as $found
      Then $response.status should be 200
      And $found at "Bundle.type" should be "searchset"
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(DiagnosticReport).exists() and resource.subject.reference.exists())" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()" should be "$patientId"

    @covers:ImagingStudy.search-type,ImagingStudy.search.patient
    Scenario: rap-011 Search ImagingStudy by patient returns a searchset of ImagingStudy
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scope system/*.rs)"
      And Client is asked for $patientId with "The logical id of the reference patient, with at least one matching fixture for each resource type being tested"
      And set header "Authorization" to $accessToken
      When Client gets from ResourceAccessProvider at "/ImagingStudy?patient=" with id $patientId as $found
      Then $response.status should be 200
      And $found at "Bundle.type" should be "searchset"
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(ImagingStudy).exists() and resource.subject.reference.exists())" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()" should be "$patientId"

    @covers:MedicationRequest.search-type,MedicationRequest.search.patient
    Scenario: rap-012 Search MedicationRequest by patient returns a searchset of MedicationRequest
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scope system/*.rs)"
      And Client is asked for $patientId with "The logical id of the reference patient, with at least one matching fixture for each resource type being tested"
      And set header "Authorization" to $accessToken
      When Client gets from ResourceAccessProvider at "/MedicationRequest?patient=" with id $patientId as $found
      Then $response.status should be 200
      And $found at "Bundle.type" should be "searchset"
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(MedicationRequest).exists() and resource.subject.reference.exists())" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()" should be "$patientId"

    @covers:MedicationDispense.search-type,MedicationDispense.search.patient
    Scenario: rap-013 Search MedicationDispense by patient returns a searchset of MedicationDispense
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scope system/*.rs)"
      And Client is asked for $patientId with "The logical id of the reference patient, with at least one matching fixture for each resource type being tested"
      And set header "Authorization" to $accessToken
      When Client gets from ResourceAccessProvider at "/MedicationDispense?patient=" with id $patientId as $found
      Then $response.status should be 200
      And $found at "Bundle.type" should be "searchset"
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(MedicationDispense).exists() and resource.subject.reference.exists())" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()" should be "$patientId"

    @covers:Immunization.search-type,Immunization.search.patient
    Scenario: rap-014 Search Immunization by patient returns a searchset of Immunization
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scope system/*.rs)"
      And Client is asked for $patientId with "The logical id of the reference patient, with at least one matching fixture for each resource type being tested"
      And set header "Authorization" to $accessToken
      When Client gets from ResourceAccessProvider at "/Immunization?patient=" with id $patientId as $found
      Then $response.status should be 200
      And $found at "Bundle.type" should be "searchset"
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(Immunization).exists() and resource.patient.reference.exists())" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.patient.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.patient.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()" should be "$patientId"

    @covers:MedicationStatement.search-type,MedicationStatement.search.patient
    Scenario: rap-015 Search MedicationStatement by patient returns a searchset of MedicationStatement
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scope system/*.rs)"
      And Client is asked for $patientId with "The logical id of the reference patient, with at least one matching fixture for each resource type being tested"
      And set header "Authorization" to $accessToken
      When Client gets from ResourceAccessProvider at "/MedicationStatement?patient=" with id $patientId as $found
      Then $response.status should be 200
      And $found at "Bundle.type" should be "searchset"
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(MedicationStatement).exists() and resource.subject.reference.exists())" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()" should be "$patientId"

    @covers:Encounter.search-type,Encounter.search.patient
    Scenario: rap-016 Search Encounter by patient returns a searchset of Encounter
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scope system/*.rs)"
      And Client is asked for $patientId with "The logical id of the reference patient, with at least one matching fixture for each resource type being tested"
      And set header "Authorization" to $accessToken
      When Client gets from ResourceAccessProvider at "/Encounter?date=ge2000-01-01&patient=" with id $patientId as $found
      Then $response.status should be 200
      And $found at "Bundle.type" should be "searchset"
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').exists()" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').all(resource.ofType(Encounter).exists() and resource.subject.reference.exists())" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().count() = 1" should be true
      And $found at "Bundle.entry.where(search.mode.empty() or search.mode != 'include').resource.subject.reference.select(replaceMatches('^(.*/)?Patient/', '').replaceMatches('/_history/.*$', '')).distinct().single()" should be "$patientId"

  Rule: Read by id

    @covers:Observation.read,Condition.read
    Scenario: rap-017 A found resource can be read back by its id
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scope system/*.rs)"
      And Client is asked for $patientId with "The logical id of the reference patient, with at least one matching fixture for each resource type being tested"
      And set header "Authorization" to $accessToken
      When Client gets from ResourceAccessProvider at "/Observation?patient=" with id $patientId as $obs
      Then $response.status should be 200
      And extract "/entry/0/resource/id" from $response.body as $obsId
      When Client gets from ResourceAccessProvider at "/Observation/" with id $obsId as $one
      Then $response.status should be 200
      And $one at "Observation.id" should be "$obsId"

    @covers:Patient.read
    Scenario: rap-018 An unknown id gives 404 and an OperationOutcome
      Given Client is asked for $accessToken with "A SMART Backend Services access token for this server, as 'Bearer <token>' (scope system/*.rs)"
      And set header "Authorization" to $accessToken
      When Client gets from ResourceAccessProvider at "/Patient/otb-no-such-patient-000" as $missing
      Then $response.status should be 404
      And $missing at "OperationOutcome.issue.exists()" should be true
