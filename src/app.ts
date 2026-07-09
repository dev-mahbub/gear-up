import { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { userRoutes } from "./modules/user/user.route";
import { categoryRoutes } from "./modules/category/category.route";
import { loginRoutes } from "./modules/auth/login.route";
import { gearRoutes } from "./modules/gear/gear.route";
import { rentalOrderRoutes } from "./modules/rentalOrder/rentalOrder.route";
import {
  paymentRoutes,
  paymentWebhookRoute,
} from "./modules/payment/payment.route";
import { reviewRoutes } from "./modules/review/review.route";
import { adminRoutes } from "./modules/admin/admin.route";

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
