import logging
import asyncio
from fastapi import APIRouter, HTTPException
from app.agent.service import AgentService
from app.models.schemas import ChatRequest, ChatResponse, MemoryResult
from app.services.llm import LLMUnavailable
from app.config import get_settings

router = APIRouter(prefix="/api", tags=["chat"])
log = logging.getLogger(__name__)

@router.post("/chat", response_model=ChatResponse, summary="Ask a question grounded in team memory")
async def chat(body: ChatRequest):
    try:
        settings = get_settings()
        answer, memories = await asyncio.wait_for(
            asyncio.to_thread(AgentService().chat, body.message, body.product, body.version),
            timeout=settings.ask_agent_timeout_seconds,
        )
        return ChatResponse(answer=answer, memories=[MemoryResult(**item) for item in memories], has_relevant_memory=bool(memories))
    except TimeoutError as exc:
        raise HTTPException(503, detail="Ask Agent timed out while contacting memory or the language model", headers={"X-Error-Code": "ask_agent_timeout"}) from exc
    except LLMUnavailable as exc:
        raise HTTPException(503, detail=str(exc), headers={"X-Error-Code": "llm_unavailable"}) from exc
    except Exception as exc:
        log.warning("Chat memory lookup failed: %s", type(exc).__name__)
        raise HTTPException(503, detail="Memory service is temporarily unavailable", headers={"X-Error-Code": "memory_unavailable"}) from exc
