from types import SimpleNamespace
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.schemas import TeachRequest
from app.agent.service import format_experience
from app.memory.hindsight import HindsightMemory
from app.api.routes import memory as memory_routes

client = TestClient(app)

class FakeHindsight:
    def __init__(self): self.retained = []; self.queries = []
    def retain(self, **kwargs): self.retained.append(kwargs); return {"id": "fake"}
    def recall(self, **kwargs):
        self.queries.append(kwargs)
        return SimpleNamespace(results=[SimpleNamespace(text="Synthetic historical result")])

def test_memory_validation_rejects_empty_required_fields():
    response = client.post("/api/memory/teach", json={"product":"", "issue":"E401", "experience":"x"})
    assert response.status_code == 422
    assert response.json()["code"] == "invalid_request"

def test_format_experience_labels_team_knowledge():
    data = TeachRequest(product="Product X", issue="E401", experience="Mapping fixed it")
    formatted = format_experience(data)
    assert "TEAM-LEARNED KNOWLEDGE" in formatted
    assert "Product: Product X" in formatted

def test_hindsight_retain_wrapper():
    sdk = FakeHindsight(); memory = HindsightMemory(client=sdk, bank_id="test-bank")
    memory.retain_memory("case text", context="context")
    assert sdk.retained == [{"bank_id":"test-bank", "content":"case text", "context":"context"}]

def test_hindsight_recall_wrapper_and_limit():
    sdk = FakeHindsight(); memory = HindsightMemory(client=sdk)
    result = memory.recall_memory("E401", limit=1)
    assert result == [{"text":"Synthetic historical result", "rank":1}]
    assert sdk.queries[0]["query"] == "E401"

def test_teach_endpoint(monkeypatch):
    captured = []
    class Service:
        def teach(self, body): captured.append(body)
    monkeypatch.setattr(memory_routes, "_service", Service)
    response = client.post("/api/memory/teach", json={"product":"Product X","issue":"E401","experience":"OAuth worked","source":"team_experience"})
    assert response.status_code == 200 and response.json()["status"] == "retained"
    assert captured[0].product == "Product X"

def test_recall_endpoint(monkeypatch):
    class Service:
        def recall(self, *args): return [{"text":"Prior case", "rank":1}]
    monkeypatch.setattr(memory_routes, "_service", Service)
    response = client.post("/api/memory/recall", json={"query":"E401", "product":"Product X"})
    assert response.status_code == 200 and response.json()["has_relevant_memory"]

def test_correction_endpoint(monkeypatch):
    captured = []
    class Service:
        def correct(self, body): captured.append(body)
    monkeypatch.setattr(memory_routes, "_service", Service)
    response = client.post("/api/memory/correct", json={"original_context":"mapping workaround","correction":"Use OAuth","product":"Product X","version":"5.0"})
    assert response.status_code == 200
    assert captured[0].version == "5.0"

def test_memory_failure_is_sanitized(monkeypatch):
    class Service:
        def teach(self, _body): raise RuntimeError("secret/internal detail")
    monkeypatch.setattr(memory_routes, "_service", Service)
    response = client.post("/api/memory/teach", json={"product":"X","issue":"E401","experience":"case"})
    assert response.status_code == 503
    assert "secret" not in response.text
    assert response.json()["code"] == "memory_unavailable"
