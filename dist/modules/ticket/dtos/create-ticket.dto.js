"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicketSchema = void 0;
const zod_1 = require("zod");
const passengerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    age: zod_1.z.number().int().min(0).max(120),
    gender: zod_1.z.enum(['MALE', 'FEMALE', 'OTHER']),
});
exports.createTicketSchema = zod_1.z.object({
    passengers: zod_1.z.array(passengerSchema).min(1).max(6), // Max 6 passengers per ticket
});
