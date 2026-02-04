import { IUser, IUserAddress } from '../models/user.model';

// ============= AUTH DTOs =============

export interface RegisterDTO {
    email: string;
    password: string;
    fullname: string;
    phone: string;
    address?: IUserAddress;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface VerifyEmailDTO {
    email: string;
    code: string;
}

export interface ResendOtpDTO {
    email: string;
}

// ============= AUTH RESPONSES =============

export interface AuthResponse {
    success: boolean;
    user: Partial<IUser>;
    accessToken: string;
    refreshToken: string;
}

export interface TokenPayload {
    userId: string;
    email: string;
    fullname: string;
    role: string;
}

export interface RefreshTokenPayload {
    userId: string;
}
