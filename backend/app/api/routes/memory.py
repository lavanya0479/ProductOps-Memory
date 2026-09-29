import logging
from fastapi import APIRouter, HTTPException
from app.agent.service import AgentService
from app.config import get_settings
from app.models.schemas import TeachRequest, RecallRequest, CorrectRequest, RetainResponse, RecallResponse, MemoryResult

router = APIRouter(prefix="/api/memory", tags=["memory"])
log = logging.getLogger(__name__)

def _service():
    return AgentService()

@router.post("/teach", response_model=RetainResponse, summary="Teach a product experience")
def teach(body: TeachRequest):
    try:
        _service().teach(body)
        return RetainResponse(status="retained", bank_id=get_settings().hindsight_bank_id)
    except Exception as exc:
        log.warning("Hindsight retain failed: %s", type(exc).__name__)
        raise HTTPException(503, detail="Memory service is temporarily unavailable", headers={"X-Error-Code": "memory_unavailable"}) from exc

@router.post("/correct", response_model=RetainResponse, summary="Correct or supersede product knowledge")
def correct(body: CorrectRequest):
    try:
        _service().correct(body)
        return RetainResponse(status="retained", bank_id=get_settings().hindsight_bank_id)
    except Exception as exc:
        log.warning("Hindsight correction retain failed: %s", type(exc).__name__)
        raise HTTPException(503, detail="Memory service is temporarily unavailable", headers={"X-Error-Code": "memory_unavailable"}) from exc

@router.post("/recall", response_model=RecallResponse, summary="Recall relevant product experiences")
def recall(body: RecallRequest):
    try:
        memories = _service().recall(body.query, body.product, body.limit)
        return RecallResponse(memories=[MemoryResult(**item) for item in memories], has_relevant_memory=bool(memories))
    except Exception as exc:
        log.warning("Hindsight recall failed: %s", type(exc).__name__)
        raise HTTPException(503, detail="Memory service is temporarily unavailable", headers={"X-Error-Code": "memory_unavailable"}) from exc
