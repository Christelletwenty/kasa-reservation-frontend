export interface ApiError {
  error: string;
  statusCode?: number;
  details?: unknown;
}

export interface ValidationError extends ApiError {
  details?: Record<string, string>;
}
