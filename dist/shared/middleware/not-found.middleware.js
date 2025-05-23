"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
const response_utils_1 = require("../utils/response.utils");
function notFoundHandler(req, res, next) {
    (0, response_utils_1.sendErrorResponse)(res, 'Endpoint not found', 404, 'NOT_FOUND');
}
