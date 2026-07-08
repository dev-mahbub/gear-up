import { Router } from "express";
import { gearController } from "./gear.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.PROVIDER), gearController.createGear);
router.get("/", gearController.getAllGear);
router.get("/:id", auth(Role.PROVIDER), gearController.getGearById);
router.patch("/:id", auth(Role.PROVIDER), gearController.updateGear);
router.delete("/:id", auth(Role.PROVIDER), gearController.deleteGear);

export const gearRoutes = router;
