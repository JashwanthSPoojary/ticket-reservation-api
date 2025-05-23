import { NextFunction, Request, Response } from 'express';
import { AppException } from '../../core/exceptions/app.exception';
import { sendErrorResponse } from '../utils/response.utils';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppException) {
    sendErrorResponse(
      res,
      err.message,
      err.getStatus(),
      err.errorCode,
      err.details
    );
  } else {
    console.error('Unhandled error:', err);
    sendErrorResponse(
      res,
      'Internal server error',
      500,
      'INTERNAL_SERVER_ERROR'
    );
  }
}