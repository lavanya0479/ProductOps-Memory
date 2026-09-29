import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.api.routes import health, memory, chat

settings = get_settings()
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logging.getLogger("app").setLevel(logging.INFO)
app = FastAPI(title="ProductOps Memory API", version="0.1.0", description="Persistent product support memory backed by Hindsight.")
app.add_middleware(CORSMiddleware, allow_origins=settings.allowed_origins, allow_methods=["GET", "POST"], allow_headers=["Content-Type", "Authorization"])
app.include_router(health.router)
app.include_router(memory.router)
app.include_router(chat.router)

@app.exception_handler(RequestValidationError)
async def validation_error(_request: Request, _exc: RequestValidationError):
    return JSONResponse(status_code=422, content={"detail": "Request body is invalid", "code": "invalid_request"})

@app.exception_handler(HTTPException)
async def http_error(_request: Request, exc: HTTPException):
    code = "service_unavailable" if exc.status_code == 503 else "request_error"
    if exc.headers and exc.headers.get("X-Error-Code"):
        code = exc.headers["X-Error-Code"]
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail, "code": code})

@app.exception_handler(Exception)
async def internal_error(_request: Request, _exc: Exception):
    return JSONResponse(status_code=500, content={"detail": "Internal server error", "code": "internal_error"})
