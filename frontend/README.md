# ProductOps Memory frontend

Next.js 16 / React 19 frontend for the FastAPI service in `../backend`.

## Run locally

```powershell
cd frontend
npm ci
Copy-Item .env.example .env.local
# Edit NEXT_PUBLIC_API_BASE_URL if the API is not at http://localhost:8000
npm run dev
```

Open http://localhost:3000. The backend and Hindsight API must be running; the local model provider uses Ollama. Setup is documented in [`../backend/README.md`](../backend/README.md). The browser calls the backend directly. No frontend secrets or app authentication tokens are used.

`NEXT_PUBLIC_API_BASE_URL` is compiled into the browser bundle, so set it before starting/building Next.js. If the frontend origin changes, include that exact origin in backend `CORS_ORIGINS`.

Available UI flows: ask the agent (`POST /api/chat`), teach experience (`POST /api/memory/teach`), correct recalled knowledge (`POST /api/memory/correct`), and search relevant memories (`POST /api/memory/recall`). Recall is a relevance search, not a complete memory listing.
