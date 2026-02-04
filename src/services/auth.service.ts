import { IUser } from "../models/user.model";
import { UserRepository, UserDocument } from "../repositories/user.repository";
import { ApiError } from "../errors/ApiError";
import { ErrorCode } from "../errors/error-codes";
import { MailService } from "./mail.service";
import { generateOtp } from "../utils/generateOtp";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import { RegisterDTO, LoginDTO, AuthResponse } from "../types/auth.types";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export class AuthService {

  static async register(data: RegisterDTO): Promise<UserDocument> {
    const { email, password, fullname, phone, address } = data;

    // Check if email already exists
    const existed = await UserRepository.findByEmail(email);
    if (existed) {
      throw new ApiError(ErrorCode.EMAIL_ALREADY_EXISTS);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP for email verification
    const { otp, hashedOtp } = generateOtp();

    // Create user via repository
    const user = await UserRepository.create({
      email,
      password: hashedPassword,
      fullname,
      phone,
      address,
      isActive: false,
      isEmailVerified: false,
      emailVerificationCode: hashedOtp,
      emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send verification email
    await MailService.sendVerifyOtp(email, otp);

    return user;
  }
  static async verifyEmail(email: string, code: string): Promise<UserDocument> {
    // Hash the code for comparison
    const hashedCode = crypto
      .createHash("sha256")
      .update(code)
      .digest("hex");

    // Find user with matching verification code
    const user = await UserRepository.findByVerificationCode(email, hashedCode);

    if (!user) {
      throw new ApiError(ErrorCode.USER_NOT_FOUND);
    }

    if (!user.emailVerificationCode) {
      throw new ApiError(ErrorCode.NO_VERIFICATION_CODE);
    }

    if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
      throw new ApiError(ErrorCode.VERIFICATION_CODE_EXPIRED);
    }

    if (user.emailVerificationCode !== hashedCode) {
      throw new ApiError(ErrorCode.INVALID_VERIFICATION_CODE);
    }

    // Activate user
    user.isActive = true;
    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return user;
  }
  static async resendOtp(email: string): Promise<boolean> {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(ErrorCode.USER_NOT_FOUND);
    }

    if (user.isEmailVerified) {
      throw new ApiError(ErrorCode.USER_ALREADY_VERIFIED);
    }

    // Generate new OTP
    const { otp, hashedOtp } = generateOtp();
    user.emailVerificationCode = hashedOtp;
    user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send verification email
    await MailService.sendVerifyOtp(email, otp);

    return true;
  }
  static async login(loginData: LoginDTO): Promise<AuthResponse> {
    const { email, password } = loginData;

    if (!email || !password) {
      throw new ApiError(ErrorCode.EMAIL_PASSWORD_REQUIRED);
    }

    // Find user with password and refreshToken fields
    const user = await UserRepository.findByEmail(email, "+password +refreshToken");

    if (!user) {
      throw new ApiError(ErrorCode.INVALID_EMAIL_PASSWORD);
    }

    if (!user.isActive) {
      throw new ApiError(ErrorCode.EMAIL_NOT_VERIFIED);
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(ErrorCode.INVALID_EMAIL_PASSWORD);
    }

    // Update last login
    user.lastLogin = new Date();

    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      fullname: user.fullname,
      role: user.role,
    };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken({ userId: user._id });

    // Store hashed refresh token
    const hashedRefresh = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    user.refreshToken = hashedRefresh;
    await user.save();

    return {
      success: true,
      user: user,
      accessToken,
      refreshToken,
    };
  }
  static async logout(userId: string): Promise<boolean> {
    await UserRepository.clearRefreshToken(userId);
    return true;
  }
}
