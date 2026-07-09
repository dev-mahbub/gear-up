import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import { rentalOrderController } from "./rentalOrder.controller";

const router = Router();

router.post("/", auth(Role.CUSTOMER), rentalOrderController.createRentalOrder);
router.get("/", auth(Role.CUSTOMER), rentalOrderController.getMyRentalOrders);
router.get(
  "/:id",
  auth(Role.CUSTOMER),
  rentalOrderController.getRentalOrderWithId,
);

export const rentalOrderRoutes = router;
