import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { env } from "../config/env.config";


// Cookie configuration constants
const ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  maxAge: env.jwt.expiresIn,
  path: '/',
};

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  maxAge: env.jwt.refreshExpiresIn,
  path: '/api/auth/refresh',
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  await AuthService.register(req.body);
  res.status(201).json(
    ApiResponse.success({ message: "Register success, please verify email" })
  );
});
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, code } = req.body;
  await AuthService.verifyEmail(email, code);
  res.json(ApiResponse.success({ message: "Email verified successfully" }));
});
export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  await AuthService.resendOtp(req.body.email);
  res.json(ApiResponse.success({ message: "OTP resent successfully" }));
});
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const authResponse = await AuthService.login({ email, password });
  // Set access token cookie
  res.cookie('accessToken', authResponse.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
  // Set refresh token cookie
  res.cookie('refreshToken', authResponse.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
  res.status(200).json(
    ApiResponse.success({
      message: "Login successful",
      data: authResponse.user,
    })
  );
});
export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(200).json(
      ApiResponse.success({ message: "Already logged out" })
    );
  }
  await AuthService.logout(req.user._id.toString());
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
  res.status(200).json(ApiResponse.success({ message: "Logout successful" }));
});
export const me = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});
