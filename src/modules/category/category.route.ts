import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.PROVIDER), categoryController.createCategory);

export const categoryRoutes = router;
