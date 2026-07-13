import { Router } from "express";
import { authController } from "./login.controller.js";
import { Role } from "../../../generated/prisma/enums.js";

import { auth } from "../../middleware/auth.js";

const router = Router();

router.post("/login", authController.loginUser);

router.post("/refresh-token", authController.refreshToken);

router.get(
  "/me",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  authController.getCurrentUserUser,
);

export const loginRoutes = router;
