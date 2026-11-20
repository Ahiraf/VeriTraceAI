# ADR-0008: Ownership representation: relational + graph, dual-store

## Metadata
- **Status:** `Final.`
- **Category:** Phase 2 — Strategic Design & Bounded Contexts
- **Decision Number:** #8
- **Date:** 2026-11-20

---

## Context
Ownership structures are graph-shaped (edges, cycles, multi-hop chains) but also need transactional, auditable row-level history.

## Decision
`ownership_edges` lives in Postgres as the system of record (with exclusive-arc evidence sourcing, see #9); a **Neo4j** projection holds the same relationships as a queryable graph (`OWNS_DECLARED` / `OWNS_OBSERVED` / `OWNS_RECONCILED` relationship types) for traversal, cycle detection, and visualization.

## Rationale
Postgres gives transactional integrity and RLS; Neo4j gives efficient multi-hop traversal and cycle detection that would be painful as recursive SQL CTEs at scale.

## Alternatives Rejected
Graph-only store (loses RLS/transactional guarantees); relational-only with recursive CTEs (correct but operationally painful for deep/cyclic ownership chains).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
