import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import ApiResponse from "../core/base-response";
import env from "../config/env";
import { tokenPayload, Roles } from "../core/types";


export const verifyTokenAndRole = (allowedRoles: Roles[] = []) => (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = (req.headers.authorization || req.headers.Authorization) as string | undefined;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(StatusCodes.UNAUTHORIZED).json(ApiResponse.unauthorized({ message: "Authorization header missing or malformed" }));
        return;
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json(ApiResponse.unauthorized({ message: "Token missing" }));
        return;
      }

      const decoded = jwt.verify(token, env.AUTH_TOKEN) as tokenPayload;

      if (!decoded || !decoded.userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(ApiResponse.unauthorized({ message: "Invalid token payload" }));
        return;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        res.status(StatusCodes.FORBIDDEN).json(ApiResponse.forbidden({ message: "Insufficient role permissions" }));
        return;
      }

      req.user = { userId: decoded.userId, role: decoded.role };

      next();
      
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        res.status(StatusCodes.UNAUTHORIZED).json(ApiResponse.unauthorized({ message: "Token expired" }));
        return;
      }

      if (error instanceof JsonWebTokenError) {
        res.status(StatusCodes.UNAUTHORIZED).json(ApiResponse.unauthorized({ message: "Invalid token" }));
        return;
      }

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ApiResponse.error({ message: "Authentication failed" }));
    }
  };
