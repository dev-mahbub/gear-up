import { Router } from "express";
import { reviewController } from "./review.controller.js";
import { auth } from "../../middleware/auth.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = Router();

router.post("/", auth(Role.CUSTOMER), reviewController.createReview);
router.get("/gear/:gearId", reviewController.getReviewsByGear);

export const reviewRoutes = router;
