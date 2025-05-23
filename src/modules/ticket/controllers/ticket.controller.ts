import { Request, Response } from 'express';
import { ITicketService } from '../services/interfaces/ticket.service.interface';
import { CreateTicketDto } from '../dtos/create-ticket.dto';
import { ErrorCodes } from '../../../constants/error-codes';
import { sendErrorResponse, sendSuccessResponse } from '../../../shared/utils/response.utils';

export class TicketController {
  constructor(private readonly ticketService: ITicketService) {}

  async bookTicket(req: Request, res: Response) {
    try {
      const ticketData = req.body as CreateTicketDto;
      const ticket = await this.ticketService.bookTicket(ticketData);
      sendSuccessResponse(res, ticket, 201);
    } catch (error) {
      if (error instanceof Error) {
        sendErrorResponse(
          res,
          error.message,
          400,
          ErrorCodes.VALIDATION_ERROR
        );
      } else {
        sendErrorResponse(
          res,
          'Internal server error',
          500,
          ErrorCodes.DATABASE_ERROR
        );
      }
    }
  }

  async cancelTicket(req: Request, res: Response) {
    try {
      const ticketId = parseInt(req.params.ticketId);
      if (isNaN(ticketId)) {
        throw new Error('Invalid ticket ID');
      }

      const result = await this.ticketService.cancelTicket(ticketId);
      sendSuccessResponse(res, result);
    } catch (error) {
      if (error instanceof Error) {
        sendErrorResponse(
          res,
          error.message,
          400,
          ErrorCodes.TICKET_NOT_FOUND
        );
      } else {
        sendErrorResponse(
          res,
          'Internal server error',
          500,
          ErrorCodes.DATABASE_ERROR
        );
      }
    }
  }

  async getBookedTickets(req: Request, res: Response) {
    try {
      const tickets = await this.ticketService.getBookedTickets();
      sendSuccessResponse(res, tickets);
    } catch (error) {
      sendErrorResponse(
        res,
        'Internal server error',
        500,
        ErrorCodes.DATABASE_ERROR
      );
    }
  }

  async getAvailableTickets(req: Request, res: Response) {
    try {
      const availability = await this.ticketService.getAvailableTickets();
      sendSuccessResponse(res, availability);
    } catch (error) {
      sendErrorResponse(
        res,
        'Internal server error',
        500,
        ErrorCodes.DATABASE_ERROR
      );
    }
  }
}