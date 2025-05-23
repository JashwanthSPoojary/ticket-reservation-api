"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const app_config_1 = require("./config/app.config");
const db_config_1 = require("./config/db.config");
async function startServer() {
    const app = await (0, app_1.createApp)();
    const server = app.listen(app_config_1.appConfig.port, () => {
        console.log(`Server running on port ${app_config_1.appConfig.port} in ${app_config_1.appConfig.env} mode`);
    });
    process.on('SIGTERM', () => {
        console.log('SIGTERM received. Shutting down gracefully');
        server.close(async () => {
            await (0, db_config_1.disconnectDB)();
            console.log('Server closed');
            process.exit(0);
        });
    });
    process.on('SIGINT', () => {
        console.log('SIGINT received. Shutting down gracefully');
        server.close(async () => {
            await (0, db_config_1.disconnectDB)();
            console.log('Server closed');
            process.exit(0);
        });
    });
}
startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
