# Frontend and backend integration status

The frontend contract is implemented by the FastAPI service. See [`API.md`](API.md) for request and response examples and [`FRONTEND_CONTRACT.md`](FRONTEND_CONTRACT.md) for the UI mapping.

## Confirmed configuration

- Frontend API origin: `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:8000`).
- Backend allowed browser origins: `CORS_ORIGINS` (defaults to `http://localhost:3000,http://localhost:5173`). Set this to the exact deployed frontend origin(s).
- The app has no user login or app-level bearer token. `HINDSIGHT_API_KEY` is a backend-only optional credential for secured Hindsight deployments.
- The configured app uses Hindsight (`MEMORY_BACKEND=hindsight`) for persistent memory and Ollama (`LLM_PROVIDER=ollama`) for answer generation. The Hindsight API service must be started at `HINDSIGHT_BASE_URL` (default `http://localhost:8888`).
- SQLite (`MEMORY_BACKEND=sqlite`) is an optional local fallback. Deployments can use `LLM_PROVIDER=openai` with backend `LLM_API_KEY` and optional `LLM_MODEL` / `LLM_BASE_URL`.

## Known API boundary

`POST /api/memory/recall` returns memories relevant to the submitted query and optional product filter. There is no list-all endpoint and the response does not include stable IDs, dates, or structured product/version/source metadata. The Memories page therefore offers search results and does not claim to show a complete inventory. A complete browse page would require an explicitly designed backend listing endpoint backed by the memory service.
