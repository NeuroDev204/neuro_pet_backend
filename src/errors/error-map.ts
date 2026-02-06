import { ErrorCode } from "./error-codes";

export const ERROR_MAP: Record<
  ErrorCode,
  { status: number; message: string }
> = {
  [ErrorCode.EMAIL_ALREADY_EXISTS]: {
    status: 400,
    message: "Email already exists"
  },

  [ErrorCode.INVALID_CREDENTIALS]: {
    status: 400,
    message: "Invalid email or password"
  },

  [ErrorCode.EMAIL_NOT_VERIFIED]: {
    status: 403,
    message: "Please verify email first"
  },

  [ErrorCode.INVALID_VERIFICATION_CODE]: {
    status: 400,
    message: "Invalid verification code"
  },
  [ErrorCode.NO_VALID_UPDATE_DATA_PROVIDE]: {
    status: 400,
    message: "No valid update data provided"
  },
  [ErrorCode.USER_ID_IS_REQUIRED]: {
    status: 400,
    message: "UserId Is Required"
  },
  [ErrorCode.VERIFICATION_CODE_EXPIRED]: {
    status: 400,
    message: "Verification code expired"
  },

  [ErrorCode.USER_NOT_FOUND]: {
    status: 404,
    message: "User not found"
  },

  [ErrorCode.UNAUTHORIZED]: {
    status: 401,
    message: "Unauthorized"
  },

  [ErrorCode.FORBIDDEN]: {
    status: 403,
    message: "Forbidden"
  },

  [ErrorCode.VALIDATION_ERROR]: {
    status: 400,
    message: "Validation error"
  },
  [ErrorCode.NO_VERIFICATION_CODE]: {
    status: 400,
    message: "No verification code"
  },
  [ErrorCode.USER_ALREADY_VERIFIED]: {
    status: 400,
    message: "User already verified"
  },
  [ErrorCode.EMAIL_PASSWORD_REQUIRED]: {
    status: 400,
    message: "Email and password are required"
  },
  [ErrorCode.INVALID_EMAIL_PASSWORD]: {
    status: 400,
    message: "Invalid email or password"
  },
  [ErrorCode.INVALID_ROLE]: {
    status: 400,
    message: "Invalid role"
  },
  [ErrorCode.UPLOAD_FAILED]: {
    status: 400,
    message: "Upload failed"
  },
  [ErrorCode.ONLY_IMAGES]: {
    status: 400,
    message: "Only image files are allowed!"
  },
  [ErrorCode.FILE_SIZE_TO_LARGE]: {
    status: 400,
    message: "File size cannot exceed 5MB"
  },
  [ErrorCode.FILE_REQUIRED]: {
    status: 400,
    message: "File required"
  },
  [ErrorCode.CANNOT_DELETE_YOURSELF]: {
    status: 403,
    message: "Cannot  delete yourself"
  },
  [ErrorCode.UPDATE_FAILED]: {
    status: 400,
    message: 'Update failed'
  },
  [ErrorCode.INTERNAL_ERROR]: {
    status: 500,
    message: "Internal server error"
  },
  [ErrorCode.MISSING_REQUIRED_FIELD]: {
    status: 400,
    message: "Missing required field"
  },
  [ErrorCode.AGE_BE_A_POSITIVE]: {
    status: 400,
    message: "Age must be a positive number"
  },
  [ErrorCode.INVALID_SPECIES]: {
    status: 400,
    message: "Invalid species"
  },
  [ErrorCode.INVALID_GENDER]: {
    status: 400,
    message: "Invalid gender"
  }
};
