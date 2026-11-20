# VeriTraceAI — Security & Compliance Architecture

> Defensive posture, multi-tenant isolation, cryptographic auditability, and GDPR/PDPA erasure.
> Enforces [Decision [#14](../adr/02-strategic-design/ADR-0014-field-level-encryption-and-crypto-shredding-scope.md)](../adr/02-strategic-design/ADR-0014-field-level-encryption-and-crypto-shredding-scope.md), [#26](../adr/04-persistence-storage/ADR-0026-redis-as-ephemeral-only-never-system-of-record.md), [#43](../adr/06-api-contracts/ADR-0043-authentication-supabase-issued-jwt-verified-at-the-api.md), [#46](../adr/07-security-compliance/ADR-0046-row-level-security-as-the-primary-tenant-isolation-mechanism.md), [#48](../adr/07-security-compliance/ADR-0048-audit-event-immutability-enforcement.md), [#49](../adr/07-security-compliance/ADR-0049-encryption-key-management-for-crypto-shredding.md), and [#54](../adr/07-security-compliance/ADR-0054-secrets-pii-never-logged.md).

---

## 1. Authentication & Defense-in-Depth

- **Auth Layer**: Supabase Auth handles OAuth 2.0 / OpenID Connect (OIDC).
- **API Token Verification**: FastAPI validates RS256 JWTs via Supabase JWKS directly. Never relies solely on upstream proxy headers.
- **Role-Based Access Control (RBAC)**:
  - `investigator`: Reviews assigned cases, flags discrepancies, drafts decisions.
  - `compliance_officer`: Resolves escalations, seals audit dossiers, configures risk rules.
  - `admin`: Manages users, tenant settings, and KMS keys.

---

## 2. Multi-Tenant Row Level Security (RLS)

All tenant-scoped database queries enforce PostgreSQL Row-Level Security:

```sql
ALTER TABLE case_evidence.cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_cases ON case_evidence.cases
    AS RESTRICTIVE
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
```

The database role used by `apps/api` cannot bypass RLS. Every database connection sets `app.current_tenant_id` at the start of the transaction based on verified JWT claims.

---

## 3. GDPR Art. 17 & BD PDPA Crypto-Shredding Architecture

To comply with data privacy regulations ("Right to be Forgotten") without corrupting historical corporate compliance audits:

1. Natural person identifying columns (`dob_encrypted`, `identifier_encrypted` in `case_evidence.persons`) are encrypted application-side using AES-256-GCM.
2. Each person entity has an independent Data Encryption Key (DEK).
3. DEKs are managed through cloud KMS and wrapped under a tenant-level Key Encryption Key (KEK).
4. When an `ErasureRequest` is approved, the person's DEK is permanently destroyed in KMS.
5. The relational row, finding linkages, and audit events remain intact as unreadable cryptographic tombstones. Referential integrity and audit trails never break.

---

## 4. Immutable Audit Event Ledger

The `case_evidence.audit_events` table is protected by database privilege revocation:

```sql
REVOKE UPDATE, DELETE, TRUNCATE ON case_evidence.audit_events FROM app_role;
```

Monthly range-partitioning preserves high write throughput and tamper-evidence indefinitely.
