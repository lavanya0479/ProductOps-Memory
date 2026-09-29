from datetime import datetime, timezone
from typing import Literal
from pydantic import BaseModel, Field, ConfigDict, field_validator

class TeachMemoryRequest(BaseModel):
    product: str = Field(..., min_length=1)
    productVersion: str = Field(..., min_length=1)
    issue: str = Field(..., min_length=1)

    whatHappened: str = Field(..., min_length=1)
    whatDidYouTry: str = Field(..., min_length=1)
    whatWorked: str = Field(..., min_length=1)
    whatFailed: str = Field(..., min_length=1)

    additionalContext: str = ""
    source: str = Field(..., min_length=1)


class RecallMemoryRequest(BaseModel):
    query: str = Field(..., min_length=1)


class MemoryResponse(BaseModel):
    success: bool
    message: str
    items_count: int = 0


class RecallMemoryItem(BaseModel):
    text: str
    rank: int


class RecallMemoryResponse(BaseModel):
    success: bool
    results: list[RecallMemoryItem]

class TeachRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    product: str = Field(min_length=1, max_length=120)
    version: str | None = Field(default=None, max_length=80)
    issue: str = Field(min_length=1, max_length=500)
    experience: str = Field(min_length=1, max_length=6000)
    source: Literal["team_experience", "official_knowledge", "historical_experience"] = "team_experience"
    context: str | None = Field(default=None, max_length=2000)
    customer_context: str | None = Field(default=None, max_length=500)
    @field_validator("version")
    @classmethod
    def valid_version(cls, value):
        return value or None


class RecallRequest(BaseModel):
    query: str = Field(min_length=1, max_length=2000)
    product: str | None = Field(default=None, max_length=120)
    limit: int = Field(default=8, ge=1, le=20)


class CorrectRequest(BaseModel):
    original_context: str = Field(min_length=1, max_length=1000)
    correction: str = Field(min_length=1, max_length=6000)
    product: str = Field(min_length=1, max_length=120)
    version: str | None = Field(default=None, max_length=80)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    product: str | None = Field(default=None, max_length=120)
    version: str | None = Field(default=None, max_length=80)


class MemoryResult(BaseModel):
    text: str
    rank: int | None = None
    source: str = "historical/team memory"


class RetainResponse(BaseModel):
    status: Literal["retained"]
    bank_id: str


class RecallResponse(BaseModel):
    memories: list[MemoryResult]
    has_relevant_memory: bool


class ChatResponse(RecallResponse):
    answer: str


class ErrorResponse(BaseModel):
    detail: str
    code: str


def utc_timestamp() -> str:
    return datetime.now(timezone.utc).isoformat()
