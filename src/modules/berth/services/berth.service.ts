// src/modules/berth/services/berth.service.ts
import { Prisma, PrismaClient, BerthType } from '@prisma/client';
import { IBerthService } from './interfaces/berth.service.interface';
import { BookingStatus } from '../../../core/types/booking';
import { SYSTEM_CONSTANTS } from '../../../constants/system';
import { PassengerInput } from '../../../core/interfaces/ticket.interface';

export class BerthService implements IBerthService {
  // ... existing methods ...

  async allocateBerthsInTransaction(
    tx: Prisma.TransactionClient,
    ticketId: number,
    passengers: PassengerInput[],
    status: BookingStatus
  ): Promise<void> {
    const adultPassengers = passengers.filter(p => p.age >= SYSTEM_CONSTANTS.MIN_AGE_FOR_BERTH);
    if (adultPassengers.length === 0) return;

    // Priority allocation for lower berths
    const priorityPassengers = adultPassengers.filter(p => 
      p.age >= SYSTEM_CONSTANTS.SENIOR_CITIZEN_AGE || 
      (p.gender === 'FEMALE' && passengers.some(p => p.age < SYSTEM_CONSTANTS.MIN_AGE_FOR_BERTH))
    );

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
            passengerId: passenger.id!,
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

  // ... rest of the class implementation ...
}