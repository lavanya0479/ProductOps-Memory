# Frontend contract

## Base URL

Local development: `http://localhost:8000`. FastAPI OpenAPI UI: `/docs`. The browser client reads `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8000`). Set backend `CORS_ORIGINS` to the exact frontend origin(s).

## Endpoints

| Method | Path | Request | Success response |
|---|---|---|---|
| GET | `/health` | none | `{"status":"ok"}` |
| POST | `/api/memory/teach` | `{product, version?, issue, experience, source?, context?, customer_context?}` | `{status:"retained", bank_id}` |
| POST | `/api/memory/recall` | `{query, product?, limit?}` | `{memories:[{text,rank,source}], has_relevant_memory}` |
| POST | `/api/memory/correct` | `{original_context, correction, product, version?}` | `{status:"retained", bank_id}` |
| POST | `/api/chat` | `{message, product?, version?}` | `{answer, memories:[{text,rank,source}], has_relevant_memory}` |

All bodies and responses use JSON. Optional values can be omitted. `limit` defaults to 8 and is limited to 1–20. Empty recall is successful, with `memories: []` and `has_relevant_memory: false`.

Recall is query-based semantic search, not a list-all operation. Returned memories may not represent the entire Hindsight bank and do not include stable IDs or timestamps. The frontend's Memories page requires a search query and labels these as matching memories.

## Errors

Errors use `{ "detail": "...", "code": "..." }`. Codes: `invalid_request` (422), `memory_unavailable` or `llm_unavailable` (503), `internal_error` (500). A 503 should be presented as a retryable service problem; do not retry invalid input without correcting it.

## Example chat flow

```http
POST /api/chat
Content-Type: application/json
```

```json
{"message":"I'm getting E401. What should I check?","product":"Product X"}
```

## Example teach flow

```json
{"product":"Product X","version":"4.2","issue":"E401","experience":"Restarting failed for legacy authentication; updating authentication mapping resolved prior cases.","source":"team_experience"}
```

## Example correction flow

```json
{"original_context":"E401 authentication mapping workaround","correction":"After Product X v5, use OAuth configuration instead.","product":"Product X","version":"5.0"}
```
