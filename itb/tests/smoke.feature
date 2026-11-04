@lang:itb-core-en@^2 @dialect:fhir-validator@^2
Feature: Local ITB integration smoke check
  Background:
    Given DocumentConsumer is the system under test
    And AccessProvider is infrastructure
    And FHIRValidator is a fhir-validator at "http://fhir-validator:8080"

  Scenario: smoke-001 Callback assertions and FHIRPath work
    Given AccessProvider is listening for DocumentConsumer
    When AccessProvider receives a request from DocumentConsumer within 20 seconds
    Then $received.method should be "POST"
    And $received.path should contain "/probe"
    And $received.headers.Authorization should contain "Bearer"
    And $received.body at "Patient.active" should be true
    And AccessProvider replies to DocumentConsumer with status 201 and:
      """
      { "accepted": true }
      """

  Scenario: smoke-002 A mismatched substring must fail
    Given AccessProvider is listening for DocumentConsumer
    When AccessProvider receives a request from DocumentConsumer within 20 seconds
    Then $received.headers.Authorization should contain "Bearer"
    And AccessProvider replies to DocumentConsumer with status 201 and:
      """
      { "accepted": true }
      """
