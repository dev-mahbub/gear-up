import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { Role } from "../../../generated/prisma/enums.js";

import { rentalOrderController } from "./rentalOrder.controller.js";

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
