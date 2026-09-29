"""The sole Hindsight-specific implementation, using the official Python client."""
from hindsight_client import Hindsight
from app.config import get_settings


class HindsightMemory:
    def __init__(self, client=None, bank_id: str | None = None):
        settings = get_settings()
        self.bank_id = bank_id or settings.hindsight_bank_id
        self.timeout = settings.hindsight_timeout_seconds
        if client is not None:
            self.client = client
        else:
            options = {
                "base_url": settings.hindsight_base_url,
                "timeout": self.timeout,
                "max_attempts": 1,
            }
            if settings.hindsight_api_key:
                options["api_key"] = settings.hindsight_api_key
            self.client = Hindsight(**options)

    def retain_memory(self, content: str, context: str | None = None):
        return self.client.retain(bank_id=self.bank_id, content=content, context=context)

    def recall_memory(self, query: str, limit: int = 8) -> list[dict]:
        response = self.client.recall(bank_id=self.bank_id, query=query)
        results = getattr(response, "results", response if isinstance(response, list) else [])
        output = []
        for rank, item in enumerate(results[:limit], start=1):
            text = getattr(item, "text", None)
            if text is None and isinstance(item, dict):
                text = item.get("text", "")
            if text:
                output.append({"text": str(text), "rank": rank})
        return output


def retain_memory(content: str, context: str | None = None):
    return HindsightMemory().retain_memory(content, context)


def recall_memory(query: str, limit: int = 8) -> list[dict]:
    return HindsightMemory().recall_memory(query, limit)
