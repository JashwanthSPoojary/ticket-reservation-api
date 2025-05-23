"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketResponseSchema = void 0;
const zod_1 = require("zod");
const passengerResponseSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    age: zod_1.z.number(),
    gender: zod_1.z.enum(['MALE', 'FEMALE', 'OTHER']),
    isChild: zod_1.z.boolean(),
});
const berthAllocationResponseSchema = zod_1.z.object({
    berthNumber: zod_1.z.string(),
    berthType: zod_1.z.enum(['LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER']),
    coach: zod_1.z.string(),
    passengerId: zod_1.z.number(),
});
exports.ticketResponseSchema = zod_1.z.object({
    id: zod_1.z.number(),
    pnrNumber: zod_1.z.string(),
    bookingStatus: zod_1.z.enum(['CONFIRMED', 'RAC', 'WAITING', 'CANCELLED']),
    passengers: zod_1.z.array(passengerResponseSchema),
    berthAllocations: zod_1.z.array(berthAllocationResponseSchema).optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
