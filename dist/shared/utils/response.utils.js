"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccessResponse = sendSuccessResponse;
exports.sendErrorResponse = sendErrorResponse;
function sendSuccessResponse(res, data, statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        data,
    });
}
function sendErrorResponse(res, message, statusCode = 400, errorCode, details) {
    return res.status(statusCode).json({
        success: false,
        error: {
            message,
            code: errorCode,
            details,
        },
    });
}
