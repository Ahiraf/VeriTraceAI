# ADR-0062: Typography: Inter + IBM Plex Mono, purposefully split

## Metadata
- **Status:** `Final.`
- **Category:** Phase 7 — Frontend & UI Architecture
- **Decision Number:** #62
- **Date:** 2026-11-20

---

## Context
Needed to visually distinguish AI-generated narrative text from verbatim quoted source evidence.

## Decision
**Inter** for all UI chrome and generated narrative body text (with tabular figures for numeric data); **IBM Plex Mono** exclusively for evidence/document excerpts — i.e., any text that is a direct quotation from a source document.

## Rationale
A consistent typographic split lets an investigator distinguish "the system is saying this" from "the document literally says this" at a glance, without reading a label — reinforcing evidence-before-conclusion (#60) typographically.

## Alternatives Rejected
Single typeface throughout with only color/weight differentiation (weaker, more easily overlooked distinction than a full typeface change).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
