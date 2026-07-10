import { Router } from "express";
import { gearController } from "./gear.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma";

const router = Router();

router.post("/", auth(Role.PROVIDER), gearController.createGear);
router.get("/", gearController.getAllGear);
router.get("/:id", gearController.getGearById);
router.patch("/:id", auth(Role.PROVIDER), gearController.updateGear);
router.delete("/:id", auth(Role.PROVIDER), gearController.deleteGear);

export const gearRoutes = router;
