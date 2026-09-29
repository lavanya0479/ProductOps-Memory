from fastapi import APIRouter
router = APIRouter()

@router.get("/health", tags=["health"], summary="Health check", response_description="Service is running")
def health():
    return {"status": "ok"}
