import { ApiResponse, PaginationMeta } from "../types/api-response";

type TransformOptions = {
  message: string;
  statusCode: number;
  success?: boolean;
  meta?: PaginationMeta;
};

export class ApiResponseTransformer {
  static transform<T>(data: T, options: TransformOptions): ApiResponse<T> {
    return {
      success: options.success ?? true,
      statusCode: options.statusCode,
      message: options.message,
      data,
      meta: options.meta,
      timestamp: new Date().toISOString(),
    };
  }

  static ok<T>(data: T, message = "Success"): ApiResponse<T> {
    return this.transform(data, { message, statusCode: 200 });
  }

  static created<T>(data: T, message = "Created"): ApiResponse<T> {
    return this.transform(data, { message, statusCode: 201 });
  }

  static paginated<T>(
    data: T,
    meta: PaginationMeta,
    message = "Success",
  ): ApiResponse<T> {
    return this.transform(data, { message, statusCode: 200, meta });
  }
}
