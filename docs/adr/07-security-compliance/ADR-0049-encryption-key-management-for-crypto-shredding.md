# ADR-0049: Encryption key management for crypto-shredding

## Metadata
- **Status:** `Final.`
- **Category:** Phase 6 — Security, Isolation & Compliance
- **Decision Number:** #49
- **Date:** 2026-11-20

---

## Context
#14's crypto-shredding design needs a concrete key-management approach.

## Decision
Per-subject DEKs are themselves encrypted by a tenant-level Key Encryption Key (KEK) managed outside the primary database (cloud KMS); destroying a DEK means deleting its KMS-held key material, which renders the corresponding ciphertext permanently unrecoverable.

## Rationale
Keeps the actual destructive operation (KMS key deletion) outside the application database, making the crypto-shred irreversible by design rather than by policy.

## Alternatives Rejected
Storing DEKs encrypted-at-rest in the same database (destruction then depends on database-level delete discipline rather than an independent, irreversible KMS action).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
