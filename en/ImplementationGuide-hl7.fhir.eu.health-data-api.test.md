# Resource EU Health Data API: TestPlans and Gherkin for the EEHRxF API actors



## Resource Content

```json
{
  "resourceType" : "ImplementationGuide",
  "id" : "hl7.fhir.eu.health-data-api.test",
  "language" : "en",
  "url" : "http://example.com/fhir/hl7.fhir.eu.health-data-api.test/ImplementationGuide/hl7.fhir.eu.health-data-api.test",
  "version" : "0.1.0",
  "name" : "EUHealthDataApiTesting",
  "title" : "EU Health Data API: TestPlans and Gherkin for the EEHRxF API actors",
  "status" : "active",
  "date" : "2026-10-30",
  "publisher" : "Jens Kristian Villadsen",
  "contact" : [{
    "name" : "Jens Kristian Villadsen",
    "telecom" : [{
      "system" : "url",
      "value" : "https://trifork.com"
    }]
  }],
  "description" : "A demonstration IG that declares, as TestPlan resources and Gherkin feature files, the conformance tests for the six actors of the EU Health Data API IG (EHDS Annex II): Document Publisher, Document Access Provider (with the Document Submission Option), Document Consumer, grouped Document Publisher/Access Provider, Resource Access Provider and Resource Consumer. The IG states its requirements as capabilitystatement-expectation extensions rather than profile obligations, so every test case is traceable to the CapabilityStatement expectation it tests.",
  "jurisdiction" : [{
    "coding" : [{
      "system" : "http://unstats.un.org/unsd/methods/m49/m49.htm",
      "code" : "001",
      "display" : "World"
    }]
  }],
  "packageId" : "hl7.fhir.eu.health-data-api.test",
  "license" : "CC0-1.0",
  "fhirVersion" : ["6.0.0-snapshot1"],
  "dependsOn" : [{
    "id" : "hl7tx",
    "extension" : [{
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/implementationguide-dependency-comment",
      "valueMarkdown" : "Automatically added as a dependency - all IGs depend on HL7 Terminology"
    }],
    "uri" : "http://terminology.hl7.org/ImplementationGuide/hl7.terminology",
    "packageId" : "hl7.terminology.r5",
    "version" : "7.5.0"
  },
  {
    "id" : "hl7ext",
    "extension" : [{
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/implementationguide-dependency-comment",
      "valueMarkdown" : "Automatically added as a dependency - all IGs depend on the HL7 Extension Pack"
    }],
    "uri" : "http://hl7.org/fhir/extensions/ImplementationGuide/hl7.fhir.uv.extensions",
    "packageId" : "hl7.fhir.uv.extensions.r5",
    "version" : "5.4.0"
  },
  {
    "id" : "hl7_fhir_uv_testing",
    "uri" : "http://hl7.org/fhir/uv/testing/ImplementationGuide/hl7.fhir.uv.testing",
    "packageId" : "hl7.fhir.uv.testing",
    "version" : "current"
  }],
  "definition" : {
    "extension" : [{
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-internal-dependency",
      "valueCode" : "hl7.fhir.uv.tools.r5#1.3.0"
    }],
    "resource" : [{
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "TestPlan"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "TestPlan-eu-api-document-publisher-tests.html"
      }],
      "reference" : {
        "reference" : "TestPlan/eu-api-document-publisher-tests"
      },
      "name" : "Document Publisher Test Plan",
      "description" : "Declares the Gherkin test cases for the Document Publisher actor of EU Health Data API, 1.0.0-ballot.",
      "isExample" : true,
      "profile" : ["http://hl7.org/fhir/StructureDefinition/TestPlan|0.1.0-snapshot1"]
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "TestPlan"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "TestPlan-eu-api-document-access-provider-tests.html"
      }],
      "reference" : {
        "reference" : "TestPlan/eu-api-document-access-provider-tests"
      },
      "name" : "Document Access Provider Test Plan",
      "description" : "Declares the Gherkin test cases for the Document Access Provider actor of EU Health Data API, 1.0.0-ballot.",
      "isExample" : true,
      "profile" : ["http://hl7.org/fhir/StructureDefinition/TestPlan|0.1.0-snapshot1"]
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "TestPlan"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "TestPlan-eu-api-document-consumer-tests.html"
      }],
      "reference" : {
        "reference" : "TestPlan/eu-api-document-consumer-tests"
      },
      "name" : "Document Consumer Test Plan",
      "description" : "Declares the Gherkin test cases for the Document Consumer actor of EU Health Data API, 1.0.0-ballot.",
      "isExample" : true,
      "profile" : ["http://hl7.org/fhir/StructureDefinition/TestPlan|0.1.0-snapshot1"]
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "TestPlan"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "TestPlan-eu-api-document-publisher-access-provider-tests.html"
      }],
      "reference" : {
        "reference" : "TestPlan/eu-api-document-publisher-access-provider-tests"
      },
      "name" : "Grouped Document Publisher/Access Provider Test Plan",
      "description" : "Declares the Gherkin test cases for the Grouped Document Publisher/Access Provider actor of EU Health Data API, 1.0.0-ballot.",
      "isExample" : true,
      "profile" : ["http://hl7.org/fhir/StructureDefinition/TestPlan|0.1.0-snapshot1"]
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "TestPlan"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "TestPlan-eu-api-resource-access-provider-tests.html"
      }],
      "reference" : {
        "reference" : "TestPlan/eu-api-resource-access-provider-tests"
      },
      "name" : "Resource Access Provider Test Plan",
      "description" : "Declares the Gherkin test cases for the Resource Access Provider actor of EU Health Data API, 1.0.0-ballot.",
      "isExample" : true,
      "profile" : ["http://hl7.org/fhir/StructureDefinition/TestPlan|0.1.0-snapshot1"]
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "TestPlan"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "TestPlan-eu-api-resource-consumer-tests.html"
      }],
      "reference" : {
        "reference" : "TestPlan/eu-api-resource-consumer-tests"
      },
      "name" : "Resource Consumer Test Plan",
      "description" : "Declares the Gherkin test cases for the Resource Consumer actor of EU Health Data API, 1.0.0-ballot.",
      "isExample" : true,
      "profile" : ["http://hl7.org/fhir/StructureDefinition/TestPlan|0.1.0-snapshot1"]
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/implementationguide-resource-format",
        "valueCode" : "text/x-gherkin"
      },
      {
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "Binary"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "Binary-eu-api-document-publisher-gherkin-script.html"
      }],
      "reference" : {
        "reference" : "Binary/eu-api-document-publisher-gherkin-script"
      },
      "name" : "Document Publisher Gherkin Script",
      "description" : "Gherkin feature file with the test scenarios for the Document Publisher actor.",
      "isExample" : false
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/implementationguide-resource-format",
        "valueCode" : "text/x-gherkin"
      },
      {
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "Binary"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "Binary-eu-api-document-access-provider-gherkin-script.html"
      }],
      "reference" : {
        "reference" : "Binary/eu-api-document-access-provider-gherkin-script"
      },
      "name" : "Document Access Provider Gherkin Script",
      "description" : "Gherkin feature file with the test scenarios for the Document Access Provider actor.",
      "isExample" : false
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/implementationguide-resource-format",
        "valueCode" : "text/x-gherkin"
      },
      {
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "Binary"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "Binary-eu-api-document-consumer-gherkin-script.html"
      }],
      "reference" : {
        "reference" : "Binary/eu-api-document-consumer-gherkin-script"
      },
      "name" : "Document Consumer Gherkin Script",
      "description" : "Gherkin feature file with the test scenarios for the Document Consumer actor.",
      "isExample" : false
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/implementationguide-resource-format",
        "valueCode" : "text/x-gherkin"
      },
      {
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "Binary"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "Binary-eu-api-document-publisher-access-provider-gherkin-script.html"
      }],
      "reference" : {
        "reference" : "Binary/eu-api-document-publisher-access-provider-gherkin-script"
      },
      "name" : "Grouped Document Publisher/Access Provider Gherkin Script",
      "description" : "Gherkin feature file with the test scenarios for the Grouped Document Publisher/Access Provider actor.",
      "isExample" : false
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/implementationguide-resource-format",
        "valueCode" : "text/x-gherkin"
      },
      {
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "Binary"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "Binary-eu-api-resource-access-provider-gherkin-script.html"
      }],
      "reference" : {
        "reference" : "Binary/eu-api-resource-access-provider-gherkin-script"
      },
      "name" : "Resource Access Provider Gherkin Script",
      "description" : "Gherkin feature file with the test scenarios for the Resource Access Provider actor.",
      "isExample" : false
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/implementationguide-resource-format",
        "valueCode" : "text/x-gherkin"
      },
      {
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "Binary"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "Binary-eu-api-resource-consumer-gherkin-script.html"
      }],
      "reference" : {
        "reference" : "Binary/eu-api-resource-consumer-gherkin-script"
      },
      "name" : "Resource Consumer Gherkin Script",
      "description" : "Gherkin feature file with the test scenarios for the Resource Consumer actor.",
      "isExample" : false
    }],
    "page" : {
      "sourceUrl" : "toc.html",
      "name" : "toc.html",
      "title" : "Table of Contents",
      "generation" : "html",
      "page" : [{
        "sourceUrl" : "index.html",
        "name" : "index.html",
        "title" : "Home",
        "generation" : "markdown"
      },
      {
        "sourceUrl" : "testing.html",
        "name" : "testing.html",
        "title" : "Testing",
        "generation" : "markdown"
      },
      {
        "sourceUrl" : "process.html",
        "name" : "process.html",
        "title" : "Method",
        "generation" : "markdown"
      },
      {
        "sourceUrl" : "changes.html",
        "name" : "changes.html",
        "title" : "Changes",
        "generation" : "html"
      },
      {
        "sourceUrl" : "downloads.html",
        "name" : "downloads.html",
        "title" : "Downloads",
        "generation" : "html"
      }]
    },
    "parameter" : [{
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "copyrightyear"
      },
      "value" : "2026+"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "releaselabel"
      },
      "value" : "ci-build"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "path-test"
      },
      "value" : "input/testing"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "incubator-ig"
      },
      "value" : "hl7.fhir.uv.testing"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "path-binary"
      },
      "value" : "input/testing/gherkin"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "autoload-resources"
      },
      "value" : "true"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/guide-parameter-code",
        "code" : "path-resource"
      },
      "value" : "input/capabilities"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/guide-parameter-code",
        "code" : "path-resource"
      },
      "value" : "input/examples"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/guide-parameter-code",
        "code" : "path-resource"
      },
      "value" : "input/extensions"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/guide-parameter-code",
        "code" : "path-resource"
      },
      "value" : "input/models"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/guide-parameter-code",
        "code" : "path-resource"
      },
      "value" : "input/operations"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/guide-parameter-code",
        "code" : "path-resource"
      },
      "value" : "input/profiles"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/guide-parameter-code",
        "code" : "path-resource"
      },
      "value" : "input/resources"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/guide-parameter-code",
        "code" : "path-resource"
      },
      "value" : "input/vocabulary"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/guide-parameter-code",
        "code" : "path-resource"
      },
      "value" : "input/maps"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/guide-parameter-code",
        "code" : "path-resource"
      },
      "value" : "input/testing"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/guide-parameter-code",
        "code" : "path-resource"
      },
      "value" : "input/history"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/guide-parameter-code",
        "code" : "path-resource"
      },
      "value" : "fsh-generated/resources"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/guide-parameter-code",
        "code" : "path-pages"
      },
      "value" : "template/config"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/guide-parameter-code",
        "code" : "path-pages"
      },
      "value" : "input/assets"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/guide-parameter-code",
        "code" : "path-pages"
      },
      "value" : "input/images"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "path-liquid-template"
      },
      "value" : "template/liquid"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "path-liquid-template"
      },
      "value" : "input/liquid"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "path-qa"
      },
      "value" : "temp/qa"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "path-temp"
      },
      "value" : "temp/pages"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "path-output"
      },
      "value" : "output"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/guide-parameter-code",
        "code" : "path-tx-cache"
      },
      "value" : "input-cache/txcache"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "path-suppressed-warnings"
      },
      "value" : "input/ignoreWarnings.txt"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "path-history"
      },
      "value" : "http://example.com/fhir/hl7.fhir.eu.health-data-api.test/history.html"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "template-html"
      },
      "value" : "template-page.html"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "template-md"
      },
      "value" : "template-page-md.html"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "apply-contact"
      },
      "value" : "true"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "apply-context"
      },
      "value" : "true"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "apply-copyright"
      },
      "value" : "true"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "apply-jurisdiction"
      },
      "value" : "true"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "apply-license"
      },
      "value" : "true"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "apply-publisher"
      },
      "value" : "true"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "apply-version"
      },
      "value" : "true"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "apply-wg"
      },
      "value" : "true"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "active-tables"
      },
      "value" : "true"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "fmm-definition"
      },
      "value" : "http://hl7.org/fhir/versions.html#maturity"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "propagate-status"
      },
      "value" : "true"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "excludelogbinaryformat"
      },
      "value" : "true"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "tabbed-snapshots"
      },
      "value" : "true"
    },
    {
      "code" : {
        "system" : "http://hl7.org/fhir/tools/CodeSystem/ig-parameters",
        "code" : "i18n-default-lang"
      },
      "value" : "en"
    }]
  }
}

```
