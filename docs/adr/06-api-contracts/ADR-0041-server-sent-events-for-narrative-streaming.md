# ADR-0041: Server-Sent Events for narrative streaming

## Metadata
- **Status:** `Final.`
- **Category:** Phase 5 — API Contracts & Protocol
- **Decision Number:** #41
- **Date:** 2026-11-20

---

## Context
The AI-generated case narrative needs to stream to the UI as it's produced.

## Decision
**SSE** (not WebSockets) for narrative streaming, given it's a one-directional server→client stream with no need for bidirectional messaging.

## Rationale
SSE is simpler to operate (plain HTTP, works through standard proxies/load balancers) and is the right-sized tool for a one-way stream; WebSockets would add protocol complexity unused by any other feature.

## Alternatives Rejected
WebSockets (bidirectional capability not needed anywhere else in the product, added complexity for no benefit here).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
