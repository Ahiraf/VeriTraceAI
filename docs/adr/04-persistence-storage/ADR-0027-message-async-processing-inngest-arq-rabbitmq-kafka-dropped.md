# ADR-0027: Message/async processing: Inngest + ARQ, RabbitMQ/Kafka dropped

## Metadata
- **Status:** `Final.`
- **Category:** Phase 3 — Persistence & Storage Infrastructure
- **Decision Number:** #27
- **Date:** 2026-11-20

---

## Context
Needed an async job system for OCR/extraction pipelines and background tasks without operating a dedicated message broker cluster.

## Decision
**Inngest** for durable, retryable, observable workflow steps (e.g., the intake → extraction → evidence-promotion pipeline) and **ARQ** (Redis-backed) for lightweight Python background tasks; RabbitMQ and Kafka were evaluated and dropped.

## Rationale
Inngest removes the operational burden of running and scaling a broker while still providing durable step functions and retries; ARQ reuses the Redis dependency already present rather than adding a second queue technology for simple tasks.

## Alternatives Rejected
RabbitMQ/Kafka (justified at much higher throughput/ops maturity than this product currently needs; adds a cluster to operate and monitor).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
