import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '../utils/response.utils';

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  sendErrorResponse(res, 'Endpoint not found', 404, 'NOT_FOUND');
}