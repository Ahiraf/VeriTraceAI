# ADR-0025: Object storage key structure

## Metadata
- **Status:** `Final.`
- **Category:** Phase 3 — Persistence & Storage Infrastructure
- **Decision Number:** #25
- **Date:** 2026-11-20

---

## Context
Needed a convention for where documents and (later) model weights live in R2.

## Decision
`documents/{tenant_id}/{case_id}/{document_id}/{filename}` and `inference-weights/{model_version}/` as the two top-level R2 key prefixes.

## Rationale
Tenant-first prefixing supports per-tenant lifecycle/retention rules later; separating weights from documents under one bucket avoids provisioning a second bucket for a single small artifact class.

## Alternatives Rejected
Flat key structure with tenant_id only in metadata (harder to apply prefix-based lifecycle rules or access policies).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
