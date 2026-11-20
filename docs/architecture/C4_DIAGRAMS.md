# VeriTraceAI — C4 Architectural Diagrams

> System Architecture visualization following the C4 Model (Context, Container, Component).
> References [Decision [#7](../adr/02-strategic-design/ADR-0007-entity-person-address-as-shared-reference-data.md)](../adr/02-strategic-design/ADR-0007-entity-person-address-as-shared-reference-data.md), [#8](../adr/02-strategic-design/ADR-0008-ownership-representation-relational-graph-dual-store.md), [#59](../adr/08-frontend-ui/ADR-0059-hosting-cloudflare-pages-workers.md), [#66](../adr/09-infrastructure-hosting/ADR-0066-api-hosting-aws-ecs-fargate.md), [#72](../adr/09-infrastructure-hosting/ADR-0072-production-gpu-hosting-ecs-mixed-capacity-provider-cluster-not-sagemaker-revised.md).

---

## 1. System Context Diagram (Level 1)

```mermaid
C4Context
    title System Context for VeriTraceAI

    Person(investigator, "Compliance Investigator", "Conducts KYB/UBO review, compares discrepancy evidence, issues audit-sealed decisions.")
    System(veritrace, "VeriTraceAI System", "Evidence-grounded UBO compliance copilot and registry corroboration platform.")

    System_Ext(companies_house, "UK Companies House API", "UK registry filings and PSC registers.")
    System_Ext(rjsc, "Bangladesh RJSC Registry", "RJSC corporate entity and shareholder records.")
    System_Ext(sanctions, "OFAC & OpenSanctions", "Watchlist feeds and PEP databases.")

    Rel(investigator, veritrace, "Reviews cases, inspects UBO graphs, records decisions", "HTTPS")
    Rel(veritrace, companies_house, "Pulls entity filings and PSC snapshots", "REST/HTTPS")
    Rel(veritrace, rjsc, "Corroborates entity details & Form XII", "HTTPS/API")
    Rel(veritrace, sanctions, "Syncs snapshots for screening", "HTTPS")
```

---

## 2. Container Diagram (Level 2)

```mermaid
C4Container
    title Container Diagram for VeriTraceAI

    Person(investigator, "Investigator", "Web browser user")

    Container(web_app, "Web Application", "Next.js 15, React, Tailwind, Zustand", "Provides Case Queue, Interactive UBO Graph, and Evidence Comparison.")
    Container(api_gateway, "API Monolith", "FastAPI, Python 3.12", "Orchestrates bounded contexts, state machines, and evidence promotion.")
    Container(inference_svc, "Inference Service", "PyTorch, FastAPI, GPU", "Serves custom model for fuzzy entity resolution and name matching.")

    ContainerDb(db_relational, "Relational Database", "PostgreSQL (Supabase)", "Stores immutable evidence, audit logs, cases, decisions, and RLS tenants.")
    ContainerDb(db_graph, "Graph Database", "Neo4j Aura", "Stores UBO ownership graph (OWNS_DECLARED, OWNS_OBSERVED, OWNS_RECONCILED).")
    ContainerDb(cache_store, "Cache & KV", "Upstash Redis", "Handles rate limiting, idempotency locks, and CSRF tokens.")
    ContainerDb(blob_store, "Document Storage", "Cloudflare R2", "Encrypted storage for corporate filings, PSC PDFs, and model weights.")

    Rel(investigator, web_app, "Uses", "HTTPS")
    Rel(web_app, api_gateway, "Consumes REST API & SSE", "HTTPS / SSE")
    Rel(api_gateway, inference_svc, "Calls entity match confidence", "Internal HTTPS")
    Rel(api_gateway, db_relational, "Queries & inserts (RLS)", "SQL / Port 5432")
    Rel(api_gateway, db_graph, "Executes graph traversals", "Cypher / Bolt")
    Rel(api_gateway, cache_store, "Limits & checks idempotency", "Redis Protocol")
    Rel(api_gateway, blob_store, "Presigns upload & reads docs", "S3 Protocol")
```
