import { CreateTicketDto } from '../../dtos/create-ticket.dto';
import { TicketResponseDto } from '../../dtos/ticket-response.dto';

export interface ITicketService {
  bookTicket(ticketData: CreateTicketDto): Promise<TicketResponseDto>;
  cancelTicket(ticketId: number): Promise<TicketResponseDto>;
  getBookedTickets(): Promise<TicketResponseDto[]>;
  getAvailableTickets(): Promise<{
    confirmed: number;
    rac: number;
    waiting: number;
  }>;
}