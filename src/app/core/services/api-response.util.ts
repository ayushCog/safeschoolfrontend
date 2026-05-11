export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function getApiResponseMessage<T>(response: ApiResponse<T>, fallback: string): string {
  const baseMessage = response.message || fallback;

  if (response.data != null) {
    if (typeof response.data === 'string') {
      return response.data || baseMessage;
    }

    if (typeof response.data === 'object' && 'message' in response.data) {
      const dataMessage = (response.data as any).message;
      if (typeof dataMessage === 'string' && dataMessage.trim().length > 0) {
        return dataMessage;
      }
    }
  }

  return baseMessage;
}

export function extractBackendErrorMessage(error: any, fallback: string): string {
  // Check if error has a response body with success: false
  if (error?.error && typeof error.error === 'object' && 'success' in error.error) {
    const backendError = error.error as ApiResponse<any>;
    if (!backendError.success) {
      return getApiResponseMessage(backendError, fallback);
    }
  }
  return fallback;
}
