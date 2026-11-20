# VeriTraceAI — API Service (`apps/api`)

FastAPI modular monolith hosting the core domain state machine, UBO reconciliation, and bounded contexts.

## Bounded Contexts

- `case_evidence`: Core case aggregate, finding management, and ownership edge queries.
- `intake`: Document upload lifecycle, antivirus scanning, and OCR candidate extraction.
- `screening`: Watchlist matches, sanctions screening, and OFAC 50% rule verification.
- `platform`: Multi-tenant isolation primitives (Postgres RLS) and GDPR/PDPA crypto-shredding.

## Development

```bash
# Run API standalone with hot-reload
uvicorn src.main:app --reload --port 8000

# Health check
curl http://localhost:8000/healthz
```
