# ProductOps Memory Backend

FastAPI backend using Hindsight for persistent memory. The local Hindsight server and the answer-generation model can both use Ollama; SQLite remains an explicit lightweight development option.

## Run locally

1. Install/start [Ollama](https://ollama.com/download) and download the local model:

   ```powershell
   ollama pull llama3.2
   ```

2. Start the Hindsight API server. Docker instructions are available in the [official Hindsight quick start](https://hindsight.vectorize.io/developer/api/quickstart). On Windows without Docker, install the official server into a separate virtual environment:

   ```powershell
   py -m venv .hindsight-venv
   .hindsight-venv\Scripts\Activate.ps1
   pip install hindsight-api
   $env:HINDSIGHT_API_LLM_PROVIDER = "ollama"
   $env:HINDSIGHT_API_LLM_MODEL = "llama3.2:latest"
   $env:HINDSIGHT_API_LLM_BASE_URL = "http://localhost:11434/v1"
   hindsight-api
   ```

   Hindsight should be reachable at `http://localhost:8888`. The Ollama provider needs no cloud API key.
3. From this directory, create the ProductOps backend environment and install its client dependencies:

   ```sh
   python -m venv .venv
   # Windows PowerShell: .venv\Scripts\Activate.ps1
   # macOS/Linux: source .venv/bin/activate
   pip install -r requirements.txt
   Copy-Item .env.example .env   # PowerShell; Hindsight + Ollama defaults
   ```

4. Start the ProductOps API:

   ```sh
   uvicorn app.main:app --reload
   ```

API docs: http://localhost:8000/docs. Health: http://localhost:8000/health.

## Environment

See `.env.example`. Defaults select `MEMORY_BACKEND=hindsight`, `HINDSIGHT_BASE_URL=http://localhost:8888`, a 12-second Hindsight request timeout, and Ollama for answer generation. To opt into SQLite's keyword-based local memory instead, set `MEMORY_BACKEND=sqlite`. To use an OpenAI-compatible answer model, set `LLM_PROVIDER=openai`, `LLM_API_KEY`, and optional `LLM_MODEL` / `LLM_BASE_URL`. Hindsight's extraction model settings belong to the Hindsight server.

## API and demo

See [API examples](../docs/API.md) and the [frontend contract](../docs/FRONTEND_CONTRACT.md). Synthetic scenarios are in `../data/demo/`.

## Tests

```sh
pytest
```

The integration test is skipped unless `HINDSIGHT_INTEGRATION=1`; when enabled it uses the configured real Hindsight service and retains a uniquely named synthetic item before recalling it.
