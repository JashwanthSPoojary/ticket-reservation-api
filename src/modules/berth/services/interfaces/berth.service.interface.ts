import { BookingStatus, Prisma } from '@prisma/client';
import { PassengerInput } from '../../../../core/interfaces/ticket.interface';
// ... other imports ...

export interface IBerthService {
  allocateBerthsInTransaction(
    tx: Prisma.TransactionClient,
    ticketId: number,
    passengers: PassengerInput[],
    status: BookingStatus
  ): Promise<void>;
}