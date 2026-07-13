import { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import config from "./config/index.js";
import cookieParser from "cookie-parser";
import { notFound } from "./middleware/notFound.js";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";
import { userRoutes } from "./modules/user/user.route.js";
import { categoryRoutes } from "./modules/category/category.route.js";
import { loginRoutes } from "./modules/auth/login.route.js";
import { gearRoutes } from "./modules/gear/gear.route.js";
import { rentalOrderRoutes } from "./modules/rentalOrder/rentalOrder.route.js";
import {
  paymentRoutes,
  paymentWebhookRoute,
} from "./modules/payment/payment.route.js";
import { reviewRoutes } from "./modules/review/review.route.js";
import { adminRoutes } from "./modules/admin/admin.route.js";

const app: Application = express();

//middleware
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use("/api/payments", paymentWebhookRoute);

//comment for middleware
(app.use(express.json()),
  app.use(express.urlencoded()),
  app.use(cookieParser()));

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello World");
});

//routes
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/gears", gearRoutes);
app.use("/api/rentalOrdres", rentalOrderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

//global error handler
app.use(notFound);
app.use(globalErrorHandler);
export default app;
