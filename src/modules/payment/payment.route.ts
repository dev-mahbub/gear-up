import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import express from "express";
import { paymentController } from "./payment.contorller";

const router = Router();

router.post(
  "/create",
  auth(Role.CUSTOMER),
  paymentController.createCheckoutSession,
);

router.get("/", auth(Role.CUSTOMER), paymentController.getMyPayments);
router.get("/:id", auth(Role.CUSTOMER), paymentController.getPaymentById);

export const paymentRoutes = router;

// for raw body
export const paymentWebhookRoute = Router();
paymentWebhookRoute.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.webhook,
);
