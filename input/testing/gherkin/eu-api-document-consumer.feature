# EEHRxF Document Consumer — hl7.fhir.eu.health-data-api 1.0.0-ballot.
# SUT is a client: groups MHD Document Consumer (ITI-67, ITI-68), PDQm Patient
# Demographics Consumer (ITI-78) and IUA Authorization Client. The test bed plays
# the Document Access Provider. Source: CapabilityStatement document-consumer-eu-api.
@lang:itb-core-en@^2 @dialect:fhir-validator@^2 @actor:DocumentConsumer @spec:hl7.fhir.eu.health-data-api@1.0.0-ballot
Feature: EEHRxF Document Consumer — token, patient lookup, find and retrieve documents
  The SUT obtains a token, finds the patient, finds the documents and retrieves one.

  Background:
    Given DocumentConsumer is the system under test as defined by "http://hl7.eu/fhir/health-data-api/CapabilityStatement/document-consumer-eu-api"
    And AccessProvider is infrastructure
    And FHIRValidator is a fhir-validator at "http://fhir-validator:8080"

  Rule: SMART Backend Services authorization

    @covers:security.smart-backend-services
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.con-001 (input bindings and expected data).
    Scenario: con-001 The SUT authenticates with a signed JWT client assertion (RFC 7523)
      Given AccessProvider is listening for DocumentConsumer
      And DocumentConsumer is informed "Obtain an access token from the token endpoint configured for this session (system/DocumentReference.rs system/Binary.r system/Patient.rs)."
      When AccessProvider receives a request from DocumentConsumer within 300 seconds
      Then $received.method should be "POST"
      And $received.body should contain "grant_type=client_credentials"
      And $received.body should contain "client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer"
      And $received.body should match "client_assertion=[A-Za-z0-9_-]+[.][A-Za-z0-9_-]+[.][A-Za-z0-9_-]+([&]|$)"
      And $received.body should contain "scope="
      And AccessProvider replies to DocumentConsumer with status 200 and:
        """
        { "access_token": "otb-test-token", "token_type": "Bearer", "expires_in": 300, "scope": "system/DocumentReference.rs system/Binary.r system/Patient.rs" }
        """

  Rule: Patient lookup [ITI-78]

    @covers:Patient.search-type,Patient.search.identifier
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.con-002 (input bindings and expected data).
    Scenario: con-002 The SUT searches Patient by the identifier parameter
      Given AccessProvider is listening for DocumentConsumer
      And DocumentConsumer is informed "Find the patient with identifier http://example.org/ids|OTB-1 on the Access Provider configured for this session."
      When AccessProvider receives a request from DocumentConsumer within 300 seconds
      Then $received.method should be "GET"
      And $received.path should contain "/Patient"
      And $received.path should contain "identifier="
      And $received.headers.Authorization should contain "Bearer"
      And AccessProvider replies to DocumentConsumer with status 200 and:
        """
        { "resourceType": "Bundle", "type": "searchset", "total": 1,
           "entry": [{ "resource": { "resourceType": "Patient", "id": "otb-pat-1",
             "identifier": [{ "system": "http://example.org/ids", "value": "OTB-1" }],
             "name": [{ "family": "Jansen", "given": ["Jan"] }] } }] }
        """

  Rule: Find Document References [ITI-67]

    @covers:DocumentReference.search-type
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.con-003 (input bindings and expected data).
    Scenario: con-003 The SUT searches DocumentReference by patient
      Given AccessProvider is listening for DocumentConsumer
      And DocumentConsumer is informed "List the documents of patient otb-pat-1 on the Access Provider configured for this session."
      When AccessProvider receives a request from DocumentConsumer within 300 seconds
      Then $received.method should be "GET"
      And $received.path should contain "/DocumentReference"
      And $received.path should match "patient=(Patient(/|%2F))?otb-pat-1([&]|$)"
      And $received.headers.Authorization should contain "Bearer"
      And AccessProvider replies to DocumentConsumer with status 200 and:
        """
        { "resourceType": "Bundle", "type": "searchset", "total": 1,
           "entry": [{ "resource": { "resourceType": "DocumentReference", "id": "otb-doc-1", "status": "current",
             "type": { "coding": [{ "system": "http://loinc.org", "code": "60591-5" }] },
             "category": [{ "coding": [{ "system": "http://hl7.eu/fhir/health-data-api/CodeSystem/eehrxf-document-priority-category-cs", "code": "Patient-Summaries" }] }],
             "subject": { "reference": "Patient/otb-pat-1" },
             "content": [{ "attachment": { "contentType": "application/fhir+json", "url": "Binary/otb-bin-1" } }] } }] }
        """

    @covers:DocumentReference.search-type
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.con-004 (input bindings and expected data).
    Scenario: con-004 The SUT can narrow the search by category or type
      Given AccessProvider is listening for DocumentConsumer
      And DocumentConsumer is informed "List only the Patient Summary documents of patient otb-pat-1."
      When AccessProvider receives a request from DocumentConsumer within 300 seconds
      Then $received.method should be "GET"
      And $received.path should contain "/DocumentReference"
      And $received.path should match "patient=(Patient(/|%2F))?otb-pat-1([&]|$)"
      And $received.path should match "[?&](type|category)="
      And AccessProvider replies to DocumentConsumer with status 200 and:
        """
        { "resourceType": "Bundle", "type": "searchset", "total": 0 }
        """

  Rule: Retrieve Document [ITI-68]

    @covers:Binary.read,DocumentReference.read
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.con-005 (input bindings and expected data).
    Scenario: con-005 The SUT retrieves the document content with a bearer token
      Given AccessProvider is listening for DocumentConsumer
      And DocumentConsumer is informed "Retrieve the content of document otb-doc-1 from the Access Provider configured for this session. Its DocumentReference content attachment URL is Binary/otb-bin-1."
      When AccessProvider receives a request from DocumentConsumer within 300 seconds
      Then $received.method should be "GET"
      And $received.path should match "Binary/otb-bin-1([?#]|$)"
      And $received.headers.Authorization should contain "Bearer"
      And AccessProvider replies to DocumentConsumer with status 200 and:
        """
        { "resourceType": "Bundle", "type": "document" }
        """

  Rule: Transport security

    @covers:security.tls
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.con-006 (input bindings and expected data).
    Scenario: con-006 TLS 1.2 or higher is used for all communications
      When DocumentConsumer submits evidence of "the TLS protocol version negotiated with the test bed (packet capture, server log or openssl output)" as $tlsEvidence
      Then DocumentConsumer confirms each of these is accepted for "the connection":
        | item        | detail |
        | TLS >= 1.2  |  |
