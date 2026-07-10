import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/client";

const router = Router();

router.post("/", auth(Role.CUSTOMER), reviewController.createReview);
router.get("/gear/:gearId", reviewController.getReviewsByGear);

export const reviewRoutes = router;
