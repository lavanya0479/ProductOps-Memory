from fastapi import APIRouter, HTTPException

from app.memory.hindsight import HindsightMemory
from app.models.schemas import (
    TeachMemoryRequest,
    RecallMemoryRequest,
    MemoryResponse,
    RecallMemoryResponse,
)


router = APIRouter(
    prefix="/api/memory",
    tags=["memory"],
)


@router.post("/teach", response_model=MemoryResponse)
def teach_memory(request: TeachMemoryRequest):
    """
    Store a new product experience in Hindsight.
    """

    try:
        memory = HindsightMemory()

        content = f"""
Product: {request.product}
Product Version: {request.productVersion}

Issue:
{request.issue}

What happened:
{request.whatHappened}

What was tried:
{request.whatDidYouTry}

What worked:
{request.whatWorked}

What failed:
{request.whatFailed}

Additional context:
{request.additionalContext}

Source:
{request.source}
""".strip()

        result = memory.retain_memory(
            content=content,
            context=f"{request.product} - {request.productVersion}"
        )

        if not getattr(result, "success", False):
            raise HTTPException(
                status_code=502,
                detail="Hindsight could not store the memory"
            )

        return MemoryResponse(
            success=True,
            message="Knowledge added to organizational memory",
            items_count=getattr(result, "items_count", 0),
        )

    except HTTPException:
        raise

    except Exception as exc:
        print(f"Memory retain error: {exc}")

        raise HTTPException(
            status_code=502,
            detail="Unable to store knowledge in organizational memory"
        )


@router.post("/recall", response_model=RecallMemoryResponse)
def recall_memory(request: RecallMemoryRequest):
    """
    Search organizational memory using Hindsight.
    """

    try:
        memory = HindsightMemory()

        results = memory.recall_memory(
            query=request.query,
            limit=8,
        )

        return RecallMemoryResponse(
            success=True,
            results=results,
        )

    except Exception as exc:
        print(f"Memory recall error: {exc}")

        raise HTTPException(
            status_code=502,
            detail="Unable to search organizational memory"
        )