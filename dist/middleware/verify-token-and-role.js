"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenAndRole = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const base_response_1 = __importDefault(require("../core/base-response"));
const env_1 = __importDefault(require("../config/env"));
const verifyTokenAndRole = (allowedRoles = []) => (req, res, next) => {
    try {
        const authHeader = (req.headers.authorization || req.headers.Authorization);
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(base_response_1.default.unauthorized({ message: "Authorization header missing or malformed" }));
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(base_response_1.default.unauthorized({ message: "Token missing" }));
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.AUTH_TOKEN);
        if (!decoded || !decoded.userId) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(base_response_1.default.unauthorized({ message: "Invalid token payload" }));
            return;
        }
        if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
            res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json(base_response_1.default.forbidden({ message: "Insufficient role permissions" }));
            return;
        }
        req.user = { userId: decoded.userId, role: decoded.role };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(base_response_1.default.unauthorized({ message: "Token expired" }));
            return;
        }
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(base_response_1.default.unauthorized({ message: "Invalid token" }));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(base_response_1.default.error({ message: "Authentication failed" }));
    }
};
exports.verifyTokenAndRole = verifyTokenAndRole;
//# sourceMappingURL=verify-token-and-role.js.map