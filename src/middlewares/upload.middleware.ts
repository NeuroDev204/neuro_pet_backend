import { Request } from "express";
import multer from "multer";
import { ApiError } from "../errors/ApiError";
import { ErrorCode } from "../errors/error-codes";

const storage = multer.memoryStorage();
//file filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // accept images only
  if (!file.mimetype.startsWith('image/')) {
    return cb(new ApiError(ErrorCode.ONLY_IMAGES));
  }
  // check file size (5mb)
  if (file.size > 5 * 1024 * 1024) {
    return cb(new ApiError(ErrorCode.FILE_SIZE_TO_LARGE));
  }
  cb(null, true);
}
export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
}).single('avatar');
export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5 // max 5 files
  }
}).array('petImages', 5);