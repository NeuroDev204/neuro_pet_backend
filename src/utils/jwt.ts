import { env } from "../config/env.config";
import jwt from "jsonwebtoken";

/**
 * JWT Utilities
 * Token signing functions using centralized config.
 */

export const signAccessToken = (payload: object): string => {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn
  });
};

export const signRefreshToken = (payload: object): string => {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn
  });
};

export const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, env.jwt.secret);
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, env.jwt.refreshSecret);
};
