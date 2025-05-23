import { createApp } from './app';
import { appConfig } from './config/app.config';
import { disconnectDB } from './config/db.config';

async function startServer() {
  const app = await createApp();

  const server = app.listen(appConfig.port, () => {
    console.log(`Server running on port ${appConfig.port} in ${appConfig.env} mode`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(async () => {
      await disconnectDB();
      console.log('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully');
    server.close(async () => {
      await disconnectDB();
      console.log('Server closed');
      process.exit(0);
    });
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});