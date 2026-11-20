# ADR-0028: Email: Resend + fastapi-mail + MailHog

## Metadata
- **Status:** `Final.

---`
- **Category:** Phase 3 — Persistence & Storage Infrastructure
- **Decision Number:** #28
- **Date:** 2026-11-20

---

## Context
Needed transactional email (invites, erasure confirmations, digest notifications) across dev and production without vendor lock pain.

## Decision
**Resend** as the production transactional email provider, **fastapi-mail** as the backend abstraction layer, **MailHog** as the local dev SMTP catcher (no real email sent in dev).

## Rationale
fastapi-mail keeps the provider swappable behind one interface; MailHog gives developers a real inbox UI locally with zero external dependency; Resend has a developer-friendly API well-suited to transactional volume at this scale.

## Alternatives Rejected
SES directly (more AWS-specific wiring for marginal benefit at current scale); SendGrid (comparable, Resend preferred for DX).

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
