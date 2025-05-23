"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
const app_exception_1 = require("../../../core/exceptions/app.exception");
const booking_helper_1 = require("../../../shared/helpers/booking.helper");
const ticket_validator_1 = require("../validators/ticket.validator");
const db_config_1 = require("../../../config/db.config");
const system_1 = require("../../../constants/system");
class TicketService {
    ticketRepository;
    berthService;
    constructor(ticketRepository, berthService) {
        this.ticketRepository = ticketRepository;
        this.berthService = berthService;
    }
    async bookTicket(ticketData) {
        // Validate input
        const validatedData = (0, ticket_validator_1.validateCreateTicket)(ticketData);
        return await db_config_1.prisma.$transaction(async (tx) => {
            // Check availability
            const counters = await tx.systemCounter.findFirst();
            if (!counters)
                throw new Error("System counters not found");
            const status = (0, booking_helper_1.calculateTicketStatus)(counters.confirmedAvailable, counters.racAvailable, counters.waitingAvailable);
            if (!status) {
                throw new app_exception_1.NoTicketsAvailableException();
            }
            // Create ticket
            const ticket = await tx.ticket.create({
                data: {
                    pnrNumber: (0, booking_helper_1.generatePnrNumber)(),
                    bookingStatus: status,
                },
            });
            // Create passengers
            const passengers = await Promise.all(validatedData.passengers.map((passenger) => tx.passenger.create({
                data: {
                    name: passenger.name,
                    age: passenger.age,
                    gender: passenger.gender,
                    isChild: passenger.age < system_1.SYSTEM_CONSTANTS.MIN_AGE_FOR_BERTH,
                    ticketId: ticket.id,
                },
            })));
            // Allocate berths if not waiting list
            if (status !== "WAITING") {
                await this.berthService.allocateBerthsInTransaction(tx, ticket.id, passengers.map((p) => ({
                    id: p.id,
                    name: p.name,
                    age: p.age,
                    gender: p.gender,
                })), status);
            }
            // Update system counters
            await tx.systemCounter.updateMany({
                data: {
                    confirmedAvailable: status === "CONFIRMED"
                        ? counters.confirmedAvailable - 1
                        : counters.confirmedAvailable,
                    racAvailable: status === "RAC"
                        ? counters.racAvailable - 1
                        : counters.racAvailable,
                    waitingAvailable: status === "WAITING"
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
            if (!completeTicket)
                throw new Error("Failed to fetch created ticket");
            return {
                id: completeTicket.id,
                pnrNumber: completeTicket.pnrNumber,
                bookingStatus: completeTicket.bookingStatus,
                passengers: completeTicket.passengers.map((p) => ({
                    id: p.id,
                    name: p.name,
                    age: p.age,
                    gender: p.gender,
                    isChild: p.isChild,
                })),
                berthAllocations: completeTicket.berthAllocations.map((a) => ({
                    berthNumber: a.berth?.number || "UNASSIGNED",
                    berthType: a.berth?.type || "UNASSIGNED",
                    coach: a.berth?.coach || "UNASSIGNED",
                    passengerId: a.passengerId,
                })),
                createdAt: completeTicket.createdAt,
                updatedAt: completeTicket.updatedAt,
            };
        });
    }
    getCounterUpdateData(status, operation) {
        const value = operation === "increment" ? 1 : -1;
        const updateData = {};
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
    async cancelTicket(ticketId) {
        // In a real implementation, we would handle RAC and waiting list promotions here
        const ticket = await this.ticketRepository.findById(ticketId);
        if (!ticket) {
            throw new Error("Ticket not found");
        }
        await this.ticketRepository.delete(ticketId);
        return ticket;
    }
    async getBookedTickets() {
        return await this.ticketRepository.getBookedTickets();
    }
    async getAvailableTickets() {
        return await this.ticketRepository.getAvailableCounts();
    }
}
exports.TicketService = TicketService;
