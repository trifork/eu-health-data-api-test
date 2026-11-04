// ===== RENDERING ONLY — delete with the Binary resource entries in sushi-config.yaml =====
// The Gherkin ships to runners as raw .feature files under package/tests/ via the
// path-test parameter. These Binaries only make each script render as a
// syntax-highlighted page on the IG site ("ig-loader-<file>" inlines the file).

Instance: eu-api-document-publisher-gherkin-script
InstanceOf: Binary
Usage: #definition
* language = #en
* contentType = #text/x-gherkin
* data = "ig-loader-eu-api-document-publisher.feature"

Instance: eu-api-document-access-provider-gherkin-script
InstanceOf: Binary
Usage: #definition
* language = #en
* contentType = #text/x-gherkin
* data = "ig-loader-eu-api-document-access-provider.feature"

Instance: eu-api-document-consumer-gherkin-script
InstanceOf: Binary
Usage: #definition
* language = #en
* contentType = #text/x-gherkin
* data = "ig-loader-eu-api-document-consumer.feature"

Instance: eu-api-document-publisher-access-provider-gherkin-script
InstanceOf: Binary
Usage: #definition
* language = #en
* contentType = #text/x-gherkin
* data = "ig-loader-eu-api-document-publisher-access-provider.feature"

Instance: eu-api-resource-access-provider-gherkin-script
InstanceOf: Binary
Usage: #definition
* language = #en
* contentType = #text/x-gherkin
* data = "ig-loader-eu-api-resource-access-provider.feature"

Instance: eu-api-resource-consumer-gherkin-script
InstanceOf: Binary
Usage: #definition
* language = #en
* contentType = #text/x-gherkin
* data = "ig-loader-eu-api-resource-consumer.feature"
