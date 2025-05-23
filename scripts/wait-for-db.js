const { exec } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    return false;
  }
}

async function waitForDatabase() {
  let isReady = false;
  let attempts = 0;
  const maxAttempts = 30;
  
  console.log('Waiting for PostgreSQL to be available...');
  
  while (!isReady && attempts < maxAttempts) {
    attempts++;
    isReady = await checkDatabase();
    
    if (!isReady) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  if (!isReady) {
    console.error('Failed to connect to PostgreSQL after multiple attempts');
    process.exit(1);
  }
  
  console.log('PostgreSQL is available!');
  
  // Run migrations
  console.log('Running database migrations...');
  const { stdout, stderr } = await new Promise(resolve => {
    exec('npx prisma migrate dev --name init --skip-generate', (error, stdout, stderr) => {
      resolve({ stdout, stderr });
    });
  });
  
  console.log(stdout);
  if (stderr) console.error(stderr);
  
  console.log('Database initialization complete!');
}

waitForDatabase().catch(console.error);