import { SYSTEM_CONSTANTS } from '../../constants/system';

export function generatePnrNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PNR${result}`;
}

export function calculateTicketStatus(
  confirmedAvailable: number,
  racAvailable: number,
  waitingAvailable: number
): 'CONFIRMED' | 'RAC' | 'WAITING' | null {
  if (confirmedAvailable > 0) return 'CONFIRMED';
  if (racAvailable > 0) return 'RAC';
  if (waitingAvailable > 0) return 'WAITING';
  return null;
}