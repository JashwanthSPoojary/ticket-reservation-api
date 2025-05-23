import { Response } from 'express';

export function sendSuccessResponse(
  res: Response,
  data: any,
  statusCode: number = 200
): Response {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

export function sendErrorResponse(
  res: Response,
  message: string,
  statusCode: number = 400,
  errorCode?: string,
  details?: any
): Response {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: errorCode,
      details,
    },
  });
}