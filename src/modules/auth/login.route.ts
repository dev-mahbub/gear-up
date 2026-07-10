import { Router } from "express";
import { authController } from "./login.controller";
import { Role } from "../../../prisma/generated/prisma/client";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/login", authController.loginUser);

router.post("/refresh-token", authController.refreshToken);

router.get(
  "/me",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  authController.getCurrentUserUser,
);

export const loginRoutes = router;
