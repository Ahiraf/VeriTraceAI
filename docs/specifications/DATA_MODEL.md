# VeriTraceAI — Domain Data Model & Persistence Architecture

> High-level data modeling rationale, entity relationship structures, and graph projection contracts.
> Complements `docs/database/DATABASE.md` (the executable SQL reference).

---

## 1. Domain Entities & Invariants

```
┌──────────────────┐               1..N ┌──────────────────┐
│      Case        │───────────────────▶│     Finding      │
└────────┬─────────┘                    └────────┬─────────┘
         │ 1                                     │ N
         ▼                                       ▼
┌──────────────────┐               1..N ┌──────────────────┐
│  Subject Entity  │                    │     Evidence     │
└────────┬─────────┘                    └────────┬─────────┘
         │ 1..N                                  │ 1 (Exclusive Arc)
         ▼                                       ▼
┌──────────────────┐                    ┌─────────────────────────┐
│  Ownership Edge  │                    │ Document / Registry /   │
│ (Relational+Graph│                    │ Screening / Manual User │
└──────────────────┘                    └─────────────────────────┘
```

### 1.1 Exclusive-Arc Sourcing Principle
In VeriTraceAI, every item of evidence and every ownership claim must be physically bound to exactly one origin at the database engine level:

$$\sum_{source \in \{doc, reg, screening, manual\}} (source \ne \text{null}) = 1$$

This prevents ambiguous provenance, phantom corroboration, and data manipulation.

### 1.2 Dual-Store Ownership Graph Architecture
Ownership chains in KYB/UBO compliance require two conflicting storage properties:
1. **ACID Transactional Guarantees & RLS**: Needed for audit trails, legal evidence submission, and compliance defense. Handled by PostgreSQL (`case_evidence.ownership_edges`).
2. **Deep Recursive Cycle & Path Traversal**: Needed to uncover complex multi-hop shell company chains (Entity A owns Entity B (40%), Entity B owns Entity C (30%), Person D controls Entity A). Handled by Neo4j graph projections (`OWNS_DECLARED`, `OWNS_OBSERVED`, `OWNS_RECONCILED`).

---

## 2. Provenance-Based Graph Edges

In the graph database projection, relationships carry strict provenance types:

- `(:Person|Entity)-[:OWNS_DECLARED {percentage, case_id, evidence_id}]->(:Entity)`
  *The ownership claimed by the applicant company in onboarding forms.*
- `(:Person|Entity)-[:OWNS_OBSERVED {percentage, source_registry, filing_date}]->(:Entity)`
  *The ownership evidenced by corporate registry returns (Companies House, RJSC).*
- `(:Person|Entity)-[:OWNS_RECONCILED {computed_percentage, status: 'confirmed'|'conflict'}]->(:Entity)`
  *The reconciled ultimate beneficial ownership calculated by the graph resolver.*

Cycles (e.g. Circular cross-shareholding between shell firms) are flagged immediately as distinct high-severity findings.
