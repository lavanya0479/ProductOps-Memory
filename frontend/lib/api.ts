import type {
  ChatRequest,
  TeachMemoryRequest,
  RecallMemoryRequest,
  CorrectMemoryRequest,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function handleResponse(response: Response) {
  if (!response.ok) {
    let message = "Something went wrong";

    try {
      const errorData = await response.json();

      if (typeof errorData?.detail === "string") {
        message = errorData.detail;
      } else if (typeof errorData?.message === "string") {
        message = errorData.message;
      }
    } catch {
      // Backend did not return JSON
    }

    throw new Error(message);
  }

  return response.json();
}

export async function chatWithAgent(request: ChatRequest) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return handleResponse(response);
}

export async function teachMemory(request: TeachMemoryRequest) {
  const response = await fetch(`${API_BASE_URL}/api/memory/teach`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return handleResponse(response);
}

export async function recallMemory(request: RecallMemoryRequest) {
  const response = await fetch(`${API_BASE_URL}/api/memory/recall`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return handleResponse(response);
}

export async function correctMemory(request: CorrectMemoryRequest) {
  const response = await fetch(`${API_BASE_URL}/api/memory/correct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return handleResponse(response);
}

export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);

  return handleResponse(response);
}