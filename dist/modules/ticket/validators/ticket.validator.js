"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateTicket = validateCreateTicket;
const create_ticket_dto_1 = require("../dtos/create-ticket.dto");
const system_1 = require("../../../constants/system");
const zod_1 = require("zod");
function validateCreateTicket(input) {
    // First validate with Zod schema
    const ticketData = create_ticket_dto_1.createTicketSchema.parse(input);
    // Additional business validations
    const childrenCount = ticketData.passengers.filter((p) => p.age < system_1.SYSTEM_CONSTANTS.MIN_AGE_FOR_BERTH).length;
    if (childrenCount > system_1.SYSTEM_CONSTANTS.MAX_CHILDREN_PER_TICKET) {
        throw new zod_1.z.ZodError([
            {
                code: 'custom',
                path: ['passengers'],
                message: `Maximum ${system_1.SYSTEM_CONSTANTS.MAX_CHILDREN_PER_TICKET} children under ${system_1.SYSTEM_CONSTANTS.MIN_AGE_FOR_BERTH} allowed per ticket`,
            },
        ]);
    }
    return ticketData;
}
