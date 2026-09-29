# ProductOps Memory API

Base URL: `http://localhost:8000`. Interactive OpenAPI docs are at `/docs`.

## Health

`GET /health` → `{"status":"ok"}`.

## Teach a memory

`POST /api/memory/teach`

```json
{"product":"Product X","version":"4.2","issue":"E401 authentication error","experience":"Restarting failed for legacy authentication. Updating authentication mapping resolved prior cases.","source":"team_experience"}
```

Returns `{"status":"retained","bank_id":"productops-memory"}` after Hindsight accepts the item. `source` may be `team_experience`, `official_knowledge`, or `historical_experience`.

## Recall

`POST /api/memory/recall`

```json
{"query":"Product X E401, what should I check?","product":"Product X","limit":8}
```

Returns `{"memories":[{"text":"...","rank":1,"source":"historical/team memory"}],"has_relevant_memory":true}`. An empty search returns an empty array and `false`.

## Correct knowledge

`POST /api/memory/correct`

```json
{"original_context":"E401 authentication mapping workaround","correction":"The mapping workaround is outdated after Product X v5. Use OAuth configuration instead.","product":"Product X","version":"5.0"}
```

The correction is retained as new updated knowledge and states which prior context it supersedes.

## Chat

`POST /api/chat`

```json
{"message":"I'm getting E401. What should I check?","product":"Product X","version":"5.0"}
```

Returns `{"answer":"...","memories":[...],"has_relevant_memory":true}`. The answer is generated from the question and retrieved memory; historical cases are identified as team experience.

## Errors

Malformed input returns HTTP 422 with `{"detail":"Request body is invalid","code":"invalid_request"}`. Hindsight failures return HTTP 503 with `code: memory_unavailable`; LLM failures return HTTP 503 with `code: llm_unavailable`. Unexpected server errors return HTTP 500 with a sanitized `internal_error` body. Responses never include keys or raw exception text.
