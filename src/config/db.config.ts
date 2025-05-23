import { Berth, PrismaClient } from '@prisma/client';
import { SYSTEM_CONSTANTS } from '../constants/system';

export const prisma = new PrismaClient();

export async function connectDB(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    // Initialize system counters if they don't exist
    await initializeSystemCounters();
    
    // Initialize berths if they don't exist
    await initializeBerths();
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

async function initializeSystemCounters() {
  const counter = await prisma.systemCounter.findFirst();
  if (!counter) {
    await prisma.systemCounter.create({
      data: {
        confirmedAvailable: SYSTEM_CONSTANTS.MAX_CONFIRMED_BERTHS,
        racAvailable: SYSTEM_CONSTANTS.MAX_RAC_BERTHS,
        waitingAvailable: SYSTEM_CONSTANTS.MAX_WAITING_LIST,
      },
    });
    console.log('System counters initialized');
  }
}

async function initializeBerths() {
  const berthCount = await prisma.berth.count();
  if (berthCount > 0) return;

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

  await prisma.berth.createMany({ data: berths as Berth[]});
  console.log('Berths initialized');
}

export async function disconnectDB(): Promise<void> {
  await prisma.$disconnect();
}