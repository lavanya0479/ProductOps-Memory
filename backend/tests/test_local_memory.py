from app.memory.sqlite import SQLiteMemory


def test_sqlite_memory_persists_and_recalls_relevant_items(tmp_path):
    path = tmp_path / "memory.sqlite3"
    memory = SQLiteMemory(path)
    memory.retain_memory("Product: Atlas. Issue: E401. Updating OAuth mapping fixed the token error.")
    memory.retain_memory("Product: Beacon. Issue: webhook timeout. Increasing retry interval fixed delivery.")

    reopened = SQLiteMemory(path)
    results = reopened.recall_memory("Atlas E401 OAuth token", limit=5)

    assert len(results) == 1
    assert results[0]["rank"] == 1
    assert "OAuth mapping" in results[0]["text"]
