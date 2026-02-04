import { ApiError } from "../errors/ApiError";
import { ErrorCode } from "../errors/error-codes";
import { AdminService } from "../services/admin.service";
import { UserService } from "../services/user.service";
import { UpdateUserDTO, UserRole } from "../types/user.types";
import { ApiResponse, asyncHandler } from "../utils";
import { Request, Response } from "express";

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const payload: UpdateUserDTO = req.body;
  const updatedUser = await UserService.updateUser(userId, payload);
  res.json(ApiResponse.success({
    statusCode: 200,
    message: "User updated successfully",
    data: updatedUser
  }));
})
export const updateRoleByAdmin = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  const role: UserRole = req.body;
  const updatedUser = await UserService.updateRoleByAdmin(userId, role);
  res.json(ApiResponse.success({
    statusCode: 200,
    message: "User role updated successfully",
    data: updatedUser
  }));
});
export const findUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  const fields = req.query.fields as string // ? fields= name,email,avatar..
  const user = await UserService.getUserById(userId, fields);
  res.json(ApiResponse.success({
    statusCode: 200,
    data: user,
  }))
})

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  const result = await UserService.deleteUserByAdmin(userId, req.user!);
  res.status(200).json(
    ApiResponse.success({ message: result })
  );
});
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const filters: any = {};
  if (req.query.role) {
    filters.role = req.query.role;
  }
  if (req.query.isActive !== undefined) {
    filters.isActive = req.query.isActive === "true";
  }
  if (req.query.isEmailVerified !== undefined) {
    filters.search = req.query.search as string;
  }
  const sort = req.query.sortBy ? {
    field: req.query.sortBy as string,
    order: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
  } : undefined;
  const result = await UserService.getAllUsers(page, limit, filters, sort);
  res.json(ApiResponse.success({
    statusCode: 200,
    data: result.data,
    meta: result.meta
  }));
});
export const updateAvatar = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const file = req.file;
  if (!file) {
    throw new ApiError(ErrorCode.FILE_REQUIRED);
  }
  const updatedUser = await UserService.updateAvatar(userId, file);
  res.json(ApiResponse.success({
    statusCode: 200,
    message: 'Avatar updated successfully',
    data: {
      updatedUser
    }
  }))
})