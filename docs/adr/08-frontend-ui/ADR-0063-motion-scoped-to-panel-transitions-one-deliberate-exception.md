# ADR-0063: Motion: scoped to panel transitions, one deliberate exception

## Metadata
- **Status:** `Final.

---`
- **Category:** Phase 7 — Frontend & UI Architecture
- **Decision Number:** #63
- **Date:** 2026-11-20

---

## Context
Needed to decide how liberally Framer Motion should be used.

## Decision
Motion is scoped to panel/layout transitions only, and is explicitly **never** used to animate the arrival of data (findings, evidence, decisions) — with one deliberate exception: the narrative stream's sentence-by-sentence typing-cadence animation, kept specifically to signal "this is AI-drafted and still completing, verify as it finishes."

## Rationale
Animating data arrival risks implying liveliness/urgency the calm-not-alarming principle (#60) prohibits; the one exception is kept because it serves a distinct, deliberate communicative purpose (incompleteness/draft status) rather than decoration.

## Alternatives Rejected
Liberal use of entrance/exit animations on data updates (conflicts with calm-not-alarming); zero motion anywhere including the narrative stream (loses the useful "still drafting" signal).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
