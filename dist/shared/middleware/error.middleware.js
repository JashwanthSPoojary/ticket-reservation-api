"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const app_exception_1 = require("../../core/exceptions/app.exception");
const response_utils_1 = require("../utils/response.utils");
function errorHandler(err, req, res, next) {
    if (err instanceof app_exception_1.AppException) {
        (0, response_utils_1.sendErrorResponse)(res, err.message, err.getStatus(), err.errorCode, err.details);
    }
    else {
        console.error('Unhandled error:', err);
        (0, response_utils_1.sendErrorResponse)(res, 'Internal server error', 500, 'INTERNAL_SERVER_ERROR');
    }
}
