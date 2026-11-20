# ADR-0058: Theming: next-themes

## Metadata
- **Status:** `Final.`
- **Category:** Phase 7 — Frontend & UI Architecture
- **Decision Number:** #58
- **Date:** 2026-11-20

---

## Context
Needed light/dark mode support consistent with DESIGN.md §7's independently-tuned per-mode tokens (e.g., `--finding-indicator`, `--escalated`).

## Decision
`next-themes` for theme state and persistence, driving the CSS custom-property tokens defined in DESIGN.md §2.

## Rationale
Lightweight, SSR-safe theme switching with no flash-of-wrong-theme, and straightforward integration with CSS-variable-driven design tokens.

## Alternatives Rejected
Hand-rolled theme context (reinvents SSR-safety handling next-themes already solves).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
