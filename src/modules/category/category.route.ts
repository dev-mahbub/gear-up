import { Router } from "express";
import { categoryController } from "./category.controller.js";
import { auth } from "../../middleware/auth.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = Router();

router.post("/", auth(Role.ADMIN), categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.patch("/:id", auth(Role.ADMIN), categoryController.updateCategory);
router.delete("/:id", auth(Role.ADMIN), categoryController.deleteCategory);

export const categoryRoutes = router;
