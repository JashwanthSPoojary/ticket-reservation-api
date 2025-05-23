import { BookingStatus } from "../../../../../generated/prisma";
import { CreateTicketDto } from "../../dtos/create-ticket.dto";
import { TicketResponseDto } from "../../dtos/ticket-response.dto";

export interface ITicketRepository {
  create(ticketData: CreateTicketDto): Promise<TicketResponseDto>;
  findById(id: number): Promise<TicketResponseDto | null>;
  updateStatus(id: number, status: BookingStatus): Promise<TicketResponseDto>;
  delete(id: number): Promise<void>;
  getBookedTickets(): Promise<TicketResponseDto[]>;
  getAvailableCounts(): Promise<{
    confirmed: number;
    rac: number;
    waiting: number;
  }>;
}