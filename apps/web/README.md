# VeriTraceAI — Web Application (`apps/web`)

Next.js 15 client-side application providing an interactive, evidence-grounded simulation and compliance investigation workbench.

## Key Features

- **Case Queue & Filtering**: URL-persisted multi-parameter filtering, sortable discrepancy queues, and responsive status chips.
- **Interactive UBO Graph Tracing**: Visual node-and-edge ownership chains powered by `@xyflow/react` (React Flow), rendering Declared, Observed, and Reconciled links.
- **Evidence Comparison Panel**: Side-by-side verification comparing declared disclosures with observed registry records (UK Companies House, RJSC).
- **Interactive Intake Simulation**: Multi-step corporate document ingestion and simulated extraction pipeline.
- **Simulation Store with Reset**: LocalStorage persistence via Zustand `persist` middleware with one-click demo state reset.

## Development

```bash
# Run web standalone
pnpm dev

# Typecheck and lint
pnpm typecheck
pnpm lint
```
