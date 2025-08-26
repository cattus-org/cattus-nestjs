export function errorResponse(message: string) {
  return {
    success: false,
    message,
  };
}

export function successResponse<T>(data: T, message: string) {
  return {
    success: true,
    message,
    data,
  };
}
