import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { reviewService } from "./review.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user!.id;
    const payload = req.body;

    const result = await reviewService.createReviewToDB(customerId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review created successfully",
      data: result,
    });
  },
);

const getReviewsByGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gearItemId = req.params.gearId;

    const result = await reviewService.getReviewsByGearFromDB(
      gearItemId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Reviews retrieved successfully",
      data: result,
    });
  },
);

export const reviewController = {
  createReview,
  getReviewsByGear,
};
