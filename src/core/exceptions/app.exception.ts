import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../../constants/error-codes';

export class AppException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus,
    public readonly errorCode: ErrorCodes,
    public readonly details?: any
  ) {
    super(message, status);
  }
}

export class NotFoundException extends AppException {
  constructor(entity: string, details?: any) {
    super(`${entity} not found`, HttpStatus.NOT_FOUND, ErrorCodes.TICKET_NOT_FOUND, details);
  }
}

export class NoTicketsAvailableException extends AppException {
  constructor() {
    super('No tickets available', HttpStatus.BAD_REQUEST, ErrorCodes.NO_TICKETS_AVAILABLE);
  }
}

export class ValidationException extends AppException {
  constructor(errors: any[]) {
    super('Validation failed', HttpStatus.BAD_REQUEST, ErrorCodes.VALIDATION_ERROR, errors);
  }
}