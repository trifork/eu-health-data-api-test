# Fixture campaigns for a central ITB installation

Status: discussion proposal, not an implemented central service. Recorded 6 November 2026.

For a long-lived, shared ITB installation, provide a versioned fixture dataset per vendor target environment and testing campaign. Load it once, resolve the server-assigned resource IDs, and reuse those bindings across the associated tests. Generate a fresh dataset when the vendor explicitly starts a new campaign, rather than for every individual test execution.

## ITB sessions and campaign scope

An ITB **test session** is one execution of one test case. A suite groups cases; running several cases creates several sessions. A **conformance statement** links a registered system to a specification actor and identifies the relevant tests. It is not a temporary fixture lifecycle. These distinctions are defined in the [official ITB glossary](https://www.itb.ec.europa.eu/docs/itb-ta/latest/introduction/index.html#glossary).

“Campaign” here is a proposed application concept, not an existing ITB session type. It would associate one target environment and fixture dataset with selected suite versions, potentially across multiple conformance statements for that same system. Each participating ITB session would record its campaign and resolved inputs.

## Proposed central workflow

1. **Create a campaign.** Select the vendor's registered system, target environment, applicable actors, test-suite versions and fixture version. Allocate a campaign identifier.
2. **Generate the dataset.** Produce a transaction bundle and a matching expectation manifest from the fixture template. Give business identifiers and conditional-create tags campaign-specific values, and preserve consistent internal references. Clinical facts and expected results remain reproducible. Changing only transaction UUIDs would not prevent conditional creation from reusing an earlier campaign's data.
3. **Let the vendor provision it.** Offer a download and instructions. The vendor can submit the transaction, use an administrative import, or enter equivalent data through its application. Transaction support must not become an extra conformance requirement for a read-only provider. Provision only the data required by the selected cases.
4. **Resolve and verify bindings.** Accept the transaction response or an explicit mapping, or discover resources through supported searches using campaign identifiers. Check identities, relationships and required fixture facts. Do not assume every type supports identifier search; Binary may need an explicit mapping or resolution through its DocumentReference attachment.
5. **Run tests using the campaign.** Supply its bindings to each participating session and check relevant prerequisites before execution. Missing or ambiguous fixtures should be identified as a setup problem, distinct from a completed conformance assertion. A failure of an API behavior being tested must still remain visible as a conformance failure; preflight must not hide it.
6. **Reuse or replace explicitly.** Allow reruns with the same dataset. Invalidate or reverify bindings after an endpoint change, server reset or data change. Starting a new campaign produces a distinct dataset. Define separate data or reset rules for cases that create or modify resources, including concurrent executions.

Each campaign should retain its owner and target, fixture and suite versions, generated bundle and manifest, bindings and verification history. Each session should retain an immutable record of the campaign and inputs used. Credentials remain separately managed runtime inputs and must not be embedded in downloadable fixture bundles.

## Decisions needed before implementation

- Where should campaign creation and storage live: a companion service, authoring tooling, or an ITB integration? How should the selected integration deliver campaign bindings to test inputs through a supported interface?
- Should vendors normally reuse a campaign, or start a fresh one for each formal assessment? What triggers expiry or mandatory reverification?
- How should manual imports, partial implementations and servers without suitable discovery searches provide their mappings?
- How should setup failures appear in ITB, and how should data-changing tests, parallel runs and cleanup be handled?
- How should campaign-level reports relate to ITB's existing conformance status? ITB aggregates the latest case results, so a campaign report must explicitly select its sessions rather than silently combine results from different datasets or suite versions. See [ITB test results](https://www.itb.ec.europa.eu/docs/itb-ta/latest/introduction/index.html#test-result).

The repository already contains a reusable [fixture contract](../input/testing/fixtures/provider-v1/README.md) and [helpers for transaction loading, server ID mapping and data verification](../scripts/fixture-data.mjs). These are building blocks, not a central campaign service. The generic ITB cases currently request their input values from the operator. Campaign-specific fixture generation, durable registration, vendor-facing provisioning, automatic binding delivery for central sessions and campaign reporting remain proposed work. No central campaign behavior is introduced by this note.
