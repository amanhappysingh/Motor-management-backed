"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
class ApiResponse {
    status;
    message;
    data;
    error;
    metadata;
    constructor(status, { message = "", data, error, metadata }) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.error = error;
        this.metadata = metadata;
    }
    static ok({ message = "OK", data = null, metadata = null } = {}) {
        return new ApiResponse(http_status_codes_1.StatusCodes.OK, { message, data, metadata });
    }
    static conflict({ message = "Conflict", data = null, metadata = null } = {}) {
        return new ApiResponse(http_status_codes_1.StatusCodes.CONFLICT, { message, data, metadata });
    }
    static unauthorized({ message = "Unauthorized", error = null } = {}) {
        return new ApiResponse(http_status_codes_1.StatusCodes.UNAUTHORIZED, { message, error });
    }
    static forbidden({ message = "FORBIDDEN", error = null } = {}) {
        return new ApiResponse(http_status_codes_1.StatusCodes.FORBIDDEN, { message, error });
    }
    static notFound({ message = "Not Found", error = null } = {}) {
        return new ApiResponse(http_status_codes_1.StatusCodes.NOT_FOUND, { message, error });
    }
    static error({ message = "Internal Server Error", error = null } = {}) {
        return new ApiResponse(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, { message, error });
    }
    static created({ message = "Resource Created", data = null } = {}) {
        return new ApiResponse(http_status_codes_1.StatusCodes.CREATED, { message, data });
    }
    static noContent({ message = "No Content" } = {}) {
        return new ApiResponse(http_status_codes_1.StatusCodes.NO_CONTENT, { message });
    }
    static badRequest({ message = "Bad Request", error = null } = {}) {
        return new ApiResponse(http_status_codes_1.StatusCodes.BAD_REQUEST, { message, error });
    }
    getResponse() {
        const response = {
            message: this.message,
            status: this.status,
        };
        if (this.data)
            response.data = this.data;
        if (this.error)
            response.error = this.error;
        if (this.metadata)
            response.metadata = this.metadata;
        return response;
    }
}
exports.default = ApiResponse;
//# sourceMappingURL=base-response.js.map