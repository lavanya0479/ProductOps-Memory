from fastapi.testclient import TestClient
from app.main import app
from app.api.routes import chat as chat_routes
from app.services.llm import LLMUnavailable

client = TestClient(app)

def test_chat_endpoint(monkeypatch):
    class Service:
        def chat(self, message, product, version):
            return "Historical experience suggests checking OAuth.", [{"text":"OAuth corrected a prior E401", "rank":1}]
    monkeypatch.setattr(chat_routes, "AgentService", Service)
    response = client.post("/api/chat", json={"message":"E401?", "product":"Product X"})
    assert response.status_code == 200
    assert response.json()["has_relevant_memory"] is True
    assert "OAuth" in response.json()["answer"]

def test_chat_llm_failure_is_sanitized(monkeypatch):
    class Service:
        def chat(self, *_args): raise LLMUnavailable("The language model is temporarily unavailable")
    monkeypatch.setattr(chat_routes, "AgentService", Service)
    response = client.post("/api/chat", json={"message":"help"})
    assert response.status_code == 503
    assert response.json()["code"] == "llm_unavailable"

def test_optional_real_hindsight_integration():
    import os
    import uuid
    import pytest
    if os.getenv("HINDSIGHT_INTEGRATION") != "1":
        pytest.skip("Set HINDSIGHT_INTEGRATION=1 to use the configured real Hindsight service")
    from app.memory.hindsight import HindsightMemory
    token = "ProductOps synthetic integration " + str(uuid.uuid4())
    memory = HindsightMemory()
    memory.retain_memory(token, context="synthetic integration test")
    result = memory.recall_memory(token)
    assert result
