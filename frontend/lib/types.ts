export interface ChatRequest {
  message: string;
}

export interface TeachMemoryRequest {
  product: string;
  productVersion: string;
  issue: string;
  whatHappened: string;
  whatDidYouTry: string;
  whatWorked: string;
  whatFailed: string;
  additionalContext: string;
  source: string;
}

export interface RecallMemoryRequest {
  query: string;
}

export interface CorrectMemoryRequest {
  product: string;
  productVersion: string;
  previousKnowledge: string;
  correction: string;
  additionalExplanation: string;
}

/*
 * Backend response types are intentionally not defined yet.
 *
 * The backend branch currently contains only README.md.
 * These response schemas will be added after the backend
 * contract is confirmed.
 */