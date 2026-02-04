export class ApiResponse<T> {
  private constructor(
    public success: boolean,
    public statusCode: number,
    public message: string,
    public data?: T,
    public code?: string,
    public meta?: any
  ) { }

  static success<T>(params: {
    statusCode?: number;
    message?: string;
    data?: T;
    meta?: any;
  }) {
    return new ApiResponse<T>(
      true,
      params.statusCode ?? 200,
      params.message ?? "Success",
      params.data,
      undefined,
      params.meta
    );
  }

  static error(params: {
    statusCode: number;
    message: string;
    code?: string;
  }) {
    return new ApiResponse(
      false,
      params.statusCode,
      params.message,
      undefined,
      params.code
    );
  }
}
