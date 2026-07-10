import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/client";

const router = Router();

router.post("/register", userController.registerUser);

router.get(
  "/me",
  auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
  userController.getMyProfile,
);
router.patch(
  "/me",
  auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
  userController.updateMyProfile,
);

export const userRoutes = router;
