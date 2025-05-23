import { z } from 'zod';

const passengerResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  age: z.number(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  isChild: z.boolean(),
});

const berthAllocationResponseSchema = z.object({
  berthNumber: z.string(),
  berthType: z.enum(['LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER']),
  coach: z.string(),
  passengerId: z.number(),
});

export const ticketResponseSchema = z.object({
  id: z.number(),
  pnrNumber: z.string(),
  bookingStatus: z.enum(['CONFIRMED', 'RAC', 'WAITING', 'CANCELLED']),
  passengers: z.array(passengerResponseSchema),
  berthAllocations: z.array(berthAllocationResponseSchema).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TicketResponseDto = z.infer<typeof ticketResponseSchema>;