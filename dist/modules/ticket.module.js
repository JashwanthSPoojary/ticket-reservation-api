"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketModule = void 0;
const berth_service_1 = require("./berth/services/berth.service");
const ticket_controller_1 = require("./ticket/controllers/ticket.controller");
const ticket_repository_1 = require("./ticket/repositories/ticket.repository");
const ticket_service_1 = require("./ticket/services/ticket.service");
class TicketModule {
    static initialize() {
        const repository = new ticket_repository_1.TicketRepository();
        const berthService = new berth_service_1.BerthService();
        const service = new ticket_service_1.TicketService(repository, berthService);
        const controller = new ticket_controller_1.TicketController(service);
        return {
            repository,
            service,
            controller,
        };
    }
}
exports.TicketModule = TicketModule;
