<a name="scope"> </a>

### Testing the EU Health Data API actors

This guide declares its tests with the [TestPlan](https://build.fhir.org/ig/HL7/fhir-testing-ig/en/StructureDefinition-TestPlan.html) resource from the [FHIR Testing IG](https://build.fhir.org/ig/HL7/fhir-testing-ig/en/) (`hl7.fhir.uv.testing`), one plan per actor the specification defines. Each plan's `scope` names the actor — what is under test — and each of its tests is one `Scenario:` of a Gherkin feature file that the plan points at through `suite.input.file`.

| Test plan | Under test | Content | Feature file |
| --------- | ---------- | ------- | ------------ |
| [Document Publisher Test Plan](TestPlan-eu-api-document-publisher-tests.html) | [Document Publisher](http://hl7.eu/fhir/health-data-api/ActorDefinition/document-publisher-actor-eu-api) | 6 scenarios, 7 element obligations covered | `eu-api-document-publisher.feature` |
| [Document Access Provider Test Plan](TestPlan-eu-api-document-access-provider-tests.html) | [Document Access Provider](http://hl7.eu/fhir/health-data-api/ActorDefinition/document-access-provider-actor-eu-api) | 17 scenarios, 24 element obligations covered | `eu-api-document-access-provider.feature` |
| [Document Consumer Test Plan](TestPlan-eu-api-document-consumer-tests.html) | [Document Consumer](http://hl7.eu/fhir/health-data-api/ActorDefinition/document-consumer-actor-eu-api) | 6 scenarios, 8 element obligations covered | `eu-api-document-consumer.feature` |
| [Grouped Document Publisher/Access Provider Test Plan](TestPlan-eu-api-document-publisher-access-provider-tests.html) | [Grouped Document Publisher/Access Provider](http://hl7.eu/fhir/health-data-api/ActorDefinition/document-publisher-access-provider-actor-eu-api) | 13 scenarios, 20 element obligations covered | `eu-api-document-publisher-access-provider.feature` |
| [Resource Access Provider Test Plan](TestPlan-eu-api-resource-access-provider-tests.html) | [Resource Access Provider](http://hl7.eu/fhir/health-data-api/ActorDefinition/resource-access-provider-actor-eu-api) | 18 scenarios, 34 element obligations covered | `eu-api-resource-access-provider.feature` |
| [Resource Consumer Test Plan](TestPlan-eu-api-resource-consumer-tests.html) | [Resource Consumer](http://hl7.eu/fhir/health-data-api/ActorDefinition/resource-consumer-actor-eu-api) | 7 scenarios, 11 element obligations covered | `eu-api-resource-consumer.feature` |

<a name="obligations"> </a>

### From obligations to test cases

The specification states its expectations as **obligations** on profile elements (the `obligation` extension): which actor must populate, be able to populate, handle or display which element, and how strongly. The test cases are derived from that list, not written from a reading of the narrative:

| Obligation | Test pattern |
| ---------- | ------------ |
| `SHALL:populate` | The element is present in every instance the Creator produces. |
| `SHALL:populate-if-known` | The element is present wherever the reference dataset the system was loaded with has it. |
| `SHALL:able-to-populate`, `SHOULD:able-to-populate` | Present in the produced document; where the reference data cannot exercise it, the tester attests the capability. |
| `MAY:able-to-populate` | Recorded in the test, not asserted. |
| `SHALL:handle` | The Consumer accepts a document carrying the element without error. |
| `SHOULD:display` | The Consumer shows the element to a human; the tester names the ones it does not, and each is asserted separately. |

Every scenario declares the profile and elements it covers (`@profile:`, `@covers:` tags) and must mention each element in a step; a script checks both against the specification package, so an obligation cannot be silently dropped when the specification or the tests change. The assertions themselves are self-tested against the specification's own example documents before they are published.

<a name="gherkin"> </a>

### The Gherkin feature files

The executable test cases live under `input/testing/gherkin/`. They ship **as Gherkin, not as a FHIR resource**: the `path-test` parameter mirrors the test tree into the published package under `package/tests/gherkin/`, which is what a test runner consumes. `TestPlan.suite.input.file` names the file, and each `suite.test` matches a `Scenario:` by its identifier.

The Binary resources on this site exist only so the scripts render as syntax-highlighted pages; removing them changes nothing for a runner.
