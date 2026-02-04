import cloudinary from "../config/cloudinary.config";
import { UploadApiResponse } from "cloudinary";
import { ApiError } from "../errors/ApiError";
import { ErrorCode } from "../errors/error-codes";

export class CloudinaryService {
  // upload single image
  static async uploadImage(
    file: Express.Multer.File,
    folder: string = 'avatars'
  ): Promise<{ url: string, publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `pet-care/${folder}`,
          resource_type: 'image',
          transformation: [
            { width: 500, height: 500, crop: 'fill', gravity: 'face' },
            { qualiti: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new ApiError(ErrorCode.UPLOAD_FAILED));
          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      );
      uploadStream.end(file.buffer);
    })
  }
  static async deleteImage(publicId: string): Promise<void>{
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Failed to delete image from cloudinary:", error);
    }
  }
  static async uploadMultipleImages(
    files: Express.Multer.File[],
    folder: string = 'pets'
  ): Promise<Array<{ url: string; publicId: string }>>{
    const uploadPromises = files.map(file => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }
  static extractPublicId(url: string): string{
    const matches = url.match(/\/v\d+\/(.+)\.\w+$/);
    return matches ? matches[1] : '';
  }
}