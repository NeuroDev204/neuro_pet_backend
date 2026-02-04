import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorCode } from "../errors/error-codes";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("ERROR 💥", err);

  // Business / known error
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(
      ApiResponse.error({
        statusCode: err.statusCode,
        message: err.message,
        code: err.code
      })
    );
  }

  // Unknown error
  return res.status(500).json(
    ApiResponse.error({
      statusCode: 500,
      message: "Internal server error",
      code: ErrorCode.INTERNAL_ERROR
    })
  );
};
