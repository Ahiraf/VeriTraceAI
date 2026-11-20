# Security Policy — VeriTraceAI

## Reporting Vulnerabilities

Report suspected vulnerabilities privately to the project maintainers — **do not open a public issue** for unpatched security findings.

Include:
1. Detailed description of the vulnerability.
2. Step-by-step reproduction instructions or proof-of-concept.
3. Affected components (`apps/web`, `apps/api`, `packages/types`, or database schema).

## Disclosure Timeline

- **Acknowledgement:** Within 2 business days of receipt.
- **Severity Assessment & Scope:** Within 5 business days.
- **Remediation & Patch:** Critical and high-severity vulnerabilities are targeted for mitigation within 14 days.
- **Public Disclosure:** Coordinated with the reporter only after verified fixes have been deployed.

## Supported Versions

| Component | Status |
|---|---|
| `main` branch | Actively supported — the canonical release train |
| `dev` branch | Active development — pre-release fixes |
| Past releases / tags | Not supported — upgrade to `main` |

## Security Architecture & Controls in Place

- **Database Row-Level Security (RLS)**: Enforced across all tenant-scoped PostgreSQL tables. Tenant isolation is verified at the database connection layer via `app.current_tenant_id`.
- **Exclusive-Arc Provenance**: Hard database CHECK constraints require that every evidence record cites exactly one source (Document, Registry, Screening hit, or Manual entry).
- **GDPR Art. 17 / BD PDPA Crypto-Shredding**: Natural person identifying fields (DOB, national ID) are encrypted application-side using AES-256-GCM with per-subject Data Encryption Keys (DEKs). Erasure requests permanently destroy the DEK in KMS, leaving unreadable cryptographic tombstones without corrupting audit trails.
- **Immutable Audit Events**: The `case_evidence.audit_events` and `case_evidence.case_decisions` tables have `UPDATE`, `DELETE`, and `TRUNCATE` privileges explicitly revoked from the application role.
- **Client Secrets Separation**: `apps/web` contains zero server secrets or privileged tokens; all authenticated access occurs via validated JWT bearer tokens.
- **Rate Limiting & Idempotency**: Redis-backed sliding window rate limits protect public endpoints, and all state-mutating actions require an `Idempotency-Key` header.
