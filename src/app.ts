import { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

const app: Application = express();

//middleware
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

//comment for middleware
(app.use(express.json()),
  app.use(express.urlencoded()),
  app.use(cookieParser()));

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello World");
});

//routes
app.get("/", (req: Request, res: Response) => {});

//global error handler
app.use(notFound);
app.use(globalErrorHandler);
export default app;
