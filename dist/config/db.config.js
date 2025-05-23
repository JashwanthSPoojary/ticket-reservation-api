"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectDB = connectDB;
exports.disconnectDB = disconnectDB;
const client_1 = require("@prisma/client");
const system_1 = require("../constants/system");
exports.prisma = new client_1.PrismaClient();
async function connectDB() {
    try {
        await exports.prisma.$connect();
        console.log('Database connected successfully');
        // Initialize system counters if they don't exist
        await initializeSystemCounters();
        // Initialize berths if they don't exist
        await initializeBerths();
    }
    catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}
async function initializeSystemCounters() {
    const counter = await exports.prisma.systemCounter.findFirst();
    if (!counter) {
        await exports.prisma.systemCounter.create({
            data: {
                confirmedAvailable: system_1.SYSTEM_CONSTANTS.MAX_CONFIRMED_BERTHS,
                racAvailable: system_1.SYSTEM_CONSTANTS.MAX_RAC_BERTHS,
                waitingAvailable: system_1.SYSTEM_CONSTANTS.MAX_WAITING_LIST,
            },
        });
        console.log('System counters initialized');
    }
}
async function initializeBerths() {
    const berthCount = await exports.prisma.berth.count();
    if (berthCount > 0)
        return;
    const berths = [];
    // Create 63 confirmed berths (21 lower, 21 middle, 21 upper)
    for (let i = 1; i <= 21; i++) {
        berths.push({ number: `L${i}`, type: 'LOWER', coach: 'A' });
        berths.push({ number: `M${i}`, type: 'MIDDLE', coach: 'A' });
        berths.push({ number: `U${i}`, type: 'UPPER', coach: 'A' });
    }
    // Create 9 RAC berths (side-lower)
    for (let i = 1; i <= 9; i++) {
        berths.push({ number: `SL${i}`, type: 'SIDE_LOWER', coach: 'B' });
    }
    await exports.prisma.berth.createMany({ data: berths });
    console.log('Berths initialized');
}
async function disconnectDB() {
    await exports.prisma.$disconnect();
}
