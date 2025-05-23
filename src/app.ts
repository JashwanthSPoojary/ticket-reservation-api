import { appConfig } from "./config/app.config";
import { TicketModule } from "./modules/ticket.module";
import express from "express";
import { notFoundHandler } from "./shared/middleware/not-found.middleware";
import { errorHandler } from "./shared/middleware/error.middleware";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db.config";

export async function createApp(): Promise<express.Application> {
  await connectDB();
  const app = express();

  //middleware setup ...
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  if(appConfig.env === "development"){
    app.use(morgan("dev"));
  }

  // Initialize modules
  const ticketModule = TicketModule.initialize();

  // API routes
  app.post(`${appConfig.apiPrefix}/tickets/book`, (req, res) =>
    ticketModule.controller.bookTicket(req, res)
  );
  app.post(`${appConfig.apiPrefix}/tickets/cancel/:ticketId`, (req, res) =>
    ticketModule.controller.cancelTicket(req, res)
  );
  app.get(`${appConfig.apiPrefix}/tickets/booked`, (req, res) =>
    ticketModule.controller.getBookedTickets(req, res)
  );
  app.get(`${appConfig.apiPrefix}/tickets/available`, (req, res) =>
    ticketModule.controller.getAvailableTickets(req, res)
  );

  //error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);


  return app;
}