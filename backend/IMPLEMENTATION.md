# Backend implementation notes

## Hindsight

Hindsight is the persistent memory layer. The current official Python quick start uses the `hindsight-client` package and `Hindsight(base_url="http://localhost:8888")`. Its documented calls are `retain(bank_id=..., content=...)`, `recall(bank_id=..., query=...)`, and optionally `reflect(bank_id=..., query=...)`. This implementation uses retain and recall so the ProductOps agent owns answer generation and can apply its source-labeling instructions consistently.

Run a local server with the official Docker image:

```sh
docker run --rm --name hindsight --shm-size=1g -p 8888:8888 -p 9999:9999 \
  -e HINDSIGHT_API_LLM_API_KEY="$OPENAI_API_KEY" \
  -v "$HOME/.hindsight-docker:/home/hindsight/.pg0" \
  ghcr.io/vectorize-io/hindsight:latest
```

The API is at `http://localhost:8888`; the control plane is at port 9999. Hindsight itself needs a configured LLM provider/key for extraction. The backend uses the Python SDK, rather than inventing HTTP routes.

## Retain, recall, and correction

The adapter formats each experience as structured plain text containing product, version, knowledge category, issue, context, attempts/outcomes, and status, then submits it with the documented `retain` call. Corrections are retained as new `updated_corrected_knowledge` with an explicit supersedes statement; old experience remains available as historical evidence. Recall calls the documented `recall` method and returns ranked result text. `reflect` is not required: the agent combines recalled evidence with the user question and calls the configured LLM.

## Configuration

Backend variables: `HINDSIGHT_BASE_URL` (default local URL), `HINDSIGHT_BANK_ID` (default `productops-memory`), optional `HINDSIGHT_API_KEY` for secured deployments, `LLM_API_KEY`, `LLM_MODEL` (default `gpt-4o-mini`), `LLM_BASE_URL` (optional OpenAI-compatible endpoint), `APP_ENV`, and `CORS_ORIGINS`. Hindsight's own model configuration is set on its server, such as `HINDSIGHT_API_LLM_API_KEY` for the local Docker setup. Never commit `.env`.

## Architecture and API contract

FastAPI routes validate Pydantic request models and call the Agent Service or the sole Hindsight adapter (`app/memory/hindsight.py`). The agent recalls context, labels its origin, and asks the LLM for a grounded answer. Routes: `GET /health`, `POST /api/memory/teach`, `/api/memory/recall`, `/api/memory/correct`, and `/api/chat`. Request and response schemas are documented in `../docs/API.md` and `../docs/FRONTEND_CONTRACT.md`.

## Testing strategy

Use FastAPI's test client and dependency overrides/mocks for Hindsight and LLM calls. Cover request validation, wrapper mapping, endpoint behavior, and sanitized upstream errors. An opt-in integration test runs only when `HINDSIGHT_BASE_URL` is explicitly configured to a real local service; it retains and recalls a unique synthetic case. The four-step demo sequence is teach, recall, correct, recall again.

## Sources

- [Official Hindsight quick start](https://hindsight.vectorize.io/developer/api/quickstart)
- [Official Hindsight main methods](https://hindsight.vectorize.io/developer/api/main-methods)
- [Official Hindsight repository](https://github.com/vectorize-io/hindsight)
