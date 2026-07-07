import { Router } from "express";
import { authController } from "./login.controller";

const router = Router();

router.post("/login", authController.loginUser);

router.post("/refresh-token", authController.refreshToken);

export const loginRoutes = router;
