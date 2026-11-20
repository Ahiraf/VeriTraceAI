# VeriTraceAI — Full Database Schema Reference

> Consolidates every persisted table/graph/key-namespace across all four bounded
> contexts in one place. Supersedes the per-context summaries in `DATA_MODEL.md`
> for the purpose of "what exists where" — `DATA_MODEL.md` remains the narrative
> rationale document; this is the executable reference. Completes the previously
> deferred Screening (Decision [#73](../adr/09-infrastructure-hosting/ADR-0073-full-screening-schema.md)), Platform erasure pathway (Decision [#74](../adr/09-infrastructure-hosting/ADR-0074-full-platform-schema-including-erasure-requests.md)), and
> Intake OCR/integrity tables (Decision [#75](../adr/09-infrastructure-hosting/ADR-0075-full-intake-schema.md)).
>
> Conventions applied uniformly: every table has `id uuid primary key default
> gen_random_uuid()`, `tenant_id uuid not null references platform.tenants(id)`,
> `created_at timestamptz not null default now()`. RLS is enabled on every table
> below; policies all reduce to `tenant_id = platform.current_tenant_id()`
> unless noted. Insert-only tables have `UPDATE`/`DELETE` revoked from the
> application role at grant level, not just convention.

---

## 0. Schema Index

| Schema | Bounded context | Status |
|---|---|---|
| `case_evidence` | Case & Evidence (Core) | Complete (Decisions [#13](../adr/02-strategic-design/ADR-0013-model-runs-as-the-seam-between-the-domain-and-any-ai-ml-component.md)–[#22b](../adr/03-data-modeling/ADR-0022-no-soft-is-deleted-flags.md)) |
| `screening` | Screening (Core) | Complete (Decision [#73](../adr/09-infrastructure-hosting/ADR-0073-full-screening-schema.md), this file) |
| `intake` | Intake (Supporting) | Complete (Decision [#75](../adr/09-infrastructure-hosting/ADR-0075-full-intake-schema.md), this file) |
| `platform` | Platform (Generic) | Complete (Decision [#74](../adr/09-infrastructure-hosting/ADR-0074-full-platform-schema-including-erasure-requests.md), this file) |

---

## 1. Schema: `platform`

```sql
create schema if not exists platform;

create table platform.tenants (
    id              uuid primary key default gen_random_uuid(),
    legal_name      text not null,
    jurisdiction    text not null,              -- 'UK_MODE' | 'BD_MODE' per registry adapter
    created_at      timestamptz not null default now()
);

create type platform.user_role as enum (
    'investigator', 'compliance_officer', 'admin'
);

create table platform.users (
    id              uuid primary key default gen_random_uuid(),
    tenant_id       uuid not null references platform.tenants(id),
    auth_subject    text not null unique,        -- Supabase Auth `sub` claim
    email           text not null,
    role            platform.user_role not null default 'investigator',
    created_at      timestamptz not null default now()
);
create index idx_users_tenant on platform.users(tenant_id);

-- Forward references resolved (were outstanding in DATA_MODEL.md):
alter table case_evidence.cases
    add constraint fk_cases_assigned_investigator
    foreign key (assigned_investigator_id) references platform.users(id),
    add constraint fk_cases_created_by
    foreign key (created_by_id) references platform.users(id);

-- GDPR/PDPA erasure pathway (Decision [#74](../adr/09-infrastructure-hosting/ADR-0074-full-platform-schema-including-erasure-requests.md)) — crypto-shredding, scoped ONLY to
-- Decision [#14](../adr/02-strategic-design/ADR-0014-field-level-encryption-and-crypto-shredding-scope.md)'s app-layer-encrypted columns (DOB, person identifiers).
-- Erasure never deletes or mutates the surrounding row; it destroys the
-- per-subject data-encryption key, rendering ciphertext permanently unreadable.
create table platform.erasure_requests (
    id                  uuid primary key default gen_random_uuid(),
    tenant_id           uuid not null references platform.tenants(id),
    subject_person_id   uuid not null references case_evidence.persons(id),
    requested_by_id     uuid not null references platform.users(id),
    requested_at        timestamptz not null default now(),
    status              text not null default 'pending'
                        check (status in ('pending', 'key_destroyed', 'rejected')),
    legal_basis         text not null,            -- e.g. 'GDPR Art.17', 'BD PDPA s.X'
    completed_at        timestamptz,
    rejection_reason    text
);
-- Insert-only except the single status-progression UPDATE path; enforced in
-- the application service layer, not at grant level, because the status
-- transition itself IS the erasure action (destroying the DEK happens here).
create index idx_erasure_requests_subject on platform.erasure_requests(subject_person_id);
```

---

## 2. Schema: `case_evidence`

```sql
create schema if not exists case_evidence;

create table case_evidence.entities (
    id              uuid primary key default gen_random_uuid(),
    tenant_id       uuid not null references platform.tenants(id),
    legal_name      text not null,
    registry_id     text,                         -- Companies House / RJSC number
    jurisdiction    text not null,
    created_at      timestamptz not null default now()
);

create table case_evidence.persons (
    id                      uuid primary key default gen_random_uuid(),
    tenant_id               uuid not null references platform.tenants(id),
    full_name               text not null,
    dob_encrypted           bytea,                 -- Decision [#14](../adr/02-strategic-design/ADR-0014-field-level-encryption-and-crypto-shredding-scope.md): app-layer encrypted
    identifier_encrypted    bytea,                 -- national ID / passport, app-layer encrypted
    dek_id                  uuid not null,          -- which data-encryption key wraps the above
    created_at              timestamptz not null default now()
);

create table case_evidence.addresses (
    id              uuid primary key default gen_random_uuid(),
    tenant_id       uuid not null references platform.tenants(id),
    normalized_hash text not null,                 -- Decision [#15](../adr/03-data-modeling/ADR-0015-primary-key-strategy.md): dedup key
    raw_text        text not null,
    created_at      timestamptz not null default now(),
    unique (tenant_id, normalized_hash)
);

-- Exclusive-arc Evidence (Decision [#16](../adr/03-data-modeling/ADR-0016-soft-state-vs-hard-state.md)): exactly one of the four source
-- columns is non-null, enforced by CHECK.
create table case_evidence.evidence (
    id                  uuid primary key default gen_random_uuid(),
    tenant_id           uuid not null references platform.tenants(id),
    case_id             uuid not null references case_evidence.cases(id) deferrable initially deferred,
    source_document_id  uuid references intake.documents(id),
    source_registry_id  text,                      -- e.g. Companies House filing ref
    source_screening_id uuid references screening.screening_matches(id),
    source_manual_by_id uuid references platform.users(id),
    claim_type          text not null,              -- 'ownership_percentage' | 'director' | 'address' | ...
    claim_value         jsonb not null,
    created_at          timestamptz not null default now(),
    check (
        (source_document_id is not null)::int +
        (source_registry_id is not null)::int +
        (source_screening_id is not null)::int +
        (source_manual_by_id is not null)::int = 1
    )
);
revoke update, delete on case_evidence.evidence from app_role;

create table case_evidence.findings (
    id              uuid primary key default gen_random_uuid(),
    tenant_id       uuid not null references platform.tenants(id),
    case_id         uuid not null references case_evidence.cases(id),
    finding_type    text not null,                 -- 'declared_vs_corroborated_conflict' | ...
    narrative       text,
    status          text not null default 'open' check (status in ('open', 'retracted')),
    retracted_reason text,
    created_at      timestamptz not null default now()
);

-- N-ary link table: a Finding cites 1..N Evidence rows.
create table case_evidence.finding_evidence_links (
    finding_id  uuid not null references case_evidence.findings(id),
    evidence_id uuid not null references case_evidence.evidence(id),
    primary key (finding_id, evidence_id)
);

-- Asymmetric exclusive-arc OwnershipEdge (Decision [#22](../adr/03-data-modeling/ADR-0022-no-soft-is-deleted-flags.md)): a Postgres mirror of
-- the Neo4j graph's declared/observed/reconciled relationship, used for
-- relational querying where graph traversal isn't needed.
create table case_evidence.ownership_edges (
    id                  uuid primary key default gen_random_uuid(),
    tenant_id           uuid not null references platform.tenants(id),
    case_id             uuid not null references case_evidence.cases(id),
    owner_entity_id     uuid references case_evidence.entities(id),
    owner_person_id     uuid references case_evidence.persons(id),
    owned_entity_id     uuid not null references case_evidence.entities(id),
    edge_type           text not null check (edge_type in ('declared', 'observed', 'reconciled')),
    ownership_percentage numeric(5,2),
    evidence_id         uuid not null references case_evidence.evidence(id),
    created_at          timestamptz not null default now(),
    check (
        (owner_entity_id is not null)::int + (owner_person_id is not null)::int = 1
    )
);
revoke update, delete on case_evidence.ownership_edges from app_role;

-- Case backbone: statechart enum + 4 parallel-region columns + optimistic
-- concurrency version (Decision [#18](../adr/03-data-modeling/ADR-0018-case-status-and-region-status-as-explicit-postgres-enums.md), #29).
create type case_evidence.case_status as enum (
    'Intake', 'Extracting', 'Resolving', 'GraphBuilt', 'FindingsReady',
    'NarrativeDrafted', 'AnalystReview', 'Cleared', 'EvidenceRequested',
    'Escalated', 'AuditSealed'
);
create type case_evidence.region_status as enum ('pending', 'computed', 'stale');

create table case_evidence.cases (
    id                          uuid primary key default gen_random_uuid(),
    tenant_id                   uuid not null references platform.tenants(id),
    subject_entity_id           uuid not null references case_evidence.entities(id),
    status                      case_evidence.case_status not null default 'Intake',
    identity_match_region       case_evidence.region_status not null default 'pending',
    relationship_region         case_evidence.region_status not null default 'pending',
    document_integrity_region   case_evidence.region_status not null default 'pending',
    screening_match_region      case_evidence.region_status not null default 'pending',
    assigned_investigator_id    uuid,              -- FK added in platform.sql after platform.users exists
    created_by_id               uuid,
    version                     integer not null default 1,
    created_at                  timestamptz not null default now()
);

-- Insert-only decision record (Decision [#19](../adr/03-data-modeling/ADR-0019-evidence-source-exclusivity-columns.md)) — the only way a Case reaches
-- a terminal status is through a row here.
create table case_evidence.case_decisions (
    id              uuid primary key default gen_random_uuid(),
    tenant_id       uuid not null references platform.tenants(id),
    case_id         uuid not null references case_evidence.cases(id),
    decided_by_id   uuid not null references platform.users(id),
    decision        text not null check (decision in ('Cleared', 'EvidenceRequested', 'Escalated')),
    rationale       text not null,
    ofac_50_rule_checked boolean not null,          -- guard evidence, Decision [#18](../adr/03-data-modeling/ADR-0018-case-status-and-region-status-as-explicit-postgres-enums.md) guard
    created_at      timestamptz not null default now()
);
revoke update, delete on case_evidence.case_decisions from app_role;

-- Polymorphic, no-FK, monthly-partitioned audit log (Decision [#20](../adr/03-data-modeling/ADR-0020-jurisdiction-region-as-a-first-class-dimension-not-metadata.md)). No FK so
-- that audit rows outlive the deletion/anonymization of the entities they
-- describe (crypto-shredding touches Person fields, never this table).
create table case_evidence.audit_events (
    id              uuid primary key default gen_random_uuid(),
    tenant_id       uuid not null,
    actor_id        uuid,                           -- nullable: system-generated events
    actor_type      text not null check (actor_type in ('user', 'system', 'agent')),
    event_type      text not null,
    subject_type    text not null,                  -- 'case' | 'evidence' | 'finding' | ...
    subject_id      uuid not null,
    payload         jsonb not null,
    occurred_at     timestamptz not null default now()
) partition by range (occurred_at);
revoke update, delete on case_evidence.audit_events from app_role;
-- Monthly partitions created by Inngest cron (Decision [#53](../adr/07-security-compliance/ADR-0053-data-residency-region-pinning.md)); example:
create table case_evidence.audit_events_2026_12
    partition of case_evidence.audit_events
    for values from ('2026-12-01') to ('2027-01-01');

-- Dedicated model-run ledger (Decision [#21](../adr/03-data-modeling/ADR-0021-timestamps-occurred-at-vs-created-at-distinction.md)) — every LLM narrator call AND
-- every custom Inference Service call lands here, never overwritten.
create table case_evidence.model_runs (
    id                  uuid primary key default gen_random_uuid(),
    tenant_id           uuid not null references platform.tenants(id),
    case_id             uuid references case_evidence.cases(id),
    model_task_type     text not null,              -- 'narrative_generation' | 'entity_resolution_score' | 'screening_name_match'
    model_provider       text not null,              -- 'anthropic' | 'openai' | 'veritrace_inference_service'
    model_identifier     text not null,              -- model name/version
    input_payload_hash  text not null,
    output_payload      jsonb not null,
    confidence          numeric(5,4),
    latency_ms          integer not null,
    created_at          timestamptz not null default now()
);
revoke update, delete on case_evidence.model_runs from app_role;
```

---

## 3. Schema: `screening` (Decision [#73](../adr/09-infrastructure-hosting/ADR-0073-full-screening-schema.md) — completes previously deferred model)

```sql
create schema if not exists screening;

-- Full snapshot of the watchlist source at the moment of the check, so a
-- later OFAC/OpenSanctions update never silently rewrites historical results.
create table screening.watchlist_source_snapshots (
    id              uuid primary key default gen_random_uuid(),
    source_name     text not null,                  -- 'OFAC_SDN' | 'OpenSanctions' | ...
    snapshot_date   date not null,
    source_version  text not null,
    retrieved_at    timestamptz not null default now(),
    unique (source_name, snapshot_date)
);

create table screening.screening_runs (
    id                      uuid primary key default gen_random_uuid(),
    tenant_id               uuid not null references platform.tenants(id),
    case_id                 uuid not null references case_evidence.cases(id),
    subject_entity_id       uuid references case_evidence.entities(id),
    subject_person_id       uuid references case_evidence.persons(id),
    watchlist_snapshot_id   uuid not null references screening.watchlist_source_snapshots(id),
    triggered_at            timestamptz not null default now(),
    completed_at            timestamptz,
    check (
        (subject_entity_id is not null)::int + (subject_person_id is not null)::int = 1
    )
);

create table screening.screening_matches (
    id                  uuid primary key default gen_random_uuid(),
    tenant_id           uuid not null references platform.tenants(id),
    screening_run_id    uuid not null references screening.screening_runs(id),
    matched_list_entry  jsonb not null,               -- raw matched record, preserved verbatim
    match_score         numeric(5,4) not null,         -- fuzzy-match confidence (may originate from Inference Service model_run)
    model_run_id        uuid references case_evidence.model_runs(id),
    ofac_percentage_basis numeric(5,2),                -- supports the 50% rule guard at Decision [#18](../adr/03-data-modeling/ADR-0018-case-status-and-region-status-as-explicit-postgres-enums.md)
    created_at          timestamptz not null default now()
);
revoke update, delete on screening.screening_matches from app_role;

-- Human disposition of a match — the only mutable row in this schema, and
-- only append-style via new rows, never editing a prior disposition.
create table screening.match_dispositions (
    id                  uuid primary key default gen_random_uuid(),
    tenant_id           uuid not null references platform.tenants(id),
    screening_match_id  uuid not null references screening.screening_matches(id),
    disposed_by_id      uuid not null references platform.users(id),
    disposition         text not null check (disposition in ('true_match', 'false_positive', 'needs_more_evidence')),
    rationale           text not null,
    created_at          timestamptz not null default now()
);
revoke update, delete on screening.match_dispositions from app_role;
```

---

## 4. Schema: `intake` (Decision [#75](../adr/09-infrastructure-hosting/ADR-0075-full-intake-schema.md) — completes previously deferred model)

```sql
create schema if not exists intake;

create type intake.document_status as enum (
    'uploaded', 'scanning', 'clean', 'quarantined', 'scan_failed',
    'extracting', 'extracted', 'extraction_failed'
);

create table intake.documents (
    id              uuid primary key default gen_random_uuid(),
    tenant_id       uuid not null references platform.tenants(id),
    case_id         uuid not null references case_evidence.cases(id),
    uploaded_by_id  uuid not null references platform.users(id),
    r2_object_key   text not null unique,
    original_filename text not null,
    mime_type       text not null,
    status          intake.document_status not null default 'uploaded',
    created_at      timestamptz not null default now()
);

create table intake.document_integrity_checks (
    id              uuid primary key default gen_random_uuid(),
    tenant_id       uuid not null references platform.tenants(id),
    document_id     uuid not null references intake.documents(id),
    scanner         text not null default 'clamav',
    result          text not null check (result in ('clean', 'infected', 'error')),
    scanned_at      timestamptz not null default now()
);
revoke update, delete on intake.document_integrity_checks from app_role;

create table intake.extraction_jobs (
    id              uuid primary key default gen_random_uuid(),
    tenant_id       uuid not null references platform.tenants(id),
    document_id     uuid not null references intake.documents(id),
    inngest_run_id  text not null,
    status          text not null default 'pending' check (status in ('pending', 'running', 'succeeded', 'failed')),
    started_at      timestamptz,
    completed_at    timestamptz
);

create table intake.extracted_fields (
    id                  uuid primary key default gen_random_uuid(),
    tenant_id           uuid not null references platform.tenants(id),
    extraction_job_id   uuid not null references intake.extraction_jobs(id),
    field_type          text not null,               -- 'ownership_percentage' | 'director_name' | ...
    field_value         jsonb not null,
    bounding_box        jsonb,                        -- {page, x, y, w, h} for UI highlighting (DESIGN.md §5.3)
    ocr_confidence      numeric(5,4) not null,
    promoted_to_evidence_id uuid references case_evidence.evidence(id),
    created_at          timestamptz not null default now()
);
revoke update, delete on intake.extracted_fields from app_role;
```

---

## 5. Neo4j — Ownership Graph (Decision [#22b](../adr/03-data-modeling/ADR-0022-no-soft-is-deleted-flags.md))

```cypher
// Constraints
CREATE CONSTRAINT entity_id_unique IF NOT EXISTS
FOR (e:Entity) REQUIRE e.id IS UNIQUE;

CREATE CONSTRAINT person_id_unique IF NOT EXISTS
FOR (p:Person) REQUIRE p.id IS UNIQUE;

// Relationship-type-per-provenance pattern — never a single generic OWNS edge
// with a "type" property, because that makes provenance-filtered traversal
// (e.g. "show me only reconciled ownership") require a property filter on
// every hop instead of a relationship-type filter, which Neo4j optimizes for.
MERGE (owner)-[r:OWNS_DECLARED {case_id: $case_id, evidence_id: $evidence_id}]->(owned)
MERGE (owner)-[r2:OWNS_OBSERVED {case_id: $case_id, evidence_id: $evidence_id}]->(owned)
MERGE (owner)-[r3:OWNS_RECONCILED {case_id: $case_id, evidence_id: $evidence_id}]->(owned)
ON CREATE SET r.ownership_percentage = $pct, r.created_at = datetime()
```

---

## 6. Redis Key Namespace (Upstash)

| Prefix | Purpose | TTL |
|---|---|---|
| `ratelimit:{tenant_id}:{route}` | Sliding window + token bucket (Decision [#32](../adr/05-state-machine/ADR-0032-extraction-promotion-gate.md)) | 60s rolling |
| `idempotency:{key}` | Idempotent request replay guard (Decision [#30](../adr/05-state-machine/ADR-0030-finding-lifecycle-states.md)) | 24h |
| `csrf:{session_id}` | Double-submit CSRF token (Decision [#45](../adr/06-api-contracts/ADR-0045-typed-client-generation-for-the-frontend.md)) | session lifetime |
| `cache:registry_search:{query_hash}` | Debounced registry search cache (Decision [#42](../adr/06-api-contracts/ADR-0042-bulk-operations-deferred.md)) | 5m |
| `loginattempts:{ip}:{username_hash}` | Pending brute-force cooldown mechanism (not yet a numbered decision) | progressive |

---

## 7. Cloudflare R2 Object Key Structure

```
r2://veritrace-{env}/
  documents/{tenant_id}/{case_id}/{document_id}/{original_filename}
  inference-weights/{model_identifier}/{version}/weights.safetensors
```

---

## 8. Table-to-Context Cross-Reference

| Table | Schema | Insert-only? | Partitioned? |
|---|---|---|---|
| `entities`, `persons`, `addresses` | `case_evidence` | No | No |
| `evidence` | `case_evidence` | Yes | No |
| `findings` | `case_evidence` | No (status update to `retracted` only) | No |
| `ownership_edges` | `case_evidence` | Yes | No |
| `cases` | `case_evidence` | No (status/version updates) | No |
| `case_decisions` | `case_evidence` | Yes | No |
| `audit_events` | `case_evidence` | Yes | Yes, monthly |
| `model_runs` | `case_evidence` | Yes | No |
| `screening_matches`, `match_dispositions` | `screening` | Yes | No |
| `document_integrity_checks`, `extracted_fields` | `intake` | Yes | No |
| `tenants`, `users` | `platform` | No | No |
| `erasure_requests` | `platform` | No (single status progression) | No |
