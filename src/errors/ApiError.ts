import { ErrorCode } from "./error-codes";
import { ERROR_MAP } from "./error-map";

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  code: ErrorCode;

  constructor(code: ErrorCode) {
    super(ERROR_MAP[code].message);

    this.code = code;
    this.statusCode = ERROR_MAP[code].status;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
