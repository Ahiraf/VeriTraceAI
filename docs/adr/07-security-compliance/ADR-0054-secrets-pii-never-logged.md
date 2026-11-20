# ADR-0054: Secrets/PII never logged

## Metadata
- **Status:** `Final.`
- **Category:** Phase 6 — Security, Isolation & Compliance
- **Decision Number:** #54
- **Date:** 2026-11-20

---

## Context
Observability tooling (OTel) must not leak sensitive data into traces/logs.

## Decision
Structured logging and OTel spans are scrubbed of encrypted-field plaintext, tokens, and secrets via a shared redaction middleware applied before any log/trace exporter.

## Rationale
Prevents the observability pipeline from becoming an unintended data-exposure channel.

## Alternatives Rejected
Trusting per-call-site discipline to avoid logging sensitive fields (error-prone, no structural guarantee).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
