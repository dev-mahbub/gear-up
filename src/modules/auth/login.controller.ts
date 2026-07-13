import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status";
import { authService } from "./login.service.js";

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await authService.loginUserService(payload);

    const { accessToken, refreshToken } =
      await authService.loginUserService(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User login successfully",
      data: result,
    });
  },
);

const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const result = await authService.refreshTokenService(refreshToken);

    res.cookie("accessToken", result, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Refresh token successfully create access token",
      data: result,
    });
  },
);

const getCurrentUserUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await authService.getCurrentUser(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Current user retrived successfully",
      data: result,
    });
  },
);

export const authController = {
  loginUser,
  refreshToken,
  getCurrentUserUser,
};
