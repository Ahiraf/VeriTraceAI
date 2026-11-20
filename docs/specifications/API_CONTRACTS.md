# VeriTraceAI — API Contracts & Wire Protocol Reference

> Complete REST, SSE, and error response specifications for `apps/api`.
> Enforces [Decision [#36](../adr/06-api-contracts/ADR-0036-api-style-rest-over-openapi-no-graphql.md)](../adr/06-api-contracts/ADR-0036-api-style-rest-over-openapi-no-graphql.md), [#37](../adr/06-api-contracts/ADR-0037-versioning-strategy.md), [#38](../adr/06-api-contracts/ADR-0038-pagination-cursor-based-not-offset.md), [#39](../adr/06-api-contracts/ADR-0039-idempotency-for-mutating-endpoints.md), [#40](../adr/06-api-contracts/ADR-0040-error-shape.md), and [#41](../adr/06-api-contracts/ADR-0041-server-sent-events-for-narrative-streaming.md).

---

## 1. Protocol Standards

- **Base URL**: `/v1` prefix across all resource endpoints.
- **Content-Type**: `application/json` for standard requests/responses.
- **Error Format**: `application/problem+json` (RFC 7807).
- **Idempotency**: All mutating operations (`POST`, `PATCH`) accept `Idempotency-Key: <UUID>`.
- **Concurrency**: Optimistic locking via `If-Match: "<version>"` or body `version` parameter.

---

## 2. Core Endpoint Specifications

### 2.1 Cases & Queue
- `GET /v1/cases`
  - **Query Params**: `status` (enum), `assigned_to` (UUID), `cursor` (UUIDv7), `limit` (default 20, max 100).
  - **Response 200 OK**:
    ```json
    {
      "items": [
        {
          "id": "018e3a2b-7c42-7000-8000-000000000001",
          "entity_name": "Nordhaven Trading Ltd",
          "registry_id": "UK-12345678",
          "jurisdiction": "UK",
          "status": "under_review",
          "assigned_investigator": "A. Reyes",
          "finding_count": 2,
          "open_finding_count": 1,
          "version": 3,
          "updated_at": "2026-11-18T09:12:00Z"
        }
      ],
      "next_cursor": "018e3a2b-7c42-7000-8000-000000000042",
      "has_more": false
    }
    ```

- `GET /v1/cases/{case_id}`
  - Returns complete case aggregate including subject entity details, jurisdiction statuses, findings summary, and active region health.

- `POST /v1/cases/simulate-intake`
  - Interactive intake endpoint for demo/simulation flow.
  - **Body**: `{ "preset": "nordhaven_dual_jurisdiction" | "custom", "payload": {...} }`
  - Returns initialized case with simulated progress job ID.

### 2.2 Findings & Decisions
- `GET /v1/cases/{case_id}/findings`
  - Returns list of discrete discrepancies citing declared vs observed ownership, addresses, or screening hits.

- `PATCH /v1/cases/{case_id}/findings/{finding_id}/decision`
  - **Headers**: `Idempotency-Key` (required)
  - **Body**:
    ```json
    {
      "decision": "Cleared" | "EvidenceRequested" | "Escalated",
      "rationale": "Registry filing confirms 55% majority control predating onboarding declaration by 6 months.",
      "ofac_50_rule_checked": true,
      "version": 1
    }
    ```
  - **Response 200 OK**: Updated finding with associated decision ID.
  - **Response 422 Unprocessable**: If `rationale` is < 10 characters or state machine guard fails.

### 2.3 UBO Graph Traversal
- `GET /v1/cases/{case_id}/ownership-graph`
  - Returns nodes (Persons, Entities) and directional edges categorized into `declared`, `observed`, and `reconciled`.
  - Format directly consumable by React Flow visualizer.

### 2.4 Audit Dossier
- `GET /v1/cases/{case_id}/audit-dossier`
  - Generates verifiable compliance dossier containing cryptographic hash chain, timestamped investigator actions, and immutable decision ledger.

---

## 3. RFC 7807 Error Contract

```json
{
  "type": "urn:veritrace:error:state_machine:open_findings_exist",
  "title": "Cannot Clear Case With Open Findings",
  "status": 422,
  "detail": "Case '018e3a2b-7c42-7000' has 1 unresolved finding (find_001). All findings must be addressed before marking Cleared.",
  "instance": "/v1/cases/018e3a2b-7c42-7000/findings/find_001/decision"
}
```
