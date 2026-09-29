import logging
from time import monotonic
from app.config import get_settings
from app.memory.hindsight import HindsightMemory
from app.memory.sqlite import SQLiteMemory
from app.models.schemas import TeachRequest, CorrectRequest, utc_timestamp
from app.services.llm import generate_answer

log = logging.getLogger(__name__)


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
        if memory is not None:
            self.memory = memory
        elif get_settings().memory_backend.lower() == "sqlite":
            self.memory = SQLiteMemory(get_settings().memory_db_path)
        else:
            self.memory = HindsightMemory()

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
        settings = get_settings()
        started = monotonic()
        log.info("Ask Agent recall started (memory_backend=%s, bank=%s)", settings.memory_backend, settings.hindsight_bank_id)
        try:
            memories = self.memory.recall_memory(query, 8)
        except Exception:
            log.exception("Ask Agent recall failed after %.2fs", monotonic() - started)
            raise
        log.info("Ask Agent recall completed in %.2fs (%s memories)", monotonic() - started, len(memories))

        llm_started = monotonic()
        log.info("Ask Agent answer generation started (provider=%s)", settings.llm_provider)
        try:
            answer = generate_answer(message, memories, product, version)
        except Exception:
            log.exception("Ask Agent answer generation failed after %.2fs", monotonic() - llm_started)
            raise
        log.info("Ask Agent answer generation completed in %.2fs", monotonic() - llm_started)
        return answer, memories
