import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status";
import { userService } from "./user.service.js";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const result = await userService.registerUserToDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: result,
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const result = await userService.getMyProfileFromDB(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile retrieved successfully",
      data: result,
    });
  },
);

const updateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const payload = req.body;
    const result = await userService.updateMyProfileToDB(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile updated successfully",
      data: result,
    });
  },
);

export const userController = {
  registerUser,
  getMyProfile,
  updateMyProfile,
};
