"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const app_config_1 = require("./config/app.config");
const ticket_module_1 = require("./modules/ticket.module");
const express_1 = __importDefault(require("express"));
const not_found_middleware_1 = require("./shared/middleware/not-found.middleware");
const error_middleware_1 = require("./shared/middleware/error.middleware");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const db_config_1 = require("./config/db.config");
async function createApp() {
    await (0, db_config_1.connectDB)();
    const app = (0, express_1.default)();
    //middleware setup ...
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    app.use(express_1.default.json());
    if (app_config_1.appConfig.env === "development") {
        app.use((0, morgan_1.default)("dev"));
    }
    // Initialize modules
    const ticketModule = ticket_module_1.TicketModule.initialize();
    // API routes
    app.post(`${app_config_1.appConfig.apiPrefix}/tickets/book`, (req, res) => ticketModule.controller.bookTicket(req, res));
    app.post(`${app_config_1.appConfig.apiPrefix}/tickets/cancel/:ticketId`, (req, res) => ticketModule.controller.cancelTicket(req, res));
    app.get(`${app_config_1.appConfig.apiPrefix}/tickets/booked`, (req, res) => ticketModule.controller.getBookedTickets(req, res));
    app.get(`${app_config_1.appConfig.apiPrefix}/tickets/available`, (req, res) => ticketModule.controller.getAvailableTickets(req, res));
    //error handlers
    app.use(not_found_middleware_1.notFoundHandler);
    app.use(error_middleware_1.errorHandler);
    return app;
}
