import { z } from 'zod';
import { Gender } from '../../../core/types/booking';

const passengerSchema = z.object({
  name: z.string().min(2).max(100),
  age: z.number().int().min(0).max(120),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
});

export const createTicketSchema = z.object({
  passengers: z.array(passengerSchema).min(1).max(6), // Max 6 passengers per ticket
});

export type CreateTicketDto = z.infer<typeof createTicketSchema>;