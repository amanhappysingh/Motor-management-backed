import { StatusCodes } from "http-status-codes";

interface ApiResponseParams {
  message?: string;
  data?: any;
  error?: any;
  metadata?: any;
}

export default class ApiResponse {
    readonly status: number;
    readonly message: string;
    readonly data?: any;
    readonly error?: any;
    readonly metadata?: any;

    constructor(status: number, { message = "", data, error, metadata }: ApiResponseParams) {
        this.status = status;
        this.message = message 
        this.data = data;
        this.error = error;
        this.metadata = metadata;
    }

    static ok({ message = "OK", data = null, metadata = null }: ApiResponseParams = {}): ApiResponse {
        return new ApiResponse(StatusCodes.OK, { message, data, metadata });
    }

    static conflict({ message = "Conflict", data = null, metadata = null }: ApiResponseParams = {}): ApiResponse {
        return new ApiResponse(StatusCodes.CONFLICT, { message, data, metadata });
    }

    static unauthorized({ message = "Unauthorized", error = null }: ApiResponseParams = {}): ApiResponse {
        return new ApiResponse(StatusCodes.UNAUTHORIZED, { message, error });
    }

    static forbidden({ message = "FORBIDDEN", error = null }: ApiResponseParams = {}): ApiResponse {
        return new ApiResponse(StatusCodes.FORBIDDEN, { message, error });
    }

    static notFound({ message = "Not Found", error = null }: ApiResponseParams = {}): ApiResponse {
        return new ApiResponse(StatusCodes.NOT_FOUND, { message, error });
    }

    static error({ message = "Internal Server Error", error = null }: ApiResponseParams = {}): ApiResponse {
        return new ApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, { message, error });
    }

    static created({ message = "Resource Created", data = null }: ApiResponseParams = {}): ApiResponse {
        return new ApiResponse(StatusCodes.CREATED, { message, data });
    }

    static noContent({ message = "No Content" }: ApiResponseParams = {}): ApiResponse {
        return new ApiResponse(StatusCodes.NO_CONTENT, { message });
    }

    static badRequest({ message = "Bad Request", error = null }: ApiResponseParams = {}): ApiResponse {
        return new ApiResponse(StatusCodes.BAD_REQUEST, { message, error });
    }

    getResponse() {
        const response: any = {
            message: this.message,
            status: this.status,
        };

        if (this.data) response.data = this.data;
        if (this.error) response.error = this.error;
        if (this.metadata) response.metadata = this.metadata;

        return response;
    }
}
