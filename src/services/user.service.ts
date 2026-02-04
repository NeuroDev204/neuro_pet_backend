import { url } from "node:inspector";
import { ApiError } from "../errors/ApiError";
import { ErrorCode } from "../errors/error-codes";
import { IUser, User } from "../models/user.model";
import { UserRepository } from "../repositories";
import { UpdateUserDTO, UserRole } from "../types/user.types";
import { CloudinaryService } from "./cloudinary.service";

export class UserService {
  static async updateUser(userId: string, payload: UpdateUserDTO): Promise<IUser> {
    if (!userId) {
      throw new ApiError(ErrorCode.USER_ID_IS_REQUIRED);
    }
    //filter undefined data
    const filteredData = Object.fromEntries(
      Object.entries(payload)
        .filter(([_, value]) => value !== undefined && value !== null)
    );
    if (Object.keys(filteredData).length === 0) {
      throw new ApiError(ErrorCode.NO_VALID_UPDATE_DATA_PROVIDE);
    }
    //update
    const updatedUser = await UserRepository.updateById(userId, {
      ...filteredData, updatedAt: new Date()
    });
    if (!updatedUser) throw new ApiError(ErrorCode.USER_NOT_FOUND);
    return updatedUser;
  }
  // get user by id voi optional fields
  static async getUserById(userId: string, selectFields?: string): Promise<IUser> {
    if (!userId) throw new ApiError(ErrorCode.USER_ID_IS_REQUIRED);
    const user = await UserRepository.findById(userId, selectFields);
    if (!user) throw new ApiError(ErrorCode.USER_NOT_FOUND);
    return user;
  }

  static async deleteUserByAdmin(userId: string, admin: IUser): Promise<string> {
    if (admin.role !== 'admin') throw new ApiError(ErrorCode.FORBIDDEN);
    if (admin._id.toString() === userId) throw new ApiError(ErrorCode.CANNOT_DELETE_YOURSELF);
    const user = await UserRepository.findById(userId);
    if (!user) throw new ApiError(ErrorCode.USER_NOT_FOUND);
    await UserRepository.deleteById(userId);
    return "User deleted successfully";
  }
  static async updateRoleByAdmin(userId: string, role: UserRole): Promise<IUser> {

    if (!userId) throw new ApiError(ErrorCode.USER_ID_IS_REQUIRED);
    const validRoles = ["customer", "admin"];
    if (!validRoles.includes(role)) throw new ApiError(ErrorCode.INVALID_ROLE);
    const updatedUser = await UserRepository.updateById(userId, {
      role,
      updatedAt: new Date(),
    });
    if (!updatedUser) throw new ApiError(ErrorCode.USER_NOT_FOUND);
    return updatedUser;
  }
  static async getAllUsers(
    page: number = 1,
    limit: number = 20,
    filters?: {
      role?: string,
      isActive?: boolean,
      isEmailVerified?: boolean,
      search?: string
    },
    sort?: { field: string, order: 'asc' | 'desc' }
  ): Promise<{ data: IUser[], total: number, meta: any }> {
    // validate pagination
    if (page < 1) page = 1;
    if (limit < 1) limit = 20;
    if (limit > 100) limit = 100;
    const result = await UserRepository.getAllUser(page, limit, filters, sort);
    const totalPages = Math.ceil(result.total / limit);
    return {
      data: result.data,
      total: result.total,
      meta: {
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        filters,
        sort
      }
    }
  }
  static async updateAvatar(userId: string, file: Express.Multer.File): Promise<IUser> {
    if (!file) throw new ApiError(ErrorCode.FILE_REQUIRED);
    // get current user
    const user = await UserRepository.findById(userId);
    if (!user) throw new ApiError(ErrorCode.USER_NOT_FOUND);
    //delete old avatar
    if (user.avatarUrl) {
      const oldPublicId = CloudinaryService.extractPublicId(user.avatarUrl);
      await CloudinaryService.deleteImage(oldPublicId);
    }
    //upload new avatar
    const { url } = await CloudinaryService.uploadImage(file, 'avatars');
    const updatedUser = await UserRepository.updateById(userId, {
      avatarUrl: url,
      updatedAt: new Date() 
    });
    if (!updatedUser) {
      throw new ApiError(ErrorCode.UPDATE_FAILED);
    }
    return updatedUser;
  }
}