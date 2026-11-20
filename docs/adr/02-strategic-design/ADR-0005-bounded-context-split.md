# ADR-0005: Bounded context split

## Metadata
- **Status:** `Final.`
- **Category:** Phase 2 — Strategic Design & Bounded Contexts
- **Decision Number:** #5
- **Date:** 2026-11-20

---

## Context
Needed a module boundary that matches both the domain language and the eventual deployability of pieces independently.

## Decision
Four bounded contexts: **`platform`** (tenancy, users, erasure), **`intake`** (document ingestion/OCR/extraction), **`case_evidence`** (entities, persons, evidence, findings, ownership, cases, decisions, audit), **`screening`** (watchlist matching). Each owns its own schema namespace.

## Rationale
Matches natural data-ownership seams; each context has a distinct insert/mutate profile (append-only vs. mutable) that benefits from schema-level isolation.

## Alternatives Rejected
Single flat schema (harder to reason about mutation rules per table); context-per-microservice from day one (premature operational overhead).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
