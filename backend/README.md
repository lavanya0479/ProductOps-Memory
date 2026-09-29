# ProductOps Memory Backend

FastAPI backend with persistent product knowledge in Hindsight and answer generation through an OpenAI-compatible chat completions API.

## Run locally

1. Start Hindsight using its [official Docker instructions](https://hindsight.vectorize.io/developer/api/quickstart) (API on port 8888). Configure the Hindsight server's own LLM provider, for example `HINDSIGHT_API_LLM_API_KEY`.
2. From this directory, create a virtual environment and install dependencies:

   ```sh
   python -m venv .venv
   # Windows PowerShell: .venv\Scripts\Activate.ps1
   # macOS/Linux: source .venv/bin/activate
   pip install -r requirements.txt
   Copy-Item .env.example .env   # PowerShell; edit the values below
   ```

3. Set `LLM_API_KEY` and any deployment-specific Hindsight values in `.env`, then run:

   ```sh
   uvicorn app.main:app --reload
   ```

API docs: http://localhost:8000/docs. Health: http://localhost:8000/health.

## Environment

See `.env.example`. Required to chat: `LLM_API_KEY`. Hindsight local default: `HINDSIGHT_BASE_URL=http://localhost:8888`; `HINDSIGHT_API_KEY` is optional for secured instances. `HINDSIGHT_BANK_ID` selects the persistent memory bank. `LLM_MODEL` and optional `LLM_BASE_URL` choose an OpenAI-compatible model endpoint. Hindsight's extraction model settings belong to the Hindsight server itself.

## API and demo

See [API examples](../docs/API.md) and the [frontend contract](../docs/FRONTEND_CONTRACT.md). Synthetic scenarios are in `../data/demo/`.

## Tests

```sh
pytest
```

The integration test is skipped unless `HINDSIGHT_INTEGRATION=1`; when enabled it uses the configured real Hindsight service and retains a uniquely named synthetic item before recalling it.
