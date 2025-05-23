import { prisma } from "../../../config/db.config";
import { ITicketRepository } from "./interfaces/ticket.repository.interface";
import { SYSTEM_CONSTANTS } from "../../../constants/system";
import { generatePnrNumber } from "../../../shared/helpers/booking.helper";
import { BookingStatus } from "../../../core/types/booking";
import { BerthType } from "../../../../generated/prisma";
import { TicketResponseDto } from "../dtos/ticket-response.dto";
import { CreateTicketDto } from "../dtos/create-ticket.dto";

export class TicketRepository implements ITicketRepository {
  async create(ticketData: CreateTicketDto): Promise<TicketResponseDto> {
    return await prisma.$transaction(async (tx:any) => {
      // Create ticket
      const ticket = await tx.ticket.create({
        data: {
          pnrNumber: generatePnrNumber(),
          bookingStatus: "WAITING", // Will be updated after berth allocation
        },
      });

      // Create passengers
      const passengers = await Promise.all(
        ticketData.passengers.map((passenger) =>
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

      return {
        id: ticket.id,
        pnrNumber: ticket.pnrNumber,
        bookingStatus: ticket.bookingStatus as BookingStatus,
        passengers: passengers.map((p) => ({
          id: p.id,
          name: p.name,
          age: p.age,
          gender: p.gender as "MALE" | "FEMALE" | "OTHER",
          isChild: p.isChild,
        })),
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
      };
    });
  }

  async findById(id: number): Promise<TicketResponseDto | null> {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        passengers: true,
        berthAllocations: { include: { berth: true } },
      },
    });

    if (!ticket) return null;

    return {
      id: ticket.id,
      pnrNumber: ticket.pnrNumber,
      bookingStatus: ticket.bookingStatus as BookingStatus,
      passengers: ticket.passengers.map((p:any) => ({
        id: p.id,
        name: p.name,
        age: p.age,
        gender: p.gender as "MALE" | "FEMALE" | "OTHER",
        isChild: p.isChild,
      })),
      berthAllocations: ticket.berthAllocations.map((a:any) => ({
        berthNumber: a.berth.number,
        berthType: a.berth.type as BerthType,
        coach: a.berth.coach,
        passengerId: a.passengerId,
      })),
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }

  async updateStatus(
    id: number,
    status: BookingStatus
  ): Promise<TicketResponseDto> {
    const ticket = await prisma.ticket.update({
      where: { id },
      data: { bookingStatus: status },
      include: { passengers: true },
    });

    return {
      id: ticket.id,
      pnrNumber: ticket.pnrNumber,
      bookingStatus: ticket.bookingStatus as BookingStatus,
      passengers: ticket.passengers.map((p:any) => ({
        id: p.id,
        name: p.name,
        age: p.age,
        gender: p.gender as "MALE" | "FEMALE" | "OTHER",
        isChild: p.isChild,
      })),
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }

  async delete(id: number): Promise<void> {
    await prisma.ticket.delete({ where: { id } });
  }

  async getBookedTickets(): Promise<TicketResponseDto[]> {
    const tickets = await prisma.ticket.findMany({
      where: { bookingStatus: { in: ["CONFIRMED", "RAC"] } },
      include: {
        passengers: true,
        berthAllocations: { include: { berth: true } },
      },
    });

    return tickets.map((ticket) => ({
      id: ticket.id,
      pnrNumber: ticket.pnrNumber,
      bookingStatus: ticket.bookingStatus as BookingStatus,
      passengers: ticket.passengers.map((p:any) => ({
        id: p.id,
        name: p.name,
        age: p.age,
        gender: p.gender as "MALE" | "FEMALE" | "OTHER",
        isChild: p.isChild,
      })),
      berthAllocations: ticket.berthAllocations.map((a) => ({
        berthNumber: a.berth?.number as string,
        berthType: a.berth?.type as BerthType,
        coach: a.berth?.coach as string,
        passengerId: a.passengerId,
      })),
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    }));
  }

  async getAvailableCounts() {
    const counters = await prisma.systemCounter.findFirst();
    return {
      confirmed: counters?.confirmedAvailable || 0,
      rac: counters?.racAvailable || 0,
      waiting: counters?.waitingAvailable || 0,
    };
  }
}
