import { createTicketSchema } from '../dtos/create-ticket.dto';
import { SYSTEM_CONSTANTS } from '../../../constants/system';
import { z } from 'zod';

export function validateCreateTicket(input: unknown) {
  // First validate with Zod schema
  const ticketData = createTicketSchema.parse(input);

  // Additional business validations
  const childrenCount = ticketData.passengers.filter(
    (p) => p.age < SYSTEM_CONSTANTS.MIN_AGE_FOR_BERTH
  ).length;

  if (childrenCount > SYSTEM_CONSTANTS.MAX_CHILDREN_PER_TICKET) {
    throw new z.ZodError([
      {
        code: 'custom',
        path: ['passengers'],
        message: `Maximum ${SYSTEM_CONSTANTS.MAX_CHILDREN_PER_TICKET} children under ${SYSTEM_CONSTANTS.MIN_AGE_FOR_BERTH} allowed per ticket`,
      },
    ]);
  }

  return ticketData;
}