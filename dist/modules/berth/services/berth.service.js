"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BerthService = void 0;
const system_1 = require("../../../constants/system");
class BerthService {
    // ... existing methods ...
    async allocateBerthsInTransaction(tx, ticketId, passengers, status) {
        const adultPassengers = passengers.filter(p => p.age >= system_1.SYSTEM_CONSTANTS.MIN_AGE_FOR_BERTH);
        if (adultPassengers.length === 0)
            return;
        // Priority allocation for lower berths
        const priorityPassengers = adultPassengers.filter(p => p.age >= system_1.SYSTEM_CONSTANTS.SENIOR_CITIZEN_AGE ||
            (p.gender === 'FEMALE' && passengers.some(p => p.age < system_1.SYSTEM_CONSTANTS.MIN_AGE_FOR_BERTH)));
        // Allocate lower berths first for priority passengers
        for (const passenger of priorityPassengers) {
            const lowerBerth = await tx.berth.findFirst({
                where: {
                    type: 'LOWER',
                    allocations: { none: {} },
                },
            });
            if (lowerBerth) {
                await tx.berthAllocation.create({
                    data: {
                        ticketId,
                        passengerId: passenger.id,
                        berthId: lowerBerth.id,
                        status,
                    },
                });
            }
        }
        // Allocate remaining berths based on status
        const berthType = status === 'RAC' ? 'SIDE_LOWER' : undefined;
        if (berthType) {
            for (const passenger of adultPassengers) {
                if (passenger.id && !await tx.berthAllocation.findFirst({
                    where: { passengerId: passenger.id }
                })) {
                    const berth = await tx.berth.findFirst({
                        where: {
                            type: berthType,
                            allocations: status === 'RAC'
                                ? { every: { status: 'RAC' }, some: {} } // RAC allows 2 passengers per berth
                                : { none: {} },
                        },
                        include: { allocations: true },
                    });
                    if (berth) {
                        await tx.berthAllocation.create({
                            data: {
                                ticketId,
                                passengerId: passenger.id,
                                berthId: berth.id,
                                status,
                            },
                        });
                    }
                }
            }
        }
    }
}
exports.BerthService = BerthService;
