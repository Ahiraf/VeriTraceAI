# ADR-0047: Secrets management

## Metadata
- **Status:** `Final (subject to revisit if compliance requirements demand a dedicated secrets manager).
*(Cross-reference: INFRA_DEPLOYMENT.md, 3 GitHub Environments.)*`
- **Category:** Phase 6 — Security, Isolation & Compliance
- **Decision Number:** #47
- **Date:** 2026-11-20

---

## Context
Needed a consistent approach to secrets across local dev, CI, and the three GitHub Environments.

## Decision
GitHub Environment secrets for CI/CD-time values; environment-injected secrets (not baked into images) at runtime; local dev uses a `.env.local` (gitignored) seeded from a committed `.env.example`.

## Rationale
Standard separation of concerns; prevents secrets from ever being baked into a built artifact or committed to version control.

## Alternatives Rejected
A dedicated secrets-manager service (Vault, AWS Secrets Manager) — deferred as disproportionate to current operational scale; GitHub Environments' native secret scoping is sufficient for now.

---

## References
- [Architecture Documentation](../../architecture/ARCHITECTURE.md)
- [ADR Index](../README.md)
- [Master Decision Log](../DECISION_LOG.md)
