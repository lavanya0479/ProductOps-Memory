export interface ChatRequest {
  message: string;
  product?: string;
  version?: string;
}

export interface MemoryResult {
  text: string;
  rank: number | null;
  source: string;
}

export interface RecallResponse {
  memories: MemoryResult[];
  has_relevant_memory: boolean;
}

export interface ChatResponse extends RecallResponse {
  answer: string;
}

export interface RetainResponse {
  status: "retained";
  bank_id: string;
}

export type MemorySource =
  | "team_experience"
  | "official_knowledge"
  | "historical_experience";

export interface TeachMemoryRequest {
  product: string;
  version?: string;
  issue: string;
  experience: string;
  source?: MemorySource;
  context?: string;
  customer_context?: string;
}

export interface RecallMemoryRequest {
  query: string;
  product?: string;
  limit?: number;
}

export interface CorrectMemoryRequest {
  original_context: string;
  correction: string;
  product: string;
  version?: string;
}
