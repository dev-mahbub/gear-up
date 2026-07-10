import { Router } from "express";
import { auth } from "../../middleware/auth";
import { rentalOrderController } from "./rentalOrder.controller";
import { Role } from "../../../prisma/generated/prisma/client";

const router = Router();

//customer
router.post("/", auth(Role.CUSTOMER), rentalOrderController.createRentalOrder);
router.get("/", auth(Role.CUSTOMER), rentalOrderController.getMyRentalOrders);
router.get(
  "/:id",
  auth(Role.CUSTOMER),
  rentalOrderController.getRentalOrderWithId,
);

//provider
router.get(
  "/provider/all",
  auth(Role.PROVIDER),
  rentalOrderController.getProviderOrders,
);
router.patch(
  "/provider/:id/status",
  auth(Role.PROVIDER),
  rentalOrderController.updateOrderStatus,
);

export const rentalOrderRoutes = router;
