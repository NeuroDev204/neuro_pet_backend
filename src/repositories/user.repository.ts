import { User, IUser } from '../models/user.model';
import { HydratedDocument } from 'mongoose';
import { CreateUserDTO } from '../types/user.types';

export type UserDocument = HydratedDocument<IUser>;

export class UserRepository {
  static async findByEmail(email: string, selectFields?: string): Promise<UserDocument | null> {
    const query = User.findOne({ email: email.toLowerCase() });
    if (selectFields) {
      return query.select(selectFields).exec() as Promise<UserDocument | null>;
    }
    return query.exec() as Promise<UserDocument | null>;
  }
  static async findById(id: string, selectFields?: string): Promise<UserDocument | null> {
    const query = User.findById(id);
    if (selectFields) {
      return query.select(selectFields).exec() as Promise<UserDocument | null>;
    }
    return query.exec() as Promise<UserDocument | null>;
  }
  static async findByIdLean(id: string, excludeFields?: string): Promise<IUser | null> {
    const query = User.findById(id);
    if (excludeFields) {
      return query.select(excludeFields).lean().exec() as Promise<IUser | null>;
    }
    return query.lean().exec() as Promise<IUser | null>;
  }
  static async create(data: CreateUserDTO & Partial<IUser>): Promise<UserDocument> {
    return User.create(data) as Promise<UserDocument>;
  }
  static async updateById(
    id: string,
    update: Partial<IUser>
  ): Promise<UserDocument | null> {
    return User.findByIdAndUpdate(id, update, { new: true }).exec() as Promise<UserDocument | null>;
  }
  static async findOne(
    filter: Record<string, unknown>,
    selectFields?: string
  ): Promise<UserDocument | null> {
    const query = User.findOne(filter);
    if (selectFields) {
      return query.select(selectFields).exec() as Promise<UserDocument | null>;
    }
    return query.exec() as Promise<UserDocument | null>;
  }
  static async findByVerificationCode(
    email: string,
    hashedCode: string
  ): Promise<UserDocument | null> {
    return User.findOne({
      email,
      emailVerificationCode: hashedCode,
      emailVerificationExpires: { $gt: Date.now() }
    }).select('+emailVerificationCode').exec() as Promise<UserDocument | null>;
  }
  static async emailExists(email: string): Promise<boolean> {
    const user = await User.findOne({ email: email.toLowerCase() }).select('_id').lean();
    return !!user;
  }

  static async clearRefreshToken(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }
  static async deleteById(userId: string): Promise<void> {
    await User.findByIdAndDelete(userId);
  }
  static async getAllUser(
    page = 1,
    limit = 20,
    filters?: {
      role?: string,
      isActive?: boolean,
      isEmailVerified?: boolean,
      search?: string
    },
    sort?: { field: string, order: 'asc' | 'desc' }
  ): Promise<{ data: IUser[], total: number }> {
    const skip = (page - 1) * limit;

    //build query filter
    const query: any = {};
    if (filters?.role) query.role = filters.role;
    if (filters?.isActive !== undefined) query.isActive = filters.isActive;
    if (filters?.isEmailVerified !== undefined) query.isEmailVerified = filters.isEmailVerified;
    if (filters?.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } }
      ];
    }
    // build sort
    const sortObj: any = {};
    if (sort?.field) {
      sortObj[sort.field] = sort.order === 'desc' ? -1 : 1;
    } else {
      sortObj.createdAt = -1; // defalut new first
    }
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -refreshToken -emailVerificationCode')
        .skip(skip)
        .limit(limit)
        .sort(sortObj)
        .lean(),
      User.countDocuments(query)
    ]);
    return { data: users, total }
  }
}
