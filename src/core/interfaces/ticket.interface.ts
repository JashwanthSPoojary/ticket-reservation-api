import { BerthType } from '../../../generated/prisma';
import { BookingStatus, Gender } from '../types/booking';

export interface PassengerInput {
  id?:number;
  name: string;
  age: number;
  gender: Gender;
}

export interface TicketResponse {
  id: number;
  pnrNumber: string;
  bookingStatus: BookingStatus;
  passengers: PassengerResponse[];
  berthAllocations?: BerthAllocationResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PassengerResponse {
  id: number;
  name: string;
  age: number;
  gender: Gender;
  isChild: boolean;
}

export interface BerthAllocationResponse {
  berthNumber: string;
  berthType: BerthType;
  coach: string;
  passengerId: number;
}