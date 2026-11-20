# VeriTraceAI — Master Architectural Decision Log

> This is the authoritative, cumulative chronological record of every architectural decision
> made across the lifecycle of VeriTraceAI.
>
> Each decision links directly to its standalone, formal Architecture Decision Record in the
> [`docs/adr/`](./README.md) registry.
>
> **Immutability Principle:** Decisions are never renumbered or erased once logged. Revisions
> and superseding changes are documented via new ADRs and marked explicitly in this record.

---

## Phase 1 — Vision, Scope & Non-Goals

### [#1 — Product framing](./01-vision-scope/ADR-0001-product-framing.md)
*Individual ADR: [`ADR-0001`](./01-vision-scope/ADR-0001-product-framing.md)*
*Context:* Needed an unambiguous one-line definition of what VeriTraceAI is, to prevent scope creep toward adjacent fraud/AML products.
*Decision:* VeriTraceAI is an **evidence-grounded AI copilot for KYB/UBO compliance investigation** — it helps a human investigator determine whether declared company ownership is independently corroborated, surfaces conflicts, and recommends the next human step.
*Rationale:* A narrow, defensible framing lets every subsequent architectural choice be tested against "does this serve evidence-grounded investigation, or does it drift toward autonomous decisioning."
*Alternatives rejected:* General-purpose AML fraud detection platform (too broad, regulatorily heavier); single composite risk-score product (conflicts with #2).
*Status:* Final.

### [#2 — Explicit non-goals](./01-vision-scope/ADR-0002-explicit-non-goals.md)
*Individual ADR: [`ADR-0002`](./01-vision-scope/ADR-0002-explicit-non-goals.md)*
*Context:* "AI compliance tool" is a label broad enough to accidentally justify almost any feature.
*Decision:* VeriTraceAI is explicitly **not** a fraud detector, **not** a single risk score generator, and **not** an autonomous decision-maker. Every finding must trace to underlying evidence; every case terminates in a human decision, never a system-issued verdict.
*Rationale:* These three non-goals are structurally enforced (not just policy) throughout the data model — e.g., `case_decisions` is insert-only and always has a human `decided_by`; there is no "risk_score" column anywhere in the schema.
*Alternatives rejected:* Adding an optional composite score "for convenience" — rejected because it re-introduces the exact ambiguity the product exists to avoid.
*Status:* Final.

### [#3 — Primary user](./01-vision-scope/ADR-0003-primary-user.md)
*Individual ADR: [`ADR-0003`](./01-vision-scope/ADR-0003-primary-user.md)*
*Context:* Needed to decide whose workflow the UI and API optimize for.
*Decision:* Primary persona is the **human investigator** working a case queue; secondary personas are a reviewing supervisor and a compliance/audit reader (read-only, post-hoc).
*Rationale:* Determines queue-first navigation (DESIGN.md §5.1), the permanently-visible decision row (§5.2), and why `audit_events` exists as a first-class, partitioned table rather than an afterthought.
*Alternatives rejected:* Optimizing for a batch/ops persona (automated bulk screening) — explicitly out of scope per #2.
*Status:* Final.

### [#4 — Build philosophy / standing operating mode](./01-vision-scope/ADR-0004-build-philosophy-standing-operating-mode.md)
*Individual ADR: [`ADR-0004`](./01-vision-scope/ADR-0004-build-philosophy-standing-operating-mode.md)*
*Context:* With dozens of implementation forks ahead, a per-fork confirmation loop would be slow and would surface mostly non-judgment-call questions.
*Decision:* Resolve all future technical forks via single-best-practice reasoning without per-item confirmation; ask the user only when a genuine non-technical, no-single-defensible-answer judgment call exists. Log every resolution as a numbered decision here.
*Rationale:* Keeps forward progress fast while preserving an auditable trail — itself consistent with the product's own evidence-grounded, traceable ethos.
*Alternatives rejected:* Full interactive confirm-everything loop (too slow); fully autonomous no-log mode (not auditable, inconsistent with #1/#2).
*Status:* Final — governs all decisions from #5 onward.

---

## Phase 2 — Strategic Design & Bounded Contexts

### [#5 — Bounded context split](./02-strategic-design/ADR-0005-bounded-context-split.md)
*Individual ADR: [`ADR-0005`](./02-strategic-design/ADR-0005-bounded-context-split.md)*
*Context:* Needed a module boundary that matches both the domain language and the eventual deployability of pieces independently.
*Decision:* Four bounded contexts: **`platform`** (tenancy, users, erasure), **`intake`** (document ingestion/OCR/extraction), **`case_evidence`** (entities, persons, evidence, findings, ownership, cases, decisions, audit), **`screening`** (watchlist matching). Each owns its own schema namespace.
*Rationale:* Matches natural data-ownership seams; each context has a distinct insert/mutate profile (append-only vs. mutable) that benefits from schema-level isolation.
*Alternatives rejected:* Single flat schema (harder to reason about mutation rules per table); context-per-microservice from day one (premature operational overhead).
*Status:* Final.

### [#6 — Multi-tenancy model](./02-strategic-design/ADR-0006-multi-tenancy-model.md)
*Individual ADR: [`ADR-0006`](./02-strategic-design/ADR-0006-multi-tenancy-model.md)*
*Context:* VeriTraceAI will serve multiple compliance teams/firms; needed a tenancy strategy.
*Decision:* Row-level multi-tenancy via a `tenant_id` column on every tenant-scoped table, enforced by Postgres **Row-Level Security (RLS)**, not schema-per-tenant or database-per-tenant.
*Rationale:* RLS gives hard isolation guarantees enforced at the database layer (not just application code), while keeping operational overhead to one database/schema set — appropriate for expected tenant counts.
*Alternatives rejected:* Schema-per-tenant (migration fan-out cost); DB-per-tenant (operational overhead disproportionate to scale).
*Status:* Final.

### [#7 — Entity/Person/Address as shared reference data](./02-strategic-design/ADR-0007-entity-person-address-as-shared-reference-data.md)
*Individual ADR: [`ADR-0007`](./02-strategic-design/ADR-0007-entity-person-address-as-shared-reference-data.md)*
*Context:* Ownership structures reference the same legal entities and natural persons across many cases.
*Decision:* `entities`, `persons`, and `addresses` are modeled as shared, tenant-scoped reference tables, referenced (not duplicated) by `ownership_edges` and `findings`.
*Rationale:* Avoids duplicate, drifting copies of the same legal entity across cases; supports cross-case entity resolution later without a schema change.
*Alternatives rejected:* Denormalized per-case copies of entity/person data (simpler short-term, but breaks cross-case corroboration later).
*Status:* Final.

### [#8 — Ownership representation: relational + graph, dual-store](./02-strategic-design/ADR-0008-ownership-representation-relational-graph-dual-store.md)
*Individual ADR: [`ADR-0008`](./02-strategic-design/ADR-0008-ownership-representation-relational-graph-dual-store.md)*
*Context:* Ownership structures are graph-shaped (edges, cycles, multi-hop chains) but also need transactional, auditable row-level history.
*Decision:* `ownership_edges` lives in Postgres as the system of record (with exclusive-arc evidence sourcing, see #9); a **Neo4j** projection holds the same relationships as a queryable graph (`OWNS_DECLARED` / `OWNS_OBSERVED` / `OWNS_RECONCILED` relationship types) for traversal, cycle detection, and visualization.
*Rationale:* Postgres gives transactional integrity and RLS; Neo4j gives efficient multi-hop traversal and cycle detection that would be painful as recursive SQL CTEs at scale.
*Alternatives rejected:* Graph-only store (loses RLS/transactional guarantees); relational-only with recursive CTEs (correct but operationally painful for deep/cyclic ownership chains).
*Status:* Final.

### [#9 — Exclusive-arc sourcing for ownership edges and evidence](./02-strategic-design/ADR-0009-exclusive-arc-sourcing-for-ownership-edges-and-evidence.md)
*Individual ADR: [`ADR-0009`](./02-strategic-design/ADR-0009-exclusive-arc-sourcing-for-ownership-edges-and-evidence.md)*
*Context:* Every ownership edge and every evidence record must trace to exactly one declared-document source, confirmatory source, or system-detected conflict — never an ambiguous mix.
*Decision:* `ownership_edges` and `evidence` both use a **CHECK-constraint-enforced exclusive arc** across their possible source-reference columns (exactly one must be non-null per row), plus **revoked-not-deleted** semantics (an `update`/`delete` is disallowed; corrections insert a new row and mark the old one `revoked_at`).
*Rationale:* Structurally guarantees the "evidence-before-conclusion" principle (DESIGN.md §1) at the database layer, not just in application logic; revoked-not-deleted preserves a full audit trail of corrections, which compliance review depends on.
*Alternatives rejected:* Nullable multi-source columns validated only in application code (not tamper-proof, not DB-enforced); true row deletion/update on correction (destroys audit trail).
*Status:* Final.

### [#10 — Findings as the atomic unit of "something worth a human look"](./02-strategic-design/ADR-0010-findings-as-the-atomic-unit-of-something-worth-a-human-look.md)
*Individual ADR: [`ADR-0010`](./02-strategic-design/ADR-0010-findings-as-the-atomic-unit-of-something-worth-a-human-look.md)*
*Context:* Needed a concept between raw evidence and a case-level decision.
*Decision:* A `findings` table represents one discrete, evidence-linked observation (e.g., an ownership percentage conflict), linked to one or more evidence rows via `finding_evidence_links`. Cases aggregate findings; decisions resolve findings, not raw evidence directly.
*Rationale:* Matches investigator mental model (cases are decided one finding at a time) and gives the UI a natural unit for the Finding Switcher (DESIGN.md §5.2).
*Alternatives rejected:* Decisions applied directly against raw evidence rows (loses the aggregation/triage step investigators actually perform).
*Status:* Final.

### [#11 — Case as the unit of work, not the unit of evidence](./02-strategic-design/ADR-0011-case-as-the-unit-of-work-not-the-unit-of-evidence.md)
*Individual ADR: [`ADR-0011`](./02-strategic-design/ADR-0011-case-as-the-unit-of-work-not-the-unit-of-evidence.md)*
*Context:* Needed to decide what a "case" actually bundles.
*Decision:* A `case` bundles one subject `entity`, its full `ownership_edges` graph, and all `findings` raised against it; `case_status` and `region_status` enums track overall and per-jurisdiction progress separately.
*Rationale:* Multi-jurisdiction entities need independently trackable regional review progress without splitting into separate cases.
*Alternatives rejected:* One case per jurisdiction per entity (fragments a single legal entity's story across disconnected records).
*Status:* Final.

### [#12 — Audit trail as a first-class, partitioned table](./02-strategic-design/ADR-0012-audit-trail-as-a-first-class-partitioned-table.md)
*Individual ADR: [`ADR-0012`](./02-strategic-design/ADR-0012-audit-trail-as-a-first-class-partitioned-table.md)*
*Context:* Compliance and audit requirements demand a durable, queryable record of every state-changing action.
*Decision:* `audit_events` is an insert-only table, **range-partitioned by `occurred_at`** (monthly partitions, e.g. `audit_events_2026_12`), capturing actor, action, before/after state, and tenant.
*Rationale:* Partitioning keeps query performance stable as audit volume grows indefinitely (audit data is never purged); insert-only matches the same tamper-evidence principle as #9.
*Alternatives rejected:* Single unpartitioned table (degrades over years of retained audit history); external log-only audit trail (loses relational queryability against case/finding data).
*Status:* Final.

### [#13 — `model_runs` as the seam between the domain and any AI/ML component](./02-strategic-design/ADR-0013-model-runs-as-the-seam-between-the-domain-and-any-ai-ml-component.md)
*Individual ADR: [`ADR-0013`](./02-strategic-design/ADR-0013-model-runs-as-the-seam-between-the-domain-and-any-ai-ml-component.md)*
*Context:* Needed one place to record *every* model invocation (vendor LLM or custom model) against the case/finding/evidence it touched, without coupling the schema to a specific vendor or model type.
*Decision:* `model_runs` is an insert-only table keyed by `model_task_type` (e.g., narrative generation, entity resolution, match-confidence scoring), storing inputs/outputs/provenance, referenced by whichever downstream row it informed. Both the vendor-LLM path and the later custom Inference Service (#69) write through this same table.
*Rationale:* Keeps the domain schema model-agnostic; every AI-assisted step is auditable and attributable, consistent with #2's "not an autonomous decision-maker."
*Alternatives rejected:* Separate tables per model/vendor (fragments provenance, complicates audit queries).
*Status:* Final.

---

## Phase 3 — Data Model & Persistence

### [#14 — Field-level encryption and crypto-shredding scope](./02-strategic-design/ADR-0014-field-level-encryption-and-crypto-shredding-scope.md)
*Individual ADR: [`ADR-0014`](./02-strategic-design/ADR-0014-field-level-encryption-and-crypto-shredding-scope.md)*
*Context:* GDPR/PDPA erasure requests must be honorable without destroying the evidentiary/audit value of an entire case.
*Decision:* Only a narrow set of fields are stored **application-layer encrypted** with per-subject data encryption keys (DEKs): date of birth and other direct person identifiers on `persons`. Erasure is performed by **destroying the DEK** (crypto-shredding), not by deleting rows — ciphertext remains as an unreadable tombstone, everything else in the case (findings, evidence metadata, audit trail) survives intact.
*Rationale:* Satisfies "right to erasure" without breaking referential integrity or destroying non-personal evidentiary context; scoping encryption narrowly (not whole-row) keeps query performance acceptable for the vast majority of non-PII columns.
*Alternatives rejected:* Whole-database encryption at rest only (doesn't satisfy per-subject erasure without full dataset re-encryption); hard-delete on erasure request (destroys audit/evidence integrity, unacceptable for a compliance product).
*Status:* Final — downstream `erasure_requests` table (#74) implements the request/fulfillment workflow for this decision.

### [#15 — Primary key strategy](./03-data-modeling/ADR-0015-primary-key-strategy.md)
*Individual ADR: [`ADR-0015`](./03-data-modeling/ADR-0015-primary-key-strategy.md)*
*Context:* Needed a consistent PK scheme across all tenant-scoped tables.
*Decision:* UUIDv7 primary keys everywhere (time-ordered UUIDs), generated application-side or via `gen_random_uuid()`-equivalent, never auto-increment integers.
*Rationale:* UUIDv7 preserves rough insertion-order index locality (unlike UUIDv4) while avoiding the enumerability/leakage risk of sequential integer IDs across a multi-tenant system.
*Alternatives rejected:* Sequential bigint IDs (cross-tenant enumeration risk); UUIDv4 (worse index locality, no ordering benefit).
*Status:* Final.

### [#16 — Soft state vs. hard state](./03-data-modeling/ADR-0016-soft-state-vs-hard-state.md)
*Individual ADR: [`ADR-0016`](./03-data-modeling/ADR-0016-soft-state-vs-hard-state.md)*
*Context:* Needed a consistent rule for which tables allow UPDATE/DELETE and which don't.
*Decision:* Tables representing **assertions/evidence/history** (`evidence`, `ownership_edges`, `case_decisions`, `audit_events`, `model_runs`, `screening_matches`, `match_dispositions`, `document_integrity_checks`, `extracted_fields`) are insert-only or revoked-not-deleted. Tables representing **current operational state** (`cases`, `entities`, `persons`, `documents`, `extraction_jobs`) allow controlled updates.
*Rationale:* Matches #9's exclusive-arc principle at the whole-schema level; gives a single mental rule ("is this a fact or a status") instead of per-table special-casing.
*Alternatives rejected:* Uniform mutability (breaks the audit guarantee); uniform immutability (makes ordinary operational status tracking unworkable).
*Status:* Final.

### [#17 — `cases.assigned_investigator_id` / `created_by_id` as forward-reference FKs](./03-data-modeling/ADR-0017-cases-assigned-investigator-id-created-by-id-as-forward-reference-fks.md)
*Individual ADR: [`ADR-0017`](./03-data-modeling/ADR-0017-cases-assigned-investigator-id-created-by-id-as-forward-reference-fks.md)*
*Context:* `platform.users` and `case_evidence.cases` have a circular dependency (a case references a user; schema load order must resolve both).
*Decision:* `cases` is created without these FK constraints initially; they are added via a deferred `ALTER TABLE ... ADD CONSTRAINT` once both schemas exist, matching the migration order in FULL_DATABASE_SCHEMA.md §1.
*Rationale:* Standard pattern for resolving genuine bidirectional schema dependencies without introducing a spurious third linking table.
*Alternatives rejected:* Linking table between cases and users (unnecessary indirection for a simple FK relationship).
*Status:* Final.

### [#18 — `case_status` and `region_status` as explicit Postgres enums](./03-data-modeling/ADR-0018-case-status-and-region-status-as-explicit-postgres-enums.md)
*Individual ADR: [`ADR-0018`](./03-data-modeling/ADR-0018-case-status-and-region-status-as-explicit-postgres-enums.md)*
*Context:* Case lifecycle needs a small, closed set of states enforced at the database layer, not just validated in application code.
*Decision:* Native Postgres `ENUM` types for both, matching STATE_MACHINE.md's transition diagram exactly (e.g., `intake → under_review → escalated/resolved`).
*Rationale:* Enum types reject invalid states at the write layer, catching bugs earlier than application-only validation.
*Alternatives rejected:* Free-text status column with app-layer validation (no DB-level guarantee); separate lookup table (unnecessary indirection for a small, stable set of values).
*Status:* Final.

### [#19 — Evidence source exclusivity columns](./03-data-modeling/ADR-0019-evidence-source-exclusivity-columns.md)
*Individual ADR: [`ADR-0019`](./03-data-modeling/ADR-0019-evidence-source-exclusivity-columns.md)*
*Context:* Specific to how #9's exclusive-arc constraint is physically shaped for `evidence`.
*Decision:* `evidence` carries nullable `document_id`, `registry_snapshot_id`, and `screening_match_id` reference columns plus a CHECK constraint requiring exactly one non-null.
*Rationale:* Keeps a single `evidence` table queryable across all source types instead of three separate evidence tables with duplicated downstream linking logic.
*Alternatives rejected:* Table-per-source-type (fragments `finding_evidence_links` into three parallel join tables).
*Status:* Final.

### [#20 — Jurisdiction/region as a first-class dimension, not metadata](./03-data-modeling/ADR-0020-jurisdiction-region-as-a-first-class-dimension-not-metadata.md)
*Individual ADR: [`ADR-0020`](./03-data-modeling/ADR-0020-jurisdiction-region-as-a-first-class-dimension-not-metadata.md)*
*Context:* UBO investigations are inherently multi-jurisdiction (an entity may have ownership across several countries with different disclosure regimes).
*Decision:* `region_status` is tracked per case per jurisdiction in a dedicated structure, not collapsed into a single case-level status.
*Rationale:* Allows a case to be "resolved" in one jurisdiction while still "under review" in another, matching real regulatory practice.
*Alternatives rejected:* Single case-wide status (loses per-jurisdiction granularity needed for accurate compliance reporting).
*Status:* Final.

### [#21 — Timestamps: `occurred_at` vs. `created_at` distinction](./03-data-modeling/ADR-0021-timestamps-occurred-at-vs-created-at-distinction.md)
*Individual ADR: [`ADR-0021`](./03-data-modeling/ADR-0021-timestamps-occurred-at-vs-created-at-distinction.md)*
*Context:* Audit and evidence tables need to distinguish "when did this happen in the real world" from "when did our system record it."
*Decision:* Event-shaped tables (`audit_events`, evidence with a document date, etc.) carry both an `occurred_at` (or equivalent domain timestamp) and a `created_at` (system insert time); purely operational tables carry only `created_at`/`updated_at`.
*Rationale:* Real-world event time and system ingestion time legitimately diverge (e.g., a document dated months ago, uploaded today) and both matter for investigation accuracy.
*Alternatives rejected:* Single timestamp column (loses the real-world-vs-system-time distinction needed for accurate evidence dating).
*Status:* Final.

### [#22 — No soft "is_deleted" flags](./03-data-modeling/ADR-0022-no-soft-is-deleted-flags.md)
*Individual ADR: [`ADR-0022`](./03-data-modeling/ADR-0022-no-soft-is-deleted-flags.md)*
*Context:* A common anti-pattern is adding `is_deleted boolean` to every table "just in case."
*Decision:* No table uses a generic `is_deleted` flag; each context has an explicit, purpose-built mechanism instead (`revoked_at` for evidence/ownership, `erasure_requests` status progression for PII, ordinary status enums for operational entities).
*Rationale:* Generic soft-delete flags obscure *why* something is inactive; purpose-built mechanisms make the reason queryable and auditable.
*Alternatives rejected:* Universal `is_deleted` column (ambiguous semantics, doesn't distinguish erasure from correction from normal lifecycle progression).
*Status:* Final.

### [#23 — `tenants` and `users` as the root of `platform` schema](./04-persistence-storage/ADR-0023-tenants-and-users-as-the-root-of-platform-schema.md)
*Individual ADR: [`ADR-0023`](./04-persistence-storage/ADR-0023-tenants-and-users-as-the-root-of-platform-schema.md)*
*Context:* Needed the minimal platform-schema foundation before any tenant-scoped table can reference it.
*Decision:* `platform.tenants` and `platform.users` (with a `user_role` enum: e.g., investigator, supervisor, auditor, admin) are the first tables created in any environment bootstrap.
*Rationale:* Every other schema's RLS policies and FK references depend on these two tables existing first.
*Alternatives rejected:* Deferring tenancy modeling until after case_evidence schema (would require retrofitting RLS onto already-populated tables).
*Status:* Final.

### [#24 — Role model: coarse roles, fine permissions deferred](./04-persistence-storage/ADR-0024-role-model-coarse-roles-fine-permissions-deferred.md)
*Individual ADR: [`ADR-0024`](./04-persistence-storage/ADR-0024-role-model-coarse-roles-fine-permissions-deferred.md)*
*Context:* Needed to decide between a small fixed role enum vs. a full permissions/ACL system for v1.
*Decision:* v1 ships with a small, fixed `user_role` enum (not a configurable permissions matrix); finer-grained permissioning is explicitly deferred until a real multi-role customer need is observed.
*Rationale:* Avoids building a flexible-but-unused permissions engine speculatively; a fixed enum is sufficient for the known personas (#3).
*Alternatives rejected:* Full RBAC/ABAC engine from day one (speculative complexity with no current requirement driving it).
*Status:* Final (subject to revisit if a real need emerges).

### [#25 — Object storage key structure](./04-persistence-storage/ADR-0025-object-storage-key-structure.md)
*Individual ADR: [`ADR-0025`](./04-persistence-storage/ADR-0025-object-storage-key-structure.md)*
*Context:* Needed a convention for where documents and (later) model weights live in R2.
*Decision:* `documents/{tenant_id}/{case_id}/{document_id}/{filename}` and `inference-weights/{model_version}/` as the two top-level R2 key prefixes.
*Rationale:* Tenant-first prefixing supports per-tenant lifecycle/retention rules later; separating weights from documents under one bucket avoids provisioning a second bucket for a single small artifact class.
*Alternatives rejected:* Flat key structure with tenant_id only in metadata (harder to apply prefix-based lifecycle rules or access policies).
*Status:* Final.

### [#26 — Redis as ephemeral-only, never system-of-record](./04-persistence-storage/ADR-0026-redis-as-ephemeral-only-never-system-of-record.md)
*Individual ADR: [`ADR-0026`](./04-persistence-storage/ADR-0026-redis-as-ephemeral-only-never-system-of-record.md)*
*Context:* Needed to bound what Redis is allowed to be used for, to prevent silent dependence on it for durability.
*Decision:* Redis key namespaces are scoped to exactly five purposes — `ratelimit:*`, `idempotency:*`, `csrf:*`, `cache:registry_search:*`, `loginattempts:*` — each with an explicit TTL; nothing durable is ever Redis-only.
*Rationale:* Keeps Redis evictable/replaceable at any time without data loss risk; namespacing by prefix makes operational debugging and TTL auditing straightforward.
*Alternatives rejected:* Using Redis for session storage or durable queues (reintroduces a durability dependency the architecture deliberately avoids).
*Status:* Final.

### [#27 — Message/async processing: Inngest + ARQ, RabbitMQ/Kafka dropped](./04-persistence-storage/ADR-0027-message-async-processing-inngest-arq-rabbitmq-kafka-dropped.md)
*Individual ADR: [`ADR-0027`](./04-persistence-storage/ADR-0027-message-async-processing-inngest-arq-rabbitmq-kafka-dropped.md)*
*Context:* Needed an async job system for OCR/extraction pipelines and background tasks without operating a dedicated message broker cluster.
*Decision:* **Inngest** for durable, retryable, observable workflow steps (e.g., the intake → extraction → evidence-promotion pipeline) and **ARQ** (Redis-backed) for lightweight Python background tasks; RabbitMQ and Kafka were evaluated and dropped.
*Rationale:* Inngest removes the operational burden of running and scaling a broker while still providing durable step functions and retries; ARQ reuses the Redis dependency already present rather than adding a second queue technology for simple tasks.
*Alternatives rejected:* RabbitMQ/Kafka (justified at much higher throughput/ops maturity than this product currently needs; adds a cluster to operate and monitor).
*Status:* Final.

### [#28 — Email: Resend + fastapi-mail + MailHog](./04-persistence-storage/ADR-0028-email-resend-fastapi-mail-mailhog.md)
*Individual ADR: [`ADR-0028`](./04-persistence-storage/ADR-0028-email-resend-fastapi-mail-mailhog.md)*
*Context:* Needed transactional email (invites, erasure confirmations, digest notifications) across dev and production without vendor lock pain.
*Decision:* **Resend** as the production transactional email provider, **fastapi-mail** as the backend abstraction layer, **MailHog** as the local dev SMTP catcher (no real email sent in dev).
*Rationale:* fastapi-mail keeps the provider swappable behind one interface; MailHog gives developers a real inbox UI locally with zero external dependency; Resend has a developer-friendly API well-suited to transactional volume at this scale.
*Alternatives rejected:* SES directly (more AWS-specific wiring for marginal benefit at current scale); SendGrid (comparable, Resend preferred for DX).
*Status:* Final.

---

## Phase 4 — State Machine & Lifecycle

### [#29 — Case lifecycle states](./05-state-machine/ADR-0029-case-lifecycle-states.md)
*Individual ADR: [`ADR-0029`](./05-state-machine/ADR-0029-case-lifecycle-states.md)*
*Context:* Needed the canonical state machine for a case's life.
*Decision:* `intake → under_review → (escalated | resolved)`, with `resolved` further distinguishing sub-outcomes recorded via `case_decisions`, not via additional `case_status` enum values.
*Rationale:* Keeps the status enum small and stable; nuanced outcomes belong in the insert-only decisions table where they're naturally auditable.
*Alternatives rejected:* Encoding every possible outcome as its own enum value (enum bloat, migration churn every time a new outcome type is needed).
*Status:* Final.

### [#30 — Finding lifecycle states](./05-state-machine/ADR-0030-finding-lifecycle-states.md)
*Individual ADR: [`ADR-0030`](./05-state-machine/ADR-0030-finding-lifecycle-states.md)*
*Context:* Needed states for an individual finding independent of its parent case.
*Decision:* `open → (acknowledged) → closed`, where "closed" always carries a reference to the `case_decisions` row (or specific disposition) that closed it.
*Rationale:* A case cannot move to `resolved` while any finding remains `open` — enforced in both `state_machine.ts` (frontend simulation) and the equivalent backend/DB logic, per the MVP plan's #79.
*Alternatives rejected:* Allowing case resolution with open findings (would contradict the "evidence-before-conclusion" design principle).
*Status:* Final.

### [#31 — Document lifecycle states](./05-state-machine/ADR-0031-document-lifecycle-states.md)
*Individual ADR: [`ADR-0031`](./05-state-machine/ADR-0031-document-lifecycle-states.md)*
*Context:* Uploaded documents go through integrity checking and extraction before becoming usable evidence.
*Decision:* `document_status` enum: `uploaded → scanning → (clean | quarantined | scan_failed) → extracting → extracted`, where only `clean` documents proceed to extraction.
*Rationale:* Makes malware/integrity failure a first-class, queryable state rather than a side-channel error log, and prevents extraction from ever running against an unscanned or failed file.
*Alternatives rejected:* Binary clean/unclean flag only (loses visibility into *why* a document is stuck, and loses the distinct "scan in progress" window).
*Status:* Final.

### [#32 — Extraction promotion gate](./05-state-machine/ADR-0032-extraction-promotion-gate.md)
*Individual ADR: [`ADR-0032`](./05-state-machine/ADR-0032-extraction-promotion-gate.md)*
*Context:* Extracted fields are machine output and should not silently become "evidence" without a deliberate step.
*Decision:* `extracted_fields` rows are insert-only and carry a nullable `promoted_to_evidence_id`; only an explicit promotion action (human-reviewed or rule-gated) sets this FK, at which point a corresponding `evidence` row exists.
*Rationale:* Keeps the "evidence" concept trustworthy — every evidence row backed by extraction has a traceable, deliberate promotion step, not an automatic pass-through.
*Alternatives rejected:* Auto-promoting all extracted fields directly to evidence (undermines the evidence-trustworthiness guarantee the whole product is built on).
*Status:* Final.

### [#33 — Screening match disposition as append-only history](./05-state-machine/ADR-0033-screening-match-disposition-as-append-only-history.md)
*Individual ADR: [`ADR-0033`](./05-state-machine/ADR-0033-screening-match-disposition-as-append-only-history.md)*
*Context:* A screening match (e.g., a watchlist hit) may be reviewed multiple times as new context arrives.
*Decision:* `match_dispositions` is insert-only/append-style — each review action adds a new disposition row rather than overwriting the previous one; current state is "the latest disposition for a match," derived by query, not stored denormalized.
*Rationale:* Preserves full history of how a screening match was reasoned about over time, consistent with #16's audit principle.
*Alternatives rejected:* Single mutable `current_disposition` column on `screening_matches` (loses the reasoning history).
*Status:* Final.

### [#34 — Erasure request state machine](./05-state-machine/ADR-0034-erasure-request-state-machine.md)
*Individual ADR: [`ADR-0034`](./05-state-machine/ADR-0034-erasure-request-state-machine.md)*
*Context:* GDPR/PDPA erasure needs a controlled, auditable workflow rather than an immediate action.
*Decision:* `erasure_requests.status` progresses `pending → (key_destroyed | rejected)`; the transition itself is the mechanism that performs DEK destruction per #14 — there is no separate "destroy key" side effect decoupled from the status update.
*Rationale:* Making the state transition *be* the destructive action (not a side effect triggered elsewhere) means the audit trail and the actual data-destruction event can never drift out of sync.
*Alternatives rejected:* A separate background job that destroys keys after a request is marked approved (introduces a window where state and reality can diverge, e.g., if the job fails silently).
*Status:* Final.

### [#35 — Model run status is implicit, not enumerated](./05-state-machine/ADR-0035-model-run-status-is-implicit-not-enumerated.md)
*Individual ADR: [`ADR-0035`](./05-state-machine/ADR-0035-model-run-status-is-implicit-not-enumerated.md)*
*Context:* Deciding whether `model_runs` needs its own status lifecycle.
*Decision:* `model_runs` has no status enum — a row's mere existence represents a completed run (success or logged failure via an `error` field); there is no "pending model run" row.
*Rationale:* Model invocations are synchronous-enough request/response operations in this architecture (LLM call or Inference Service call) that an in-flight state isn't meaningfully observable at the row level; keeping the table purely append-of-completed-runs is simpler.
*Alternatives rejected:* Full status enum mirroring document/extraction lifecycles (unnecessary complexity for an operation that's fundamentally request/response).
*Status:* Final.

---

## Phase 5 — API Contracts

### [#36 — API style: REST over OpenAPI, no GraphQL](./06-api-contracts/ADR-0036-api-style-rest-over-openapi-no-graphql.md)
*Individual ADR: [`ADR-0036`](./06-api-contracts/ADR-0036-api-style-rest-over-openapi-no-graphql.md)*
*Context:* Needed to choose an API paradigm for `apps/api`.
*Decision:* REST/JSON over FastAPI's auto-generated OpenAPI schema; no GraphQL layer.
*Rationale:* The domain's access patterns are resource-oriented (cases, findings, documents) rather than deeply nested/client-driven-shape queries; FastAPI's OpenAPI generation gives typed-client generation "for free" without a separate GraphQL server to operate.
*Alternatives rejected:* GraphQL (added server complexity and a second query language, without a corresponding need for flexible client-shaped queries at this stage).
*Status:* Final.

### [#37 — Versioning strategy](./06-api-contracts/ADR-0037-versioning-strategy.md)
*Individual ADR: [`ADR-0037`](./06-api-contracts/ADR-0037-versioning-strategy.md)*
*Context:* Needed a forward-compatible API versioning approach.
*Decision:* URL-path versioning (`/v1/...`), additive-only changes preferred within a version; breaking changes require a new version prefix.
*Rationale:* Simplest to reason about for both server routing and generated client code; avoids header-based versioning's extra indirection for a product at this stage of maturity.
*Alternatives rejected:* Header-based versioning (adds indirection with no current multi-version-concurrently need).
*Status:* Final.

### [#38 — Pagination: cursor-based, not offset](./06-api-contracts/ADR-0038-pagination-cursor-based-not-offset.md)
*Individual ADR: [`ADR-0038`](./06-api-contracts/ADR-0038-pagination-cursor-based-not-offset.md)*
*Context:* Case queues and audit event listings can grow large and are frequently filtered/sorted.
*Decision:* Cursor-based (keyset) pagination on all list endpoints, using the UUIDv7 PK's time-ordering property (#15) as the natural cursor basis.
*Rationale:* Avoids the performance degradation and page-drift correctness issues of offset pagination on large, frequently-mutating tables.
*Alternatives rejected:* Offset/limit pagination (degrades at scale, suffers from page-drift when rows are inserted between page requests).
*Status:* Final.

### [#39 — Idempotency for mutating endpoints](./06-api-contracts/ADR-0039-idempotency-for-mutating-endpoints.md)
*Individual ADR: [`ADR-0039`](./06-api-contracts/ADR-0039-idempotency-for-mutating-endpoints.md)*
*Context:* Decision-recording and document-upload endpoints must be safe to retry (client timeouts, network blips).
*Decision:* Mutating endpoints accept an `Idempotency-Key` header, checked/stored against the `idempotency:*` Redis namespace (#26) with a bounded TTL.
*Rationale:* Prevents duplicate case decisions or duplicate document records from naive client retries, without requiring durable idempotency storage for a short-lived concern.
*Alternatives rejected:* No idempotency handling (risks duplicate state-changing side effects on retry); durable idempotency table (overkill given Redis's bounded-TTL semantics suffice here).
*Status:* Final.

### [#40 — Error shape](./06-api-contracts/ADR-0040-error-shape.md)
*Individual ADR: [`ADR-0040`](./06-api-contracts/ADR-0040-error-shape.md)*
*Context:* Needed one consistent error response contract across all endpoints.
*Decision:* RFC 7807-style `problem+json` error bodies (`type`, `title`, `status`, `detail`, `instance`), with domain-specific `type` URIs for validation vs. state-machine-violation vs. authorization errors.
*Rationale:* Standard, machine-parseable shape that the frontend can branch on reliably (e.g., distinguishing "invalid finding transition" from "not authorized").
*Alternatives rejected:* Ad hoc per-endpoint error shapes (inconsistent client handling, harder to document).
*Status:* Final.

### [#41 — Server-Sent Events for narrative streaming](./06-api-contracts/ADR-0041-server-sent-events-for-narrative-streaming.md)
*Individual ADR: [`ADR-0041`](./06-api-contracts/ADR-0041-server-sent-events-for-narrative-streaming.md)*
*Context:* The AI-generated case narrative needs to stream to the UI as it's produced.
*Decision:* **SSE** (not WebSockets) for narrative streaming, given it's a one-directional server→client stream with no need for bidirectional messaging.
*Rationale:* SSE is simpler to operate (plain HTTP, works through standard proxies/load balancers) and is the right-sized tool for a one-way stream; WebSockets would add protocol complexity unused by any other feature.
*Alternatives rejected:* WebSockets (bidirectional capability not needed anywhere else in the product, added complexity for no benefit here).
*Status:* Final.

### [#42 — Bulk operations deferred](./06-api-contracts/ADR-0042-bulk-operations-deferred.md)
*Individual ADR: [`ADR-0042`](./06-api-contracts/ADR-0042-bulk-operations-deferred.md)*
*Context:* Considered whether to support bulk case/finding operations (e.g., bulk-close) in v1's API contract.
*Decision:* No bulk endpoints in v1; all mutations are single-resource. Revisit only if real investigator workflow data shows a bulk-action need.
*Rationale:* Avoids building speculative bulk-mutation semantics (including the audit-trail implications of "who decided what" across N rows at once) before a concrete need is observed.
*Alternatives rejected:* Building bulk endpoints preemptively (speculative, complicates the insert-only audit model's per-action attribution).
*Status:* Final (subject to revisit).

### [#43 — Authentication: Supabase-issued JWT, verified at the API](./06-api-contracts/ADR-0043-authentication-supabase-issued-jwt-verified-at-the-api.md)
*Individual ADR: [`ADR-0043`](./06-api-contracts/ADR-0043-authentication-supabase-issued-jwt-verified-at-the-api.md)*
*Context:* Needed an auth mechanism consistent with the Supabase-backed persistence choice.
*Decision:* Supabase Auth issues JWTs; FastAPI verifies them independently (not merely trusting Supabase's RLS alone) and maps the verified subject to `platform.users` for role-based authorization.
*Rationale:* Defense in depth — RLS protects the data layer, but the API layer should not assume every caller is a correctly-scoped Supabase client; independent verification closes that gap.
*Alternatives rejected:* Relying on RLS alone without API-layer verification (leaves a gap if a request path bypasses the expected Supabase client context).
*Status:* Final.

### [#44 — Rate limiting at the API layer](./06-api-contracts/ADR-0044-rate-limiting-at-the-api-layer.md)
*Individual ADR: [`ADR-0044`](./06-api-contracts/ADR-0044-rate-limiting-at-the-api-layer.md)*
*Context:* Needed to bound abuse/runaway-client risk, especially around login and search endpoints.
*Decision:* Token-bucket rate limiting backed by the `ratelimit:*` Redis namespace (#26), applied per-user and per-IP, with stricter limits on `loginattempts:*`-tracked authentication endpoints.
*Rationale:* Matches the existing ephemeral-Redis design (#26); prevents brute-force and scraping patterns without introducing a new infrastructure dependency.
*Alternatives rejected:* Rate limiting at the CDN/edge only (insufficient granularity for per-user, authenticated-endpoint limits).
*Status:* Final.

### [#45 — Typed client generation for the frontend](./06-api-contracts/ADR-0045-typed-client-generation-for-the-frontend.md)
*Individual ADR: [`ADR-0045`](./06-api-contracts/ADR-0045-typed-client-generation-for-the-frontend.md)*
*Context:* Needed to keep frontend request/response types in sync with the backend contract without manual duplication.
*Decision:* TypeScript types in `packages/shared-types` are generated from (or kept strictly aligned with) the FastAPI OpenAPI schema, consumed by `apps/web`'s `api-client.ts`.
*Rationale:* Reduces drift between backend contract changes and frontend expectations; keeps the single swappable boundary (the MVP plan's #78) type-safe.
*Alternatives rejected:* Hand-maintained, independently-authored frontend types (drift risk every time the API contract changes).
*Status:* Final.

---

## Phase 6 — Security & Compliance

### [#46 — Row-Level Security as the primary tenant isolation mechanism](./07-security-compliance/ADR-0046-row-level-security-as-the-primary-tenant-isolation-mechanism.md)
*Individual ADR: [`ADR-0046`](./07-security-compliance/ADR-0046-row-level-security-as-the-primary-tenant-isolation-mechanism.md)*
*Context:* Restates and anchors #6 at the security-review layer.
*Decision:* Every tenant-scoped table has an RLS policy keyed on `tenant_id = current_setting('app.tenant_id')`, set per-request from the verified JWT (#43); no table relies on application-layer filtering alone for tenant isolation.
*Rationale:* Database-enforced isolation survives application bugs that might otherwise leak cross-tenant data via a missed `WHERE tenant_id = ...` clause.
*Alternatives rejected:* Application-layer-only tenant filtering (a single missed filter is a cross-tenant data leak).
*Status:* Final.

### [#47 — Secrets management](./07-security-compliance/ADR-0047-secrets-management.md)
*Individual ADR: [`ADR-0047`](./07-security-compliance/ADR-0047-secrets-management.md)*
*Context:* Needed a consistent approach to secrets across local dev, CI, and the three GitHub Environments.
*Decision:* GitHub Environment secrets for CI/CD-time values; environment-injected secrets (not baked into images) at runtime; local dev uses a `.env.local` (gitignored) seeded from a committed `.env.example`.
*Rationale:* Standard separation of concerns; prevents secrets from ever being baked into a built artifact or committed to version control.
*Alternatives rejected:* A dedicated secrets-manager service (Vault, AWS Secrets Manager) — deferred as disproportionate to current operational scale; GitHub Environments' native secret scoping is sufficient for now.
*Status:* Final (subject to revisit if compliance requirements demand a dedicated secrets manager).
*(Cross-reference: INFRA_DEPLOYMENT.md, 3 GitHub Environments.)*

### [#48 — Audit event immutability enforcement](./07-security-compliance/ADR-0048-audit-event-immutability-enforcement.md)
*Individual ADR: [`ADR-0048`](./07-security-compliance/ADR-0048-audit-event-immutability-enforcement.md)*
*Context:* Restates #12 at the security-review layer — needed to confirm the immutability isn't just convention.
*Decision:* `audit_events` has no `UPDATE`/`DELETE` grants for any application role; only `INSERT` is grantable, enforced at the Postgres GRANT level, not merely assumed from table design.
*Rationale:* Table-design insert-only conventions alone can be bypassed by a bug or a careless migration; GRANT-level enforcement makes it a database-level guarantee.
*Alternatives rejected:* Relying on application code discipline alone (not tamper-resistant against bugs or a compromised application credential).
*Status:* Final.

### [#49 — Encryption key management for crypto-shredding](./07-security-compliance/ADR-0049-encryption-key-management-for-crypto-shredding.md)
*Individual ADR: [`ADR-0049`](./07-security-compliance/ADR-0049-encryption-key-management-for-crypto-shredding.md)*
*Context:* #14's crypto-shredding design needs a concrete key-management approach.
*Decision:* Per-subject DEKs are themselves encrypted by a tenant-level Key Encryption Key (KEK) managed outside the primary database (cloud KMS); destroying a DEK means deleting its KMS-held key material, which renders the corresponding ciphertext permanently unrecoverable.
*Rationale:* Keeps the actual destructive operation (KMS key deletion) outside the application database, making the crypto-shred irreversible by design rather than by policy.
*Alternatives rejected:* Storing DEKs encrypted-at-rest in the same database (destruction then depends on database-level delete discipline rather than an independent, irreversible KMS action).
*Status:* Final.

### [#50 — Input validation and file-upload safety](./07-security-compliance/ADR-0050-input-validation-and-file-upload-safety.md)
*Individual ADR: [`ADR-0050`](./07-security-compliance/ADR-0050-input-validation-and-file-upload-safety.md)*
*Context:* Document intake is the highest-risk ingress point (arbitrary file upload).
*Decision:* All uploads pass through antivirus/integrity scanning (`document_integrity_checks`, #31) before extraction; file type is validated by content-sniffing, not just extension/MIME header; uploads are size- and type-bounded at the API layer before ever reaching storage.
*Rationale:* Defense in depth against malicious uploads masquerading as legitimate document types.
*Alternatives rejected:* Trusting client-provided MIME type/extension alone (trivially spoofable).
*Status:* Final.

### [#51 — CSRF protection scope](./07-security-compliance/ADR-0051-csrf-protection-scope.md)
*Individual ADR: [`ADR-0051`](./07-security-compliance/ADR-0051-csrf-protection-scope.md)*
*Context:* Needed to decide where CSRF protection applies given the API is consumed by a same-origin-ish but Cloudflare-Pages-hosted frontend.
*Decision:* Double-submit CSRF token pattern backed by the `csrf:*` Redis namespace (#26), applied to all cookie-authenticated state-changing requests; bearer-JWT-only API clients (future integrations) are exempt since CSRF doesn't apply to non-cookie auth.
*Rationale:* Targets protection at the actual attack surface (cookie-based session riding) without over-applying it to token-bearer API consumers where it provides no benefit.
*Alternatives rejected:* Applying CSRF tokens uniformly regardless of auth mechanism (unnecessary friction for bearer-token clients).
*Status:* Final.

### [#52 — Login brute-force handling](./07-security-compliance/ADR-0052-login-brute-force-handling.md)
*Individual ADR: [`ADR-0052`](./07-security-compliance/ADR-0052-login-brute-force-handling.md)*
*Context:* Flagged earlier as not yet a standalone numbered decision; formalized here.
*Decision:* Progressive cooldown on repeated failed logins per account, tracked via the `loginattempts:*` Redis namespace (#26) — e.g., exponential backoff after each consecutive failure, resetting on success, bounded by a maximum lockout window rather than a permanent lock.
*Rationale:* Progressive cooldown slows automated brute-force attempts without permanently locking out a legitimate user who mistyped a password a few times.
*Alternatives rejected:* Hard account lockout after N failures requiring manual/admin unlock (creates support burden and a denial-of-service vector against legitimate users).
*Status:* Final. *(Resolves the previously "pending/deferred" login-brute-force item noted in earlier sessions.)*

### [#53 — Data residency / region pinning](./07-security-compliance/ADR-0053-data-residency-region-pinning.md)
*Individual ADR: [`ADR-0053`](./07-security-compliance/ADR-0053-data-residency-region-pinning.md)*
*Context:* Compliance data for certain jurisdictions may carry residency requirements.
*Decision:* Explicitly deferred — v1 operates a single-region deployment (per INFRA_DEPLOYMENT.md); multi-region/residency pinning is not designed until a specific jurisdiction's requirement is confirmed.
*Rationale:* Avoids speculative multi-region architecture before a concrete regulatory trigger exists; this is a genuine judgment call flagged for future revisit rather than resolved unilaterally.
*Alternatives rejected:* Building multi-region data residency controls now (substantial complexity with no current confirmed requirement).
*Status:* Provisional / explicitly deferred.

### [#54 — Secrets/PII never logged](./07-security-compliance/ADR-0054-secrets-pii-never-logged.md)
*Individual ADR: [`ADR-0054`](./07-security-compliance/ADR-0054-secrets-pii-never-logged.md)*
*Context:* Observability tooling (OTel) must not leak sensitive data into traces/logs.
*Decision:* Structured logging and OTel spans are scrubbed of encrypted-field plaintext, tokens, and secrets via a shared redaction middleware applied before any log/trace exporter.
*Rationale:* Prevents the observability pipeline from becoming an unintended data-exposure channel.
*Alternatives rejected:* Trusting per-call-site discipline to avoid logging sensitive fields (error-prone, no structural guarantee).
*Status:* Final.

### [#55 — Dependency and container scanning](./07-security-compliance/ADR-0055-dependency-and-container-scanning.md)
*Individual ADR: [`ADR-0055`](./07-security-compliance/ADR-0055-dependency-and-container-scanning.md)*
*Context:* Needed a consistent supply-chain security check in CI.
*Decision:* GitHub Actions CI includes automated dependency vulnerability scanning (e.g., `pnpm audit` / `pip-audit` equivalents) and container image scanning as a required, non-bypassable CI step for the two Docker Compose stacks' images.
*Rationale:* Catches known-vulnerable dependencies and base images before they reach any deployed environment.
*Alternatives rejected:* Manual/periodic scanning only (misses vulnerabilities introduced between manual audit cycles).
*Status:* Final.

---

## Phase 7 — Frontend & UI Architecture

### [#56 — Framework and core libraries](./08-frontend-ui/ADR-0056-framework-and-core-libraries.md)
*Individual ADR: [`ADR-0056`](./08-frontend-ui/ADR-0056-framework-and-core-libraries.md)*
*Context:* Needed the frontend's foundational stack.
*Decision:* Next.js + TypeScript + Tailwind CSS + shadcn/ui components + Zustand (client state) + React Query (server state/caching) + Framer Motion (motion, scoped per DESIGN.md §6).
*Rationale:* This combination gives strong typing, a component system that's customizable rather than black-box, clean separation of server-cache state (React Query) from UI-only state (Zustand), and a motion library capable of the restrained, purposeful animation DESIGN.md calls for.
*Alternatives rejected:* Redux (more boilerplate than needed given React Query already owns server state); CSS-in-JS runtime libraries (Tailwind's build-time approach preferred for performance).
*Status:* Final.

### [#57 — PWA layer: Serwist, not vite-pwa](./08-frontend-ui/ADR-0057-pwa-layer-serwist-not-vite-pwa.md)
*Individual ADR: [`ADR-0057`](./08-frontend-ui/ADR-0057-pwa-layer-serwist-not-vite-pwa.md)*
*Context:* Needed an offline/installable-app capability compatible with Next.js (not a Vite-based project).
*Decision:* **Serwist** for service-worker/PWA tooling.
*Rationale:* vite-pwa is Vite-specific and inapplicable to a Next.js build pipeline; Serwist is the maintained, Next.js-compatible successor in this space.
*Alternatives rejected:* vite-pwa (wrong build tool entirely); next-pwa (less actively maintained at time of decision).
*Status:* Final.

### [#58 — Theming: next-themes](./08-frontend-ui/ADR-0058-theming-next-themes.md)
*Individual ADR: [`ADR-0058`](./08-frontend-ui/ADR-0058-theming-next-themes.md)*
*Context:* Needed light/dark mode support consistent with DESIGN.md §7's independently-tuned per-mode tokens (e.g., `--finding-indicator`, `--escalated`).
*Decision:* `next-themes` for theme state and persistence, driving the CSS custom-property tokens defined in DESIGN.md §2.
*Rationale:* Lightweight, SSR-safe theme switching with no flash-of-wrong-theme, and straightforward integration with CSS-variable-driven design tokens.
*Alternatives rejected:* Hand-rolled theme context (reinvents SSR-safety handling next-themes already solves).
*Status:* Final.

### [#59 — Hosting: Cloudflare Pages + Workers](./08-frontend-ui/ADR-0059-hosting-cloudflare-pages-workers.md)
*Individual ADR: [`ADR-0059`](./08-frontend-ui/ADR-0059-hosting-cloudflare-pages-workers.md)*
*Context:* Needed a frontend hosting target consistent with the rest of the Cloudflare-based edge strategy (R2 for storage).
*Decision:* **Cloudflare Pages** for the Next.js app's static/SSR hosting, with **Cloudflare Workers** providing edge functions where needed (e.g., auth redirects, lightweight middleware) — and, per Decision #71, an optional later-stage narrow fast-path for a small CPU-only ONNX sub-model, never the GPU Inference Service itself.
*Rationale:* Keeps frontend hosting on the same edge network as object storage (R2), minimizing cross-provider latency for asset delivery; Workers' edge-function model fits lightweight middleware well.
*Alternatives rejected:* Vercel (viable alternative, but duplicates infrastructure providers unnecessarily alongside the already-chosen Cloudflare R2/Workers stack).
*Status:* Final (Workers' role narrowed by #71).

### [#60 — Design principles (priority-ordered)](./08-frontend-ui/ADR-0060-design-principles-priority-ordered.md)
*Individual ADR: [`ADR-0060`](./08-frontend-ui/ADR-0060-design-principles-priority-ordered.md)*
*Context:* Needed a small, prioritized set of principles to arbitrate UI/UX tradeoffs consistently.
*Decision:* Four principles, in priority order: (1) evidence-before-conclusion, (2) ≤3-clicks-from-queue-to-decision, (3) calm-not-alarming, (4) dense-but-legible.
*Rationale:* A priority order resolves conflicts between principles without re-litigating each tradeoff (e.g., if density and calmness conflict on a given screen, calmness is not ranked above density arbitrarily — the order was fixed in advance precisely to avoid ad hoc re-ranking).
*Alternatives rejected:* An unordered list of principles (leaves every conflict between them unresolved at decision time).
*Status:* Final.

### [#61 — Color semantics: amber for findings, not red](./08-frontend-ui/ADR-0061-color-semantics-amber-for-findings-not-red.md)
*Individual ADR: [`ADR-0061`](./08-frontend-ui/ADR-0061-color-semantics-amber-for-findings-not-red.md)*
*Context:* Needed to decide how to visually signal a "finding" (something worth a human look) without implying an automated risk verdict.
*Decision:* `--finding-indicator` uses a deliberately **amber**, not red, hue (`#B45309` light / `#D89B4A` dark); a separate, more muted `--escalated` brick tone is reserved for case-level escalation only, also deliberately not pure red.
*Rationale:* Red is conventionally "alarm/danger/automated-verdict" — using it for findings would contradict #2's non-goal of implying an automated risk judgment. Amber signals "needs attention" without that implication.
*Alternatives rejected:* Standard red/green risk-indicator convention (directly undermines the product's core framing as a non-scoring, evidence-presenting tool).
*Status:* Final. *(All palette tokens WCAG 2.1 AA contrast-verified in both light and dark themes.)*

### [#62 — Typography: Inter + IBM Plex Mono, purposefully split](./08-frontend-ui/ADR-0062-typography-inter-ibm-plex-mono-purposefully-split.md)
*Individual ADR: [`ADR-0062`](./08-frontend-ui/ADR-0062-typography-inter-ibm-plex-mono-purposefully-split.md)*
*Context:* Needed to visually distinguish AI-generated narrative text from verbatim quoted source evidence.
*Decision:* **Inter** for all UI chrome and generated narrative body text (with tabular figures for numeric data); **IBM Plex Mono** exclusively for evidence/document excerpts — i.e., any text that is a direct quotation from a source document.
*Rationale:* A consistent typographic split lets an investigator distinguish "the system is saying this" from "the document literally says this" at a glance, without reading a label — reinforcing evidence-before-conclusion (#60) typographically.
*Alternatives rejected:* Single typeface throughout with only color/weight differentiation (weaker, more easily overlooked distinction than a full typeface change).
*Status:* Final.

### [#63 — Motion: scoped to panel transitions, one deliberate exception](./08-frontend-ui/ADR-0063-motion-scoped-to-panel-transitions-one-deliberate-exception.md)
*Individual ADR: [`ADR-0063`](./08-frontend-ui/ADR-0063-motion-scoped-to-panel-transitions-one-deliberate-exception.md)*
*Context:* Needed to decide how liberally Framer Motion should be used.
*Decision:* Motion is scoped to panel/layout transitions only, and is explicitly **never** used to animate the arrival of data (findings, evidence, decisions) — with one deliberate exception: the narrative stream's sentence-by-sentence typing-cadence animation, kept specifically to signal "this is AI-drafted and still completing, verify as it finishes."
*Rationale:* Animating data arrival risks implying liveliness/urgency the calm-not-alarming principle (#60) prohibits; the one exception is kept because it serves a distinct, deliberate communicative purpose (incompleteness/draft status) rather than decoration.
*Alternatives rejected:* Liberal use of entrance/exit animations on data updates (conflicts with calm-not-alarming); zero motion anywhere including the narrative stream (loses the useful "still drafting" signal).
*Status:* Final.

---

## Phase 8 — Infrastructure & Deployment

### [#64 — Monorepo tooling: Turborepo + pnpm](./09-infrastructure-hosting/ADR-0064-monorepo-tooling-turborepo-pnpm.md)
*Individual ADR: [`ADR-0064`](./09-infrastructure-hosting/ADR-0064-monorepo-tooling-turborepo-pnpm.md)*
*Context:* Needed build/task orchestration across `apps/web`, `apps/api`, and shared packages.
*Decision:* Turborepo for task graph/caching, pnpm for package management and workspaces.
*Rationale:* pnpm's strict, content-addressed node_modules avoids phantom dependency bugs; Turborepo's remote caching and task graph fit the multi-app/multi-package structure without needing a heavier tool (Nx) for the current package count.
*Alternatives rejected:* npm/yarn workspaces without a task orchestrator (no build caching, slower CI); Nx (more powerful than needed at current scale).
*Status:* Final.

### [#65 — Testing stack: Vitest + pytest + Playwright](./09-infrastructure-hosting/ADR-0065-testing-stack-vitest-pytest-playwright.md)
*Individual ADR: [`ADR-0065`](./09-infrastructure-hosting/ADR-0065-testing-stack-vitest-pytest-playwright.md)*
*Context:* Needed unit/integration/e2e testing tools across a TypeScript frontend and Python backend.
*Decision:* **Vitest** for frontend unit/component tests, **pytest** for backend unit/integration tests, **Playwright** for end-to-end browser tests.
*Rationale:* Vitest's native ESM/Vite-aligned speed suits the Next.js frontend; pytest is the Python ecosystem standard; Playwright's multi-browser support and trace-viewer tooling fit the e2e needs of a document-heavy UI.
*Alternatives rejected:* Jest (slower, more configuration overhead than Vitest for this stack); Cypress (narrower browser-engine support than Playwright).
*Status:* Final.

### [#66 — API hosting: AWS ECS Fargate](./09-infrastructure-hosting/ADR-0066-api-hosting-aws-ecs-fargate.md)
*Individual ADR: [`ADR-0066`](./09-infrastructure-hosting/ADR-0066-api-hosting-aws-ecs-fargate.md)*
*Context:* Needed a production hosting target for `apps/api` (FastAPI) that didn't require managing raw EC2 instances for the baseline, non-GPU workload.
*Decision:* **AWS ECS on Fargate**, ≥2 tasks behind an Application Load Balancer, for the API service.
*Rationale:* Fargate removes instance-management overhead for a workload with no GPU requirement; ECS integrates cleanly with the existing AWS account/OIDC trust relationship used elsewhere in the deployment pipeline.
*Alternatives rejected:* Raw EC2 (unnecessary instance-management burden for a stateless container workload); Lambda (poor fit for a persistent ASGI/WebSocket-adjacent SSE-streaming process).
*Status:* Final. *(Extended, not replaced, by Decision #72 for GPU workloads — API remains on Fargate; only the Inference Service moves to an EC2 GPU capacity provider in the same cluster.)*

### [#67 — CI/CD: GitHub Actions, 3 Environments, OIDC (no long-lived cloud credentials)](./09-infrastructure-hosting/ADR-0067-ci-cd-github-actions-3-environments-oidc-no-long-lived-cloud-credentials.md)
*Individual ADR: [`ADR-0067`](./09-infrastructure-hosting/ADR-0067-ci-cd-github-actions-3-environments-oidc-no-long-lived-cloud-credentials.md)*
*Context:* Needed a CI/CD pipeline and deployment credential strategy.
*Decision:* GitHub Actions workflows gated by three GitHub Environments (e.g., development/staging/production), deploying to AWS via **OIDC federation** (no long-lived AWS access keys stored as GitHub secrets).
*Rationale:* OIDC federation eliminates the risk and rotation burden of long-lived cloud credentials sitting in CI secrets; environment gating allows required-reviewer protection on production deploys.
*Alternatives rejected:* Long-lived IAM access keys as GitHub secrets (standing credential-leak risk, manual rotation burden).
*Status:* Final.

### [#68 — Local development: dual Docker Compose stacks](./09-infrastructure-hosting/ADR-0068-local-development-dual-docker-compose-stacks.md)
*Individual ADR: [`ADR-0068`](./09-infrastructure-hosting/ADR-0068-local-development-dual-docker-compose-stacks.md)*
*Context:* Needed a reproducible local dev environment distinct from the production topology, without requiring every contributor to have cloud access.
*Decision:* Two Docker Compose stacks — `docker-compose.dev.yml` (hot-reload, local Postgres/Neo4j/Redis containers, MailHog) and `docker-compose.prod.yml` (production-shaped image build/test, no hot-reload) — kept as separate files rather than one Compose file with profile flags.
*Rationale:* Separate files make the dev-vs-prod-shaped distinction unambiguous at a glance and avoid profile-flag conditional logic creeping into a single shared file.
*Alternatives rejected:* Single Compose file with Docker Compose "profiles" (workable, but blurs the dev/prod distinction and risks accidental cross-contamination of settings).
*Status:* Final. *(Note: superseded in scope — not in correctness — by the MVP Simulation Build in Phase 9, which explicitly runs without Docker; this decision remains the standard for the full-architecture build path.)*

---

## Phase 8 (Addendum) — Custom Model Hosting

> This addendum resolves the user's custom-trained-model hosting proposal
> (originally: Render free tier for weights + agents, Cloudflare Workers for
> "background"/backend deploy, AWS reserved for future), critiqued and
> revised after the user's correction that the model is **GPU-requiring**
> (not a lightweight CPU model) and that "background deploy" meant
> **"backend deploy."**

### [#69 — Custom model inference as a separate container/service](./09-infrastructure-hosting/ADR-0069-custom-model-inference-as-a-separate-container-service.md)
*Individual ADR: [`ADR-0069`](./09-infrastructure-hosting/ADR-0069-custom-model-inference-as-a-separate-container-service.md)*
*Context:* The custom-trained model is distinct from the vendor-LLM abstraction (#13's `model_runs` / `LLMClient`) and needed its own architectural seam.
*Decision:* A dedicated **Inference Service** container, consumed via `model_runs.model_task_type`, kept fully separate from the `LLMClient` vendor-LLM path.
*Rationale:* The custom model has an entirely different runtime profile (GPU-requiring, weight-loading-at-boot) from a vendor LLM API call; conflating the two abstractions would force the simpler `LLMClient` interface to carry GPU/hosting concerns it shouldn't need to know about.
*Alternatives rejected:* Embedding custom-model inference inside the existing API process (couples an entirely different scaling/hardware profile to the stateless API tier).
*Status:* Final. *(Originally logged provisional-CPU; confirmed GPU-requiring by user correction — see #70.)*

### [#70 — Demo/evaluation hosting: Hugging Face Spaces + ZeroGPU (revised)](./09-infrastructure-hosting/ADR-0070-demo-evaluation-hosting-hugging-face-spaces-zerogpu-revised.md)
*Individual ADR: [`ADR-0070`](./09-infrastructure-hosting/ADR-0070-demo-evaluation-hosting-hugging-face-spaces-zerogpu-revised.md)*
*Context:* The user's original proposal was Render's free tier for the model weights and agents. After confirming the model is GPU-requiring, Render's free/Hobby tier was re-evaluated and found non-viable in any form.
*Decision:* **Render free tier is rejected entirely** for the Inference Service. Replacement for demo/evaluation hosting: **Hugging Face Spaces with ZeroGPU** — free, GPU-backed per-call allocation, reachable as an HTTP API, with up to two free ZeroGPU Spaces available per account.
*Rationale:* Render's free web-service instance is 512MB RAM / 0.1 CPU with no GPU variant in any free/Hobby tier, no background-worker instance type at all, a non-persistent filesystem, and Render's own Terms of Service state free instances should not be used for production. HF Spaces' ZeroGPU directly solves the "need an actual GPU, for free, reachable over HTTP" requirement that Render structurally cannot.
*Alternatives rejected:* Render free tier in any configuration (no GPU tier exists even before the correction's impact; post-correction it is even less viable); a paid Render GPU-capable tier (reintroduces cost the user's proposal was explicitly trying to avoid at the demo stage).
*Status:* Final (revised from an earlier CPU-only provisional form of this decision).

### [#71 — Cloudflare Workers rejected as backend/Inference host (revised)](./09-infrastructure-hosting/ADR-0071-cloudflare-workers-rejected-as-backend-inference-host-revised.md)
*Individual ADR: [`ADR-0071`](./09-infrastructure-hosting/ADR-0071-cloudflare-workers-rejected-as-backend-inference-host-revised.md)*
*Context:* The user's "background deploy on Cloudflare Workers" was clarified as a typo for "backend deploy" — raising the question of whether Workers could host the FastAPI backend and/or the GPU Inference Service.
*Decision:* **Cloudflare Workers is rejected** as a host for either the FastAPI backend or the GPU Inference Service, under any reading of "background" vs. "backend." Workers' role is unchanged from the pre-existing architecture: frontend hosting (Pages/Workers, #59) plus an optional, later-stage narrow fast-path for a small CPU-only ONNX-exportable sub-model — never the GPU model itself.
*Rationale:* The Workers runtime is a stateless, request-scoped V8 isolate with a 128MB hard memory ceiling and a bounded CPU-time budget — structurally incapable of hosting a persistent ASGI process, let alone a GPU-requiring one; Workers CPU execution is WebAssembly-only (no CUDA/WebGPU path exists). Workers AI itself doesn't support arbitrary custom full model weights — only a curated catalog plus a narrow BYO-LoRA path (four base models, 100MB adapter cap, max rank 8) that doesn't fit a general custom-trained model.
*Alternatives rejected:* Attempting to fit the custom model into Workers AI's BYO-LoRA path (too narrow — wrong base models, wrong capability, not a general hosting solution); using Workers purely as a reverse proxy in front of a GPU host elsewhere (adds a hop with no benefit over the frontend calling the Inference Service directly).
*Status:* Final (revised; conclusion unchanged by the background/backend correction, but the reasoning was re-verified against the GPU requirement specifically).

### [#72 — Production GPU hosting: ECS mixed-capacity-provider cluster, not SageMaker (revised)](./09-infrastructure-hosting/ADR-0072-production-gpu-hosting-ecs-mixed-capacity-provider-cluster-not-sagemaker-revised.md)
*Individual ADR: [`ADR-0072`](./09-infrastructure-hosting/ADR-0072-production-gpu-hosting-ecs-mixed-capacity-provider-cluster-not-sagemaker-revised.md)*
*Context:* AWS was named as the "future" production target. With Fargate (#66) unable to run GPU-backed tasks, needed to decide between extending the existing ECS cluster vs. introducing SageMaker as a new orchestration paradigm for the Inference Service alone.
*Decision:* Extend the **existing AWS ECS cluster** using capacity provider strategies: the API continues on Fargate (#66, unchanged) while the Inference Service runs as a second task definition on an **EC2 GPU (`g5`/`g4dn`) capacity provider** within the same cluster — same ALB, same OIDC trust relationship (#67), same container registry pattern.
*Rationale:* Fargate does not support GPU-backed tasks on ECS or EKS; ECS does support mixing Fargate and EC2 capacity providers within a single cluster, which lets one container gain GPU capability without introducing a second orchestration paradigm (SageMaker) and its separate deployment/IAM/networking model for a single service.
*Alternatives rejected:* AWS SageMaker (would introduce an entirely separate vendor-paradigm, deployment pipeline, and IAM model to operate for one container — disproportionate for a single additional service when the existing cluster can be extended instead).
*Status:* Final (revised from an initial Fargate-only assumption once the GPU requirement was confirmed).

### [#73 — Full `screening` schema](./09-infrastructure-hosting/ADR-0073-full-screening-schema.md)
*Individual ADR: [`ADR-0073`](./09-infrastructure-hosting/ADR-0073-full-screening-schema.md)*
*Context:* The `screening` bounded context (#5) was previously deferred at the table-definition level.
*Decision:* Finalized `screening.watchlist_source_snapshots`, `screening_runs`, `screening_matches` (insert-only), and `match_dispositions` (insert-only/append-style, per #33).
*Rationale:* Completes the bounded context with the same insert-only/append discipline (#16) applied consistently across the schema, and gives `evidence`'s exclusive-arc (#19) a concrete `screening_match_id` target.
*Alternatives rejected:* None — this was a completion of previously-scoped, not newly-debated, design.
*Status:* Final.

### [#74 — Full `platform` schema including `erasure_requests`](./09-infrastructure-hosting/ADR-0074-full-platform-schema-including-erasure-requests.md)
*Individual ADR: [`ADR-0074`](./09-infrastructure-hosting/ADR-0074-full-platform-schema-including-erasure-requests.md)*
*Context:* The GDPR/PDPA erasure pathway (#14) was previously described only in prose, without a finalized table.
*Decision:* Finalized `platform.erasure_requests`, scoped only to Decision #14's encrypted fields (DOB + person identifiers), with status progression `pending → key_destroyed/rejected` per #34.
*Rationale:* Turns the previously-prose-only compliance commitment into an enforceable, auditable table matching the rest of the schema's insert-only/status-transition conventions.
*Alternatives rejected:* None — completion of previously-scoped design.
*Status:* Final.

### [#75 — Full `intake` schema](./09-infrastructure-hosting/ADR-0075-full-intake-schema.md)
*Individual ADR: [`ADR-0075`](./09-infrastructure-hosting/ADR-0075-full-intake-schema.md)*
*Context:* The `intake` bounded context's OCR/extraction data model (#31, #32) was previously deferred at the table-definition level.
*Decision:* Finalized `intake.documents` (with the `document_status` enum including `quarantined`/`scan_failed`), `document_integrity_checks` (insert-only), `extraction_jobs`, and `extracted_fields` (insert-only, including a `bounding_box` jsonb column for UI highlighting and the `promoted_to_evidence_id` FK from #32).
*Rationale:* Completes the intake pipeline's data model with the same conventions applied throughout the rest of the schema.
*Alternatives rejected:* None — completion of previously-scoped design.
*Status:* Final.

---

## Phase 9 — MVP Simulation Build (Frontend-First, No DB/LLM/Docker)

> This phase introduces a deliberately reduced, parallel build path for
> demonstration purposes — it does not replace or invalidate any decision
> above; it is a scoped subset intended to produce a clickable, honest
> simulation quickly.

### [#76 — In-memory state, no database](./10-mvp-simulation/ADR-0076-in-memory-state-no-database.md)
*Individual ADR: [`ADR-0076`](./10-mvp-simulation/ADR-0076-in-memory-state-no-database.md)*
*Context:* Needed the simplest possible persistence for a demo build with no DB infrastructure.
*Decision:* A single in-memory Python dict on the backend, mirrored by a Zustand store on the frontend, both seeded from static JSON fixture files at process start; restarting either process resets all state.
*Rationale:* Sufficient for demonstrability; explicitly not meant to be durable, which is an acceptable tradeoff given this build's purpose.
*Alternatives rejected:* SQLite as a "lightweight database" (still a database — rejected to honor the explicit "no database" constraint for this build).
*Status:* Final (scoped to Phase 9 only).

### [#77 — Hand-authored fixture data](./10-mvp-simulation/ADR-0077-hand-authored-fixture-data.md)
*Individual ADR: [`ADR-0077`](./10-mvp-simulation/ADR-0077-hand-authored-fixture-data.md)*
*Context:* Needed demo data with a believable investigative narrative.
*Decision:* Mock JSON fixtures are hand-authored, not generated by a script or LLM, including one deliberately flagged case and one deliberately clean case.
*Rationale:* Guarantees narrative-quality, presentable demo data rather than plausible-but-flat generated placeholders.
*Alternatives rejected:* Script- or LLM-generated fixtures (faster to produce, but risks flat or incoherent demo narratives, and an LLM dependency contradicts this build's "no LLM" constraint even at the tooling level).
*Status:* Final (scoped to Phase 9 only).

### [#78 — Single swappable API-client boundary](./10-mvp-simulation/ADR-0078-single-swappable-api-client-boundary.md)
*Individual ADR: [`ADR-0078`](./10-mvp-simulation/ADR-0078-single-swappable-api-client-boundary.md)*
*Context:* Needed to guarantee that "frontend simulation first" work is not throwaway once a real backend exists.
*Decision:* All frontend data access routes through one module, `lib/api-client.ts`; Phase 1 of the MVP build points it at local fixtures with simulated latency, Phase 2 repoints it at the real FastAPI server with zero changes to any component.
*Rationale:* Makes the fixture-to-real-backend transition a one-file change instead of a component-by-component rewrite, directly protecting the time invested in the simulation phase.
*Alternatives rejected:* Importing fixture JSON directly into components (would require touching every component when the real backend is introduced).
*Status:* Final (scoped to Phase 9, but the boundary itself is a durable pattern retained into the full build).

### [#79 — Shared state-machine logic, simulation matches real rules](./10-mvp-simulation/ADR-0079-shared-state-machine-logic-simulation-matches-real-rules.md)
*Individual ADR: [`ADR-0079`](./10-mvp-simulation/ADR-0079-shared-state-machine-logic-simulation-matches-real-rules.md)*
*Context:* The simulation must be semantically honest, not just visually similar to the real product.
*Decision:* Case/finding/evidence status transitions in the MVP build reuse the exact enum values and transition rules from STATE_MACHINE.md/DATA_MODEL.md (#18, #29, #30), enforced in plain TypeScript (`state-machine.ts`) and Python functions instead of DB CHECK constraints/triggers.
*Rationale:* Ensures a demo viewer is seeing the real product's actual rules in action (e.g., a case truly cannot resolve with an open finding), not a simplified or fictional approximation.
*Alternatives rejected:* Ad hoc/simplified transition logic for the demo (would misrepresent the real product's guarantees).
*Status:* Final (scoped to Phase 9, logic intended to be ported forward, not replaced, when the real backend is introduced).

### [#80 — Trimmed Turborepo pipeline, no CI for this build](./10-mvp-simulation/ADR-0080-trimmed-turborepo-pipeline-no-ci-for-this-build.md)
*Individual ADR: [`ADR-0080`](./10-mvp-simulation/ADR-0080-trimmed-turborepo-pipeline-no-ci-for-this-build.md)*
*Context:* Needed to decide how much of the full monorepo tooling (#64, #67) applies to the MVP build.
*Decision:* `turbo.json`'s pipeline is trimmed to `dev`/`lint`/`build` only for this build path; `test`/`typecheck` tasks remain defined but are not wired into any CI workflow, since this build has no CI.
*Rationale:* Keeps the tooling footprint proportional to a no-Docker, no-database, no-LLM demo build; full CI/CD (#67) is reserved for the production-track build.
*Alternatives rejected:* Standing up a full GitHub Actions pipeline for the demo build (disproportionate to this build's explicitly minimal scope).
*Status:* Final (scoped to Phase 9 only).

---

## Pending / Explicitly Deferred (current, as of Decision #80)

| Item | Status | Notes |
|---|---|---|
| LLM provider default (Anthropic Claude primary, OpenAI fallback, behind `LLMClient`) | Provisional | Accepted by default unless the user explicitly overrides; not yet a confirmed final decision. |
| Data residency / multi-region pinning (#53) | Explicitly deferred | Genuine judgment call — no single defensible answer without a confirmed jurisdictional trigger. |
| Fine-grained permissions/ACL beyond the fixed role enum (#24) | Deferred | Revisit only if a real multi-role customer need is observed. |
| Bulk case/finding operations (#42) | Deferred | Revisit only if real workflow data shows a bulk-action need. |
| Dedicated secrets-manager service beyond GitHub Environments (#47) | Deferred | Revisit if compliance requirements demand it. |

**Resolved this log that were previously listed as pending in earlier sessions:** custom model architecture/size confirmation (resolved — GPU confirmed, #69–#72); full `screening`, `platform.erasure_requests`, and `intake` schemas (resolved, #73–#75); login brute-force handling (resolved, #52).
