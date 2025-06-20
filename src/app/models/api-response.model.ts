export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  path: string;
  details?: string[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiValidationError extends ApiError {
  validationErrors: ValidationError[];
}

export interface SuccessResponse<T = any> {
  data: T;
  message?: string;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
} 