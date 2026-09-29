from app.config import get_settings
from app.memory.hindsight import HindsightMemory
from app.models.schemas import TeachRequest, CorrectRequest, utc_timestamp
from app.services.llm import generate_answer


def format_experience(data: TeachRequest) -> str:
    fields = [
        "Knowledge category: " + {"team_experience": "TEAM-LEARNED KNOWLEDGE", "official_knowledge": "OFFICIAL KNOWLEDGE (as provided by user)", "historical_experience": "HISTORICAL EXPERIENCE"}[data.source],
        f"Product: {data.product}", f"Version: {data.version or 'unknown'}", f"Issue: {data.issue}",
        f"Experience and outcome: {data.experience}", f"Context: {data.context or 'not provided'}",
        f"Customer context: {data.customer_context or 'not provided'}", f"Recorded at: {utc_timestamp()}",
        "Knowledge status: current as reported; not independently verified",
    ]
    return "\n".join(fields)


class AgentService:
    def __init__(self, memory=None):
        self.memory = memory or HindsightMemory()

    def teach(self, data: TeachRequest):
        return self.memory.retain_memory(format_experience(data), context="ProductOps Memory employee-provided experience")

    def correct(self, data: CorrectRequest):
        content = "\n".join([
            "Knowledge category: UPDATED/CORRECTED KNOWLEDGE", f"Product: {data.product}",
            f"Version: {data.version or 'unknown'}", f"Supersedes: {data.original_context}",
            f"Correction: {data.correction}", f"Recorded at: {utc_timestamp()}",
            "Status: newer correction; prefer this information over the superseded workaround for applicable versions.",
        ])
        return self.memory.retain_memory(content, context="ProductOps Memory correction superseding prior knowledge")

    def recall(self, query: str, product: str | None = None, limit: int = 8):
        full_query = f"Product: {product}. {query}" if product else query
        return self.memory.recall_memory(full_query, limit)

    def chat(self, message: str, product: str | None = None, version: str | None = None):
        query = f"Product: {product or 'unspecified'}; version: {version or 'unspecified'}. {message}"
        memories = self.memory.recall_memory(query, 8)
        return generate_answer(message, memories, product, version), memories
