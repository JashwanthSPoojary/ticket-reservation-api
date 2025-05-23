"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = void 0;
var ErrorCodes;
(function (ErrorCodes) {
    // Ticket errors
    ErrorCodes["TICKET_NOT_FOUND"] = "TICKET_NOT_FOUND";
    ErrorCodes["NO_TICKETS_AVAILABLE"] = "NO_TICKETS_AVAILABLE";
    ErrorCodes["INVALID_TICKET_STATUS"] = "INVALID_TICKET_STATUS";
    // Passenger errors
    ErrorCodes["INVALID_PASSENGER_DATA"] = "INVALID_PASSENGER_DATA";
    ErrorCodes["TOO_MANY_CHILDREN"] = "TOO_MANY_CHILDREN";
    // System errors
    ErrorCodes["DATABASE_ERROR"] = "DATABASE_ERROR";
    ErrorCodes["VALIDATION_ERROR"] = "VALIDATION_ERROR";
})(ErrorCodes || (exports.ErrorCodes = ErrorCodes = {}));
