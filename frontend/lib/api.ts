import type {
  ChatRequest,
  ChatResponse,
  TeachMemoryRequest,
  RecallMemoryRequest,
  RecallResponse,
  CorrectMemoryRequest,
  RetainResponse,
} from "./types";

const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: init?.signal ?? AbortSignal.timeout(55_000),
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new ApiError("The request took too long. Check the backend, Hindsight, and model service, then retry.", 0, "request_timeout");
    }
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("The request was cancelled. Please retry.", 0, "request_cancelled");
    }
    throw new ApiError(
      `Could not reach the API at ${API_BASE_URL}. Check that the backend is running and NEXT_PUBLIC_API_BASE_URL is correct.`,
      0,
      "network_error",
    );
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const code = typeof payload?.code === "string" ? payload.code : undefined;
    const message = code === "memory_unavailable"
      ? "Memory service unavailable. Check that Hindsight is running at the backend's HINDSIGHT_BASE_URL (default http://localhost:8888) and that any required API key is valid."
      : code === "llm_unavailable"
        ? "Language model unavailable. Check the backend LLM_API_KEY and optional LLM_BASE_URL settings."
        : typeof payload?.detail === "string"
          ? payload.detail
          : response.status === 401 || response.status === 403
            ? "Authentication is required to use this service."
            : `Request failed (${response.status}). Please try again.`;
    throw new ApiError(message, response.status, code);
  }

  return payload as T;
}

export async function chatWithAgent(request: ChatRequest) {
  return apiRequest<ChatResponse>("/api/chat", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function teachMemory(request: TeachMemoryRequest) {
  return apiRequest<RetainResponse>("/api/memory/teach", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function recallMemory(request: RecallMemoryRequest) {
  return apiRequest<RecallResponse>("/api/memory/recall", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function correctMemory(request: CorrectMemoryRequest) {
  return apiRequest<RetainResponse>("/api/memory/correct", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function checkBackendHealth() {
  return apiRequest<{ status: string }>("/health");
}
