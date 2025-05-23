import { ITicketService } from "./interfaces/ticket.service.interface";
import { NoTicketsAvailableException } from "../../../core/exceptions/app.exception";
import {
  calculateTicketStatus,
  generatePnrNumber,
} from "../../../shared/helpers/booking.helper";
import { ITicketRepository } from "../repositories/interfaces/ticket.repository.interface";
import { TicketResponseDto } from "../dtos/ticket-response.dto";
import { CreateTicketDto } from "../dtos/create-ticket.dto";
import { validateCreateTicket } from "../validators/ticket.validator";
import { IBerthService } from "../../berth/services/interfaces/berth.service.interface";
import { BerthType, BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "../../../config/db.config";
import { SYSTEM_CONSTANTS } from "../../../constants/system";

export class TicketService implements ITicketService {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly berthService: IBerthService
  ) {}

  async bookTicket(ticketData: CreateTicketDto): Promise<TicketResponseDto> {
    // Validate input
    const validatedData = validateCreateTicket(ticketData);

    return await prisma.$transaction(async (tx) => {
      // Check availability
      const counters = await tx.systemCounter.findFirst();
      if (!counters) throw new Error("System counters not found");

      const status = calculateTicketStatus(
        counters.confirmedAvailable,
        counters.racAvailable,
        counters.waitingAvailable
      );

      if (!status) {
        throw new NoTicketsAvailableException();
      }

      // Create ticket
      const ticket = await tx.ticket.create({
        data: {
          pnrNumber: generatePnrNumber(),
          bookingStatus: status,
        },
      });

      // Create passengers
      const passengers = await Promise.all(
        validatedData.passengers.map((passenger) =>
          tx.passenger.create({
            data: {
              name: passenger.name,
              age: passenger.age,
              gender: passenger.gender,
              isChild: passenger.age < SYSTEM_CONSTANTS.MIN_AGE_FOR_BERTH,
              ticketId: ticket.id,
            },
          })
        )
      );

      // Allocate berths if not waiting list
      if (status !== "WAITING") {
        await this.berthService.allocateBerthsInTransaction(
          tx,
          ticket.id,
          passengers.map((p) => ({
            id: p.id,
            name: p.name,
            age: p.age,
            gender: p.gender as "MALE" | "FEMALE" | "OTHER",
          })),
          status
        );
      }

      // Update system counters
      await tx.systemCounter.updateMany({
        data: {
          confirmedAvailable:
            status === "CONFIRMED"
              ? counters.confirmedAvailable - 1
              : counters.confirmedAvailable,
          racAvailable:
            status === "RAC"
              ? counters.racAvailable - 1
              : counters.racAvailable,
          waitingAvailable:
            status === "WAITING"
              ? counters.waitingAvailable - 1
              : counters.waitingAvailable,
        },
      });

      // Return complete ticket with allocations
      const completeTicket = await tx.ticket.findUnique({
        where: { id: ticket.id },
        include: {
          passengers: true,
          berthAllocations: {
            include: {
              berth: true,
            },
          },
        },
      });

      if (!completeTicket) throw new Error("Failed to fetch created ticket");

      return {
        id: completeTicket.id,
        pnrNumber: completeTicket.pnrNumber,
        bookingStatus: completeTicket.bookingStatus as BookingStatus,
        passengers: completeTicket.passengers.map((p) => ({
          id: p.id,
          name: p.name,
          age: p.age,
          gender: p.gender as "MALE" | "FEMALE" | "OTHER",
          isChild: p.isChild,
        })),
        berthAllocations: completeTicket.berthAllocations.map((a) => ({
          berthNumber: a.berth?.number || "UNASSIGNED",
          berthType: (a.berth?.type as BerthType) || "UNASSIGNED",
          coach: a.berth?.coach || "UNASSIGNED",
          passengerId: a.passengerId,
        })),
        createdAt: completeTicket.createdAt,
        updatedAt: completeTicket.updatedAt,
      };
    });
  }

  private getCounterUpdateData(
    status: BookingStatus,
    operation: "increment" | "decrement"
  ) {
    const value = operation === "increment" ? 1 : -1;

    const updateData: Prisma.SystemCounterUpdateInput = {};

    switch (status) {
      case "CONFIRMED":
        updateData.confirmedAvailable = { increment: value };
        break;
      case "RAC":
        updateData.racAvailable = { increment: value };
        break;
      case "WAITING":
        updateData.waitingAvailable = { increment: value };
        break;
    }

    return updateData;
  }

  async cancelTicket(ticketId: number): Promise<TicketResponseDto> {
    // In a real implementation, we would handle RAC and waiting list promotions here
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    await this.ticketRepository.delete(ticketId);
    return ticket;
  }

  async getBookedTickets(): Promise<TicketResponseDto[]> {
    return await this.ticketRepository.getBookedTickets();
  }

  async getAvailableTickets() {
    return await this.ticketRepository.getAvailableCounts();
  }
}
