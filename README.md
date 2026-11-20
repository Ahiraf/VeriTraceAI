# VeriTraceAI

> **Verify the Truth. Trace the Ownership.**  
> Evidence-Grounded AI Copilot for Corporate KYB & UBO Compliance Investigation.

---

## The Problem

Determining Ultimate Beneficial Ownership (UBO) for cross-border corporate structures is notoriously prone to fraud, shell company concealment, and regulatory non-compliance. Compliance officers are inundated with hundred-page shareholder registers, contradictory registry filings, and complex multi-hop ownership chains across disparate jurisdictions (such as the UK Companies House and Bangladesh RJSC).

Most existing automated tools either act as opaque "black-box" risk scoring engines or generate unverified "AI hallucinations" without evidentiary grounding.

## What VeriTraceAI Does

VeriTraceAI provides a calm, dense, and evidence-grounded investigation workspace that corroborates **declared corporate ownership** against **independently observed registry filings, sanctions watchlists, and document extracts**:

1. **Evidence-Before-Conclusion**: Every claim, discrepancy, and finding on screen links directly to its verbatim quoted source document or official registry filing.
2. **Interactive UBO Graph Tracing**: Visualizes multi-hop ownership chains with provenance-differentiated edges (**Declared** vs. **Observed** vs. **Reconciled**).
3. **Dual-Jurisdiction Demonstration**: Pre-seeded with a cross-border scenario featuring a UK holding parent (*Nordhaven Trading Ltd*) and its Bangladesh operating subsidiary (*Bengal Shipping Corp*).
4. **Interactive Simulated Intake**: Lets evaluators upload sample PDF corporate filings and follow the multi-step verification pipeline (Upload → Antivirus Scan → OCR Extraction → Graph Reconciliation → Finding Detection).
5. **Immutable Compliance Audit Dossier**: Generates verifiable, exportable compliance dossiers signed with cryptographic event hashes and investigator rationales.

---

## Monorepo Architecture

```
.
├── apps/
│   ├── web/               # Next.js 15, React Flow, Tailwind, Zustand (Simulation Client)
│   └── api/               # FastAPI modular monolith (State Machine & Bounded Contexts)
├── packages/
│   └── types/      # Canonical TypeScript types & domain models
├── docs/                  # Architectural specs, C4 diagrams, statecharts, DDL
│   ├── architecture/      # ARCHITECTURE.md, BOUNDED_CONTEXTS.md, C4_DIAGRAMS.md
│   ├── specifications/    # STATE_MACHINE.md, DATA_MODEL.md, API_CONTRACTS.md, SECURITY.md, INFRA_DEPLOYMENT.md
│   ├── database/          # DATABASE.md (PostgreSQL DDL & Neo4j Cypher)
│   └── ui/                # DESIGN.md & UI_ARCHITECTURE.md
├── AGENTS.md              # Canonical development standards for AI coding agents
├── CLAUDE.md              # Command quick reference and context guide
├── CONTRIBUTING.md        # Contribution guidelines & branching model
├── SECURITY.md            # Vulnerability reporting & security architecture
├── LICENSE                # Apache 2.0 Open Source License
└── turbo.json             # Monorepo build orchestrator
```

---

## Quickstart

### Prerequisites
- Node.js 20+ and `pnpm` (v9+)
- Python 3.12+ (for `apps/api`)

### Installation & Development

```bash
# 1. Install workspace dependencies
pnpm install

# 2. Run both the Web UI and API concurrently
pnpm dev
# -> Web UI:  http://localhost:3000
# -> API Docs: http://localhost:8000/docs
```

To run only the frontend simulation:
```bash
pnpm --filter web dev
```

---

## Documentation Index

| Document | Purpose |
|---|---|
| [`docs/architecture/ARCHITECTURE.md`](docs/architecture/ARCHITECTURE.md) | System overview, bounded contexts, and request lifecycle |
| [`docs/architecture/BOUNDED_CONTEXTS.md`](docs/architecture/BOUNDED_CONTEXTS.md) | Domain boundaries: `case_evidence`, `intake`, `screening`, `platform` |
| [`docs/specifications/STATE_MACHINE.md`](docs/specifications/STATE_MACHINE.md) | Statecharts, transition guard rules, and lifecycle invariance |
| [`docs/specifications/DATA_MODEL.md`](docs/specifications/DATA_MODEL.md) | Exclusive-arc sourcing and dual-store graph projection contracts |
| [`docs/database/DATABASE.md`](docs/database/DATABASE.md) | Executable PostgreSQL DDL and Neo4j Cypher schemas |
| [`docs/ui/DESIGN.md`](docs/ui/DESIGN.md) | UI design system, color palette, WCAG AA contrast, and layouts |
| [`AGENTS.md`](AGENTS.md) | Quality standards and rules for AI agents in this repo |

---

## License

Licensed under the [Apache License, Version 2.0](LICENSE).
