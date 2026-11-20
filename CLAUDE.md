# CLAUDE.md — Commands & Context Map

Rules live in `AGENTS.md` (canon, read it first). This file is commands and where-things-are only — do not restate rules here.

## Commands

```bash
# Package & Monorepo Operations
pnpm install                    # workspace dependencies
pnpm dev                        # run both web (:3000) and api (:8000) concurrently via Turbo
pnpm --filter web dev           # run Next.js frontend only (http://localhost:3000)
pnpm --filter api dev           # run FastAPI backend only (http://localhost:8000)

# Code Quality & Validation Gates
pnpm lint                       # ESLint across packages & web
pnpm typecheck                  # tsc across workspace packages
pnpm test                       # Vitest for frontend & shared packages
pnpm build                      # Turbo production build pipeline

# Backend Operations (apps/api)
cd apps/api && uvicorn src.main:app --reload --port 8000
pytest apps/api/tests           # run backend pytest test suite
```

Pre-PR gate: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.

## Where Things Live

| Path | Purpose & Ownership |
|---|---|
| `docs/architecture/` | Bounded contexts, system architecture, C4 diagrams |
| `docs/specifications/` | State machine rules, API contracts, security, and infra specs |
| `docs/ui/` | Design system tokens, UX wireframes, and UI architecture |
| `docs/database/` | PostgreSQL DDL schema reference and Neo4j Cypher definitions |
| `packages/types` | Canonical TypeScript DTOs, domain models, and API interfaces |
| `apps/web/src/components/` | Modular UI components (Queue, Case Detail, UBO Graph, Viewer) |
| `apps/web/src/stores/` | Zustand stores (`useSimulationStore.ts` with LocalStorage persist) |
| `apps/web/src/lib/fixtures/` | Dual-jurisdiction hand-authored seed data (UK & BD) |
| `apps/api/src/routers/` | FastAPI endpoint routers (Cases, Findings, Documents, Graph) |

## Context Hygiene

Stay under ~40% capacity. Load only the specific documentation matching the task; do not preload the entire `docs/` tree. Summarize findings instead of re-reading files repeatedly.
