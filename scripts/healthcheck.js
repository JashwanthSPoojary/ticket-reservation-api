const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    process.exit(0); // healthy
  } catch (error) {
    console.error('Database health check failed:', error);
    process.exit(1); // unhealthy
  }
}

checkHealth();