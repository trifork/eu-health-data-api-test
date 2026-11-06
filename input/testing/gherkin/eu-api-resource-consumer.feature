# EEHRxF Resource Consumer — hl7.fhir.eu.health-data-api 1.0.0-ballot.
# SUT is a client of the Resource Access Provider; the test bed plays the provider.
# Source: CapabilityStatement resource-consumer-eu-api. Patient search by identifier
# is SHALL; every other search parameter and resource type is SHOULD.
@lang:itb-core-en@^2 @dialect:fhir-validator@^2 @actor:ResourceConsumer @spec:hl7.fhir.eu.health-data-api@1.0.0-ballot
Feature: EEHRxF Resource Consumer — token, patient lookup and search by patient
  The SUT obtains a token, finds the patient and reads that patient's resources.

  Background:
    Given ResourceConsumer is the system under test as defined by "http://hl7.eu/fhir/health-data-api/CapabilityStatement/resource-consumer-eu-api"
    And ResourceProvider is infrastructure
    And FHIRValidator is a fhir-validator at "http://fhir-validator:8080"

  Rule: SMART Backend Services authorization

    @covers:security.smart-backend-services
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-001 (input bindings and expected data).
    Scenario: rc-001 The SUT authenticates with a signed JWT client assertion (RFC 7523)
      Given ResourceProvider is listening for ResourceConsumer
      And ResourceConsumer is informed "Obtain an access token from the token endpoint configured for this session (system/*.rs)."
      When ResourceProvider receives a request from ResourceConsumer within 300 seconds
      Then $received.method should be "POST"
      And $received.body should contain "grant_type=client_credentials"
      And $received.body should contain "client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer"
      And $received.body should contain "client_assertion="
      And $received.body should contain "scope="
      And ResourceProvider replies to ResourceConsumer with status 200 and:
        """
        { "access_token": "otb-test-token", "token_type": "Bearer", "expires_in": 300, "scope": "system/*.rs" }
        """

  Rule: Patient lookup

    @covers:Patient.search-type,Patient.search.identifier
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-002 (input bindings and expected data).
    Scenario: rc-002 The SUT searches Patient by the identifier parameter
      Given ResourceProvider is listening for ResourceConsumer
      And ResourceConsumer is informed "Find the patient with identifier http://example.org/ids|OTB-1 on the server configured for this session."
      When ResourceProvider receives a request from ResourceConsumer within 300 seconds
      Then $received.method should be "GET"
      And $received.path should contain "/Patient"
      And $received.path should contain "identifier="
      And $received.headers.Authorization should contain "Bearer"
      And ResourceProvider replies to ResourceConsumer with status 200 and:
        """
        { "resourceType": "Bundle", "type": "searchset", "total": 1,
           "entry": [{ "resource": { "resourceType": "Patient", "id": "otb-pat-1",
             "identifier": [{ "system": "http://example.org/ids", "value": "OTB-1" }],
             "name": [{ "family": "Jansen", "given": ["Jan"] }] } }] }
        """

    @covers:Patient.read
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-003 (input bindings and expected data).
    Scenario: rc-003 The SUT reads the patient by logical id
      Given ResourceProvider is listening for ResourceConsumer
      And ResourceConsumer is informed "Read patient otb-pat-1 by id from the server configured for this session."
      When ResourceProvider receives a request from ResourceConsumer within 300 seconds
      Then $received.method should be "GET"
      And $received.path should contain "/Patient/otb-pat-1"
      And ResourceProvider replies to ResourceConsumer with status 200 and:
        """
        { "resourceType": "Patient", "id": "otb-pat-1", "name": [{ "family": "Jansen" }] }
        """

  Rule: Search by patient

    @covers:Condition.search.patient
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-004 (input bindings and expected data).
    Scenario: rc-004 The SUT searches Condition by the patient parameter
      Given ResourceProvider is listening for ResourceConsumer
      And ResourceConsumer is informed "Retrieve the problem list (Condition) of patient otb-pat-1."
      When ResourceProvider receives a request from ResourceConsumer within 300 seconds
      Then $received.method should be "GET"
      And $received.path should contain "/Condition"
      And $received.path should contain "patient="
      And $received.headers.Authorization should contain "Bearer"
      And ResourceProvider replies to ResourceConsumer with status 200 and:
        """
        { "resourceType": "Bundle", "type": "searchset", "total": 0 }
        """

    @covers:Observation.search.patient,Observation.search.category,Observation.search.code,Observation.search.date
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-005 (input bindings and expected data).
    Scenario: rc-005 The SUT searches Observation by patient and category
      Given ResourceProvider is listening for ResourceConsumer
      And ResourceConsumer is informed "Retrieve the laboratory Observations of patient otb-pat-1."
      When ResourceProvider receives a request from ResourceConsumer within 300 seconds
      Then $received.method should be "GET"
      And $received.path should contain "/Observation"
      And $received.path should contain "patient="
      And $received.path should contain "category="
      And ResourceProvider replies to ResourceConsumer with status 200 and:
        """
        { "resourceType": "Bundle", "type": "searchset", "total": 0 }
        """

    @covers:AllergyIntolerance.search.patient
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-006 (input bindings and expected data).
    Scenario: rc-006 The SUT searches AllergyIntolerance by the patient parameter
      Given ResourceProvider is listening for ResourceConsumer
      And ResourceConsumer is informed "Retrieve the allergies (AllergyIntolerance) of patient otb-pat-1."
      When ResourceProvider receives a request from ResourceConsumer within 300 seconds
      Then $received.method should be "GET"
      And $received.path should contain "/AllergyIntolerance"
      And $received.path should contain "patient="
      And ResourceProvider replies to ResourceConsumer with status 200 and:
        """
        { "resourceType": "Bundle", "type": "searchset", "total": 0 }
        """

  Rule: Transport security

    @covers:security.tls
    # Fixture contract: fixtures/provider-v1/manifest.json, cases.rc-007 (input bindings and expected data).
    Scenario: rc-007 TLS 1.2 or higher is used for all communications
      When ResourceConsumer submits evidence of "the TLS protocol version negotiated with the test bed (packet capture, server log or openssl output)" as $tlsEvidence
      Then ResourceConsumer confirms each of these is accepted for "the connection":
        | item        | detail |
        | TLS >= 1.2  |  |
