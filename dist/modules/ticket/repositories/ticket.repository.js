"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketRepository = void 0;
const db_config_1 = require("../../../config/db.config");
const system_1 = require("../../../constants/system");
const booking_helper_1 = require("../../../shared/helpers/booking.helper");
class TicketRepository {
    async create(ticketData) {
        return await db_config_1.prisma.$transaction(async (tx) => {
            // Create ticket
            const ticket = await tx.ticket.create({
                data: {
                    pnrNumber: (0, booking_helper_1.generatePnrNumber)(),
                    bookingStatus: "WAITING", // Will be updated after berth allocation
                },
            });
            // Create passengers
            const passengers = await Promise.all(ticketData.passengers.map((passenger) => tx.passenger.create({
                data: {
                    name: passenger.name,
                    age: passenger.age,
                    gender: passenger.gender,
                    isChild: passenger.age < system_1.SYSTEM_CONSTANTS.MIN_AGE_FOR_BERTH,
                    ticketId: ticket.id,
                },
            })));
            return {
                id: ticket.id,
                pnrNumber: ticket.pnrNumber,
                bookingStatus: ticket.bookingStatus,
                passengers: passengers.map((p) => ({
                    id: p.id,
                    name: p.name,
                    age: p.age,
                    gender: p.gender,
                    isChild: p.isChild,
                })),
                createdAt: ticket.createdAt,
                updatedAt: ticket.updatedAt,
            };
        });
    }
    async findById(id) {
        const ticket = await db_config_1.prisma.ticket.findUnique({
            where: { id },
            include: {
                passengers: true,
                berthAllocations: { include: { berth: true } },
            },
        });
        if (!ticket)
            return null;
        return {
            id: ticket.id,
            pnrNumber: ticket.pnrNumber,
            bookingStatus: ticket.bookingStatus,
            passengers: ticket.passengers.map((p) => ({
                id: p.id,
                name: p.name,
                age: p.age,
                gender: p.gender,
                isChild: p.isChild,
            })),
            berthAllocations: ticket.berthAllocations.map((a) => ({
                berthNumber: a.berth.number,
                berthType: a.berth.type,
                coach: a.berth.coach,
                passengerId: a.passengerId,
            })),
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
        };
    }
    async updateStatus(id, status) {
        const ticket = await db_config_1.prisma.ticket.update({
            where: { id },
            data: { bookingStatus: status },
            include: { passengers: true },
        });
        return {
            id: ticket.id,
            pnrNumber: ticket.pnrNumber,
            bookingStatus: ticket.bookingStatus,
            passengers: ticket.passengers.map((p) => ({
                id: p.id,
                name: p.name,
                age: p.age,
                gender: p.gender,
                isChild: p.isChild,
            })),
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
        };
    }
    async delete(id) {
        await db_config_1.prisma.ticket.delete({ where: { id } });
    }
    async getBookedTickets() {
        const tickets = await db_config_1.prisma.ticket.findMany({
            where: { bookingStatus: { in: ["CONFIRMED", "RAC"] } },
            include: {
                passengers: true,
                berthAllocations: { include: { berth: true } },
            },
        });
        return tickets.map((ticket) => ({
            id: ticket.id,
            pnrNumber: ticket.pnrNumber,
            bookingStatus: ticket.bookingStatus,
            passengers: ticket.passengers.map((p) => ({
                id: p.id,
                name: p.name,
                age: p.age,
                gender: p.gender,
                isChild: p.isChild,
            })),
            berthAllocations: ticket.berthAllocations.map((a) => ({
                berthNumber: a.berth?.number,
                berthType: a.berth?.type,
                coach: a.berth?.coach,
                passengerId: a.passengerId,
            })),
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
        }));
    }
    async getAvailableCounts() {
        const counters = await db_config_1.prisma.systemCounter.findFirst();
        return {
            confirmed: counters?.confirmedAvailable || 0,
            rac: counters?.racAvailable || 0,
            waiting: counters?.waitingAvailable || 0,
        };
    }
}
exports.TicketRepository = TicketRepository;
