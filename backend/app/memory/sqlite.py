"""Local persistent memory backend for development and offline demos."""
import re
import sqlite3
from pathlib import Path


def _tokens(value: str) -> set[str]:
    return {token for token in re.findall(r"[a-z0-9]+", value.lower()) if len(token) > 1}


class SQLiteMemory:
    def __init__(self, path: str | Path):
        self.path = Path(path).expanduser().resolve()
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self._connect() as db:
            db.execute("""
                CREATE TABLE IF NOT EXISTS memories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    content TEXT NOT NULL,
                    context TEXT,
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
            """)

    def _connect(self):
        db = sqlite3.connect(self.path, timeout=10)
        db.row_factory = sqlite3.Row
        return db

    def retain_memory(self, content: str, context: str | None = None):
        with self._connect() as db:
            cursor = db.execute(
                "INSERT INTO memories (content, context) VALUES (?, ?)",
                (content, context),
            )
            return {"id": cursor.lastrowid}

    def recall_memory(self, query: str, limit: int = 8) -> list[dict]:
        query_tokens = _tokens(query)
        if not query_tokens:
            return []

        with self._connect() as db:
            rows = db.execute("SELECT id, content FROM memories").fetchall()

        ranked = []
        for row in rows:
            memory_tokens = _tokens(row["content"])
            overlap = query_tokens & memory_tokens
            if overlap:
                score = len(overlap) / len(query_tokens)
                ranked.append((score, row["id"], row["content"]))
        ranked.sort(key=lambda item: (item[0], item[1]), reverse=True)
        return [
            {"text": content, "rank": rank, "source": "historical/team memory"}
            for rank, (_, _, content) in enumerate(ranked[:limit], start=1)
        ]
