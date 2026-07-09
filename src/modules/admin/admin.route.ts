import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus);
router.get("/rentals", auth(Role.ADMIN), adminController.getAllRentalOrders);

export const adminRoutes = router;
