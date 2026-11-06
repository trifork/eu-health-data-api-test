# EEHRxF Document Publisher — hl7.fhir.eu.health-data-api 1.0.0-ballot.
# SUT is a client: groups MHD Document Source (ITI-105 Simplified Publish), PDQm
# Patient Demographics Consumer (ITI-78) and IUA Authorization Client. The test bed
# plays the Document Access Provider and the authorization server, answers what the
# SUT sends and checks each request. Source: CapabilityStatement
# document-publisher-eu-api.
@lang:itb-core-en@^2 @dialect:fhir-validator@^2 @actor:DocumentPublisher @spec:hl7.fhir.eu.health-data-api@1.0.0-ballot
Feature: EEHRxF Document Publisher — token, patient lookup and Simplified Publish
  The SUT obtains a token, finds the patient, and publishes a document with embedded content.

  Background:
    Given DocumentPublisher is the system under test as defined by "http://hl7.eu/fhir/health-data-api/CapabilityStatement/document-publisher-eu-api"
    And AccessProvider is infrastructure
    And FHIRValidator is a fhir-validator at "http://fhir-validator:8080"

  Rule: SMART Backend Services authorization

    @covers:security.smart-backend-services
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.pub-001 (input bindings and expected data).
    Scenario: pub-001 The SUT authenticates with a signed JWT client assertion (RFC 7523)
      Given AccessProvider is listening for DocumentPublisher
      And DocumentPublisher is informed "Obtain an access token from the token endpoint configured for this session (system/DocumentReference.c system/Patient.rs)."
      When AccessProvider receives a request from DocumentPublisher within 300 seconds
      Then $received.method should be "POST"
      And $received.body should contain "grant_type=client_credentials"
      And $received.body should contain "client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer"
      And $received.body should match "client_assertion=[A-Za-z0-9_-]+[.][A-Za-z0-9_-]+[.][A-Za-z0-9_-]+([&]|$)"
      And $received.body should contain "scope="
      And AccessProvider replies to DocumentPublisher with status 200 and:
        """
        { "access_token": "otb-test-token", "token_type": "Bearer", "expires_in": 300, "scope": "system/DocumentReference.c system/Patient.rs" }
        """

  Rule: Patient lookup [ITI-78]

    @covers:Patient.search-type,Patient.search.identifier
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.pub-002 (input bindings and expected data).
    Scenario: pub-002 The SUT looks the patient up by identifier with a bearer token
      Given AccessProvider is listening for DocumentPublisher
      And DocumentPublisher is informed "Look up the patient with identifier http://example.org/ids|OTB-1 on the Access Provider configured for this session, then stop."
      When AccessProvider receives a request from DocumentPublisher within 300 seconds
      Then $received.method should be "GET"
      And $received.path should contain "/Patient"
      And $received.path should contain "identifier="
      And $received.headers.Authorization should contain "Bearer"
      And AccessProvider replies to DocumentPublisher with status 200 and:
        """
        { "resourceType": "Bundle", "type": "searchset", "total": 1,
           "entry": [{ "resource": { "resourceType": "Patient", "id": "otb-pat-1",
             "identifier": [{ "system": "http://example.org/ids", "value": "OTB-1" }],
             "name": [{ "family": "Jansen", "given": ["Jan"] }], "gender": "male", "birthDate": "1970-01-01" } }] }
        """

  Rule: Simplified Publish [ITI-105]

    @covers:DocumentReference.create
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.pub-003 (input bindings and expected data).
    Scenario: pub-003 The SUT creates a DocumentReference with the document embedded
      Given FHIRValidator is loaded with package "hl7.fhir.eu.health-data-api#1.0.0-ballot"
      And AccessProvider is listening for DocumentPublisher
      And DocumentPublisher is informed "Publish a Patient Summary for patient otb-pat-1 to the Access Provider configured for this session using Simplified Publish."
      When AccessProvider receives a request from DocumentPublisher within 300 seconds
      Then $received.method should be "POST"
      And $received.path should contain "/DocumentReference"
      And $received.headers.Authorization should contain "Bearer"
      And $received.body at "DocumentReference.resourceType" should be "DocumentReference"
      And $received.body at "DocumentReference.content.attachment.data.exists()" should be true
      And $received.body at "DocumentReference.subject.exists()" should be true
      And $received.body should conform to "https://profiles.ihe.net/ITI/MHD/StructureDefinition/IHE.MHD.SimplifiedPublish.DocumentReference" ignoring slicing errors
      And AccessProvider replies to DocumentPublisher with status 201 and:
        """
        { "resourceType": "OperationOutcome", "issue": [{ "severity": "information", "code": "informational", "diagnostics": "created" }] }
        """

    @covers:DocumentReference.create
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.pub-004 (input bindings and expected data).
    Scenario: pub-004 The SUT publishes only the minimal metadata profile it claims
      Given FHIRValidator is loaded with package "hl7.fhir.eu.health-data-api#1.0.0-ballot"
      And AccessProvider is listening for DocumentPublisher
      And DocumentPublisher is informed "Publish a second Patient Summary for patient otb-pat-1 to the Access Provider configured for this session."
      When AccessProvider receives a request from DocumentPublisher within 300 seconds
      Then $received.body should conform to "https://profiles.ihe.net/ITI/MHD/StructureDefinition/IHE.MHD.Minimal.DocumentReference" ignoring slicing errors
      And AccessProvider replies to DocumentPublisher with status 201 and:
        """
        { "resourceType": "OperationOutcome", "issue": [{ "severity": "information", "code": "informational", "diagnostics": "created" }] }
        """

    @covers:security.authorization
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.pub-005 (input bindings and expected data).
    Scenario: pub-005 After a 401 the SUT obtains a fresh token before retrying
      Given AccessProvider is listening for DocumentPublisher
      And DocumentPublisher is informed "Publish a document to the Access Provider. The test bed refuses the first attempt with 401, then expects a new token request and a retry that carries the new token. Respond as you normally would."
      When AccessProvider receives a request from DocumentPublisher within 300 seconds
      Then $received.method should be "POST"
      And $received.path should contain "/DocumentReference"
      And AccessProvider replies to DocumentPublisher with status 401 and:
        """
        { "resourceType": "OperationOutcome", "issue": [{ "severity": "error", "code": "login", "diagnostics": "expired" }] }
        """
      When AccessProvider receives a request from DocumentPublisher within 300 seconds
      Then $received.method should be "POST"
      And $received.body should contain "grant_type=client_credentials"
      And $received.body should match "client_assertion=[A-Za-z0-9_-]+[.][A-Za-z0-9_-]+[.][A-Za-z0-9_-]+([&]|$)"
      And AccessProvider replies to DocumentPublisher with status 200 and:
        """
        { "access_token": "otb-fresh-token", "token_type": "Bearer", "expires_in": 300, "scope": "system/DocumentReference.c system/Patient.rs" }
        """
      When AccessProvider receives a request from DocumentPublisher within 300 seconds
      Then $received.method should be "POST"
      And $received.path should contain "/DocumentReference"
      And $received.headers.Authorization should contain "otb-fresh-token"
      And AccessProvider replies to DocumentPublisher with status 201 and:
        """
        { "resourceType": "OperationOutcome", "issue": [{ "severity": "information", "code": "informational", "diagnostics": "created" }] }
        """

  Rule: Transport security

    @covers:security.tls
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.pub-006 (input bindings and expected data).
    Scenario: pub-006 TLS 1.2 or higher is used for all communications
      When DocumentPublisher submits evidence of "the TLS protocol version negotiated with the test bed (packet capture, server log or openssl output)" as $tlsEvidence
      Then DocumentPublisher confirms each of these is accepted for "the connection":
        | item        | detail |
        | TLS >= 1.2  |  |
