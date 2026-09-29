import logging
from fastapi import APIRouter, HTTPException
from app.agent.service import AgentService
from app.models.schemas import ChatRequest, ChatResponse, MemoryResult
from app.services.llm import LLMUnavailable

router = APIRouter(prefix="/api", tags=["chat"])
log = logging.getLogger(__name__)

@router.post("/chat", response_model=ChatResponse, summary="Ask a question grounded in team memory")
def chat(body: ChatRequest):
    try:
        answer, memories = AgentService().chat(body.message, body.product, body.version)
        return ChatResponse(answer=answer, memories=[MemoryResult(**item) for item in memories], has_relevant_memory=bool(memories))
    except LLMUnavailable as exc:
        raise HTTPException(503, detail=str(exc), headers={"X-Error-Code": "llm_unavailable"}) from exc
    except Exception as exc:
        log.warning("Chat memory lookup failed: %s", type(exc).__name__)
        raise HTTPException(503, detail="Memory service is temporarily unavailable", headers={"X-Error-Code": "memory_unavailable"}) from exc
