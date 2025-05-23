"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const error_codes_1 = require("../../../constants/error-codes");
const response_utils_1 = require("../../../shared/utils/response.utils");
class TicketController {
    ticketService;
    constructor(ticketService) {
        this.ticketService = ticketService;
    }
    async bookTicket(req, res) {
        try {
            const ticketData = req.body;
            const ticket = await this.ticketService.bookTicket(ticketData);
            (0, response_utils_1.sendSuccessResponse)(res, ticket, 201);
        }
        catch (error) {
            if (error instanceof Error) {
                (0, response_utils_1.sendErrorResponse)(res, error.message, 400, error_codes_1.ErrorCodes.VALIDATION_ERROR);
            }
            else {
                (0, response_utils_1.sendErrorResponse)(res, 'Internal server error', 500, error_codes_1.ErrorCodes.DATABASE_ERROR);
            }
        }
    }
    async cancelTicket(req, res) {
        try {
            const ticketId = parseInt(req.params.ticketId);
            if (isNaN(ticketId)) {
                throw new Error('Invalid ticket ID');
            }
            const result = await this.ticketService.cancelTicket(ticketId);
            (0, response_utils_1.sendSuccessResponse)(res, result);
        }
        catch (error) {
            if (error instanceof Error) {
                (0, response_utils_1.sendErrorResponse)(res, error.message, 400, error_codes_1.ErrorCodes.TICKET_NOT_FOUND);
            }
            else {
                (0, response_utils_1.sendErrorResponse)(res, 'Internal server error', 500, error_codes_1.ErrorCodes.DATABASE_ERROR);
            }
        }
    }
    async getBookedTickets(req, res) {
        try {
            const tickets = await this.ticketService.getBookedTickets();
            (0, response_utils_1.sendSuccessResponse)(res, tickets);
        }
        catch (error) {
            (0, response_utils_1.sendErrorResponse)(res, 'Internal server error', 500, error_codes_1.ErrorCodes.DATABASE_ERROR);
        }
    }
    async getAvailableTickets(req, res) {
        try {
            const availability = await this.ticketService.getAvailableTickets();
            (0, response_utils_1.sendSuccessResponse)(res, availability);
        }
        catch (error) {
            (0, response_utils_1.sendErrorResponse)(res, 'Internal server error', 500, error_codes_1.ErrorCodes.DATABASE_ERROR);
        }
    }
}
exports.TicketController = TicketController;
