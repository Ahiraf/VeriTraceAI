# ADR-0050: Input validation and file-upload safety

## Metadata
- **Status:** `Final.`
- **Category:** Phase 6 — Security, Isolation & Compliance
- **Decision Number:** #50
- **Date:** 2026-11-20

---

## Context
Document intake is the highest-risk ingress point (arbitrary file upload).

## Decision
All uploads pass through antivirus/integrity scanning (`document_integrity_checks`, #31) before extraction; file type is validated by content-sniffing, not just extension/MIME header; uploads are size- and type-bounded at the API layer before ever reaching storage.

## Rationale
Defense in depth against malicious uploads masquerading as legitimate document types.

## Alternatives Rejected
Trusting client-provided MIME type/extension alone (trivially spoofable).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
