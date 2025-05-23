"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationException = exports.NoTicketsAvailableException = exports.NotFoundException = exports.AppException = void 0;
const common_1 = require("@nestjs/common");
const error_codes_1 = require("../../constants/error-codes");
class AppException extends common_1.HttpException {
    errorCode;
    details;
    constructor(message, status, errorCode, details) {
        super(message, status);
        this.errorCode = errorCode;
        this.details = details;
    }
}
exports.AppException = AppException;
class NotFoundException extends AppException {
    constructor(entity, details) {
        super(`${entity} not found`, common_1.HttpStatus.NOT_FOUND, error_codes_1.ErrorCodes.TICKET_NOT_FOUND, details);
    }
}
exports.NotFoundException = NotFoundException;
class NoTicketsAvailableException extends AppException {
    constructor() {
        super('No tickets available', common_1.HttpStatus.BAD_REQUEST, error_codes_1.ErrorCodes.NO_TICKETS_AVAILABLE);
    }
}
exports.NoTicketsAvailableException = NoTicketsAvailableException;
class ValidationException extends AppException {
    constructor(errors) {
        super('Validation failed', common_1.HttpStatus.BAD_REQUEST, error_codes_1.ErrorCodes.VALIDATION_ERROR, errors);
    }
}
exports.ValidationException = ValidationException;
