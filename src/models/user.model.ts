import { model, Schema, Types, Document } from "mongoose";

// ============= INTERFACES =============

export interface IUserAddress {
  street: string;
  city: string;
  district: string;
  country: string;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  fullname: string;
  avatarUrl: string;
  petImageUrls: string[];
  phone: string;
  address?: IUserAddress;
  role: "customer" | "admin";
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationCode?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============= SCHEMAS =============

const userAddressSchema = new Schema<IUserAddress>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    country: { type: String, default: "Vietnam" },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    petImageUrls: {
      type: [String],
      default: [],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[+]?[\d\s\-()]+$/, "Please provide a valid phone number"],
    },
    address: {
      type: userAddressSchema,
      required: false,
    },
    role: {
      type: String,
      enum: {
        values: ["customer", "admin"],
        message: "{VALUE} is not a valid role",
      },
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCode: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        const result = ret as Record<string, unknown>;
        delete result.password;
        delete result.__v;
        delete result.emailVerificationCode;
        delete result.passwordResetToken;
        delete result.passwordResetExpires;
        delete result.refreshToken;
        return result;
      },
    },
  }
);

// ============= INDEXES =============


userSchema.index({ phone: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ role: 1, isActive: 1 });

// ============= MODEL =============

export const User = model<IUser>("User", userSchema);

