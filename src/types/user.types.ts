import { IUser } from "../models/user.model";

export type UserRole = IUser["role"];
export type CreateUserDTO = Pick<IUser, "email" | "password" | "fullname"| "phone" | "address">;
export type UpdateUserDTO = Partial<Pick<IUser, "fullname" | "phone" | "address" |'avatarUrl' |'petImageUrls'>>;