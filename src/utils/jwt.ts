import jwt, {
  JwtPayload as DefaultJwtPayload,
  JsonWebTokenError,
  SignOptions,
  TokenExpiredError,
} from "jsonwebtoken";
import { randomUUID } from "crypto";
import { Roles } from "../core/types";
import env from "../config/env";

export interface AppJwtPayload extends DefaultJwtPayload {
  userId: string;
  role: Roles;
  permissions?: string[];
  iss: string;
  aud: string;
  jti: string;
  ip?: string;
  ua?: string;
}

export default class Jwt {
  private static readonly authSecretKey = env.AUTH_TOKEN;
  private static readonly refreshSecretKey = env.RF_TOKEN;

  private static readonly ACCESS_TOKEN_EXPIRY = "15m";
  private static readonly REFRESH_TOKEN_EXPIRY = "7d";
  private static readonly ISSUER = "motor-ews-system";
  private static readonly AUDIENCE = "web-client";

  static signAccessToken(
    userId: string,
    role: Roles,
    permissions?: string[],
    ip?: string,
    ua?: string
  ): string {
    const payload: AppJwtPayload = {
      userId: userId,
      role,
      permissions,
      iss: Jwt.ISSUER,
      aud: Jwt.AUDIENCE,
      jti: randomUUID(),
      ip,
      ua,
    };
    const options: SignOptions = {
      expiresIn: Jwt.ACCESS_TOKEN_EXPIRY,
      algorithm: "HS256",
    };
    return jwt.sign(payload, Jwt.authSecretKey, options);
  }

  static signRefreshToken(
    userId: string,
    role: Roles,
    ip?: string,
    ua?: string
  ): string {
    const payload: AppJwtPayload = {
      userId: userId,
      role,
      iss: Jwt.ISSUER,
      aud: Jwt.AUDIENCE,
      jti: randomUUID(),
      ip,
      ua,
    };
    const options: SignOptions = {
      expiresIn: Jwt.REFRESH_TOKEN_EXPIRY,
      algorithm: "HS256",
    };
    return jwt.sign(payload, Jwt.refreshSecretKey, options);
  }

  static verifyAccessToken(token: string): AppJwtPayload {
    try {
      return jwt.verify(token, Jwt.authSecretKey) as AppJwtPayload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new Error("Token expired");
      } else if (error instanceof JsonWebTokenError) {
        throw new Error("Invalid token");
      } else {
        throw error;
      }
    }
  }

  static verifyRefreshToken(token: string): AppJwtPayload {
    try {
      return jwt.verify(token, Jwt.refreshSecretKey) as AppJwtPayload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new Error("Token expired");
      } else if (error instanceof JsonWebTokenError) {
        throw new Error("Invalid token");
      } else {
        throw error;
      }
    }
  }

  static decode(token: string): AppJwtPayload | null {
    return jwt.decode(token) as AppJwtPayload | null;
  }
}
