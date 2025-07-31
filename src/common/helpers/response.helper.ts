export function errorResponse(code: string, message: string, details?: string) {
  return {
    success: false,
    message,
    error: {
      code,
      details,
    },
  };
}

export function successResponse<T>(data: T, message: string) {
  return {
    success: true,
    message,
    data,
  };
}
