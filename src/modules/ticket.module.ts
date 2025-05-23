import { BerthService } from "./berth/services/berth.service";
import { TicketController } from "./ticket/controllers/ticket.controller";
import { TicketRepository } from "./ticket/repositories/ticket.repository";
import { TicketService } from "./ticket/services/ticket.service";


export class TicketModule {
  static initialize() {
    const repository = new TicketRepository();
    const berthService = new BerthService();
    const service = new TicketService(repository,berthService);
    const controller = new TicketController(service);

    return {
      repository,
      service,
      controller,
    };
  }
}