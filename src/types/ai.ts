/** Mirrors backend/internal/ai/provider.go Answer and SourceCitation, and
 * backend/internal/handler/ai_handler.go askRequest/askResponse. */

export interface SourceCitation {
  label: string;
  url?: string;
}

export interface AIAnswer {
  summary: string;
  data_observed: string;
  interpretation: string;
  alternative_scenarios: string;
  risks_and_limitations: string;
  what_to_watch: string;
  sources: SourceCitation[];
}

export interface AskRequest {
  question: string;
  ticker?: string;
}

export interface AskResponse {
  available: boolean;
  answer?: AIAnswer;
  message?: string;
}
