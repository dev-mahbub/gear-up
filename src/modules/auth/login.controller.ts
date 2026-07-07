import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { loginService } from "./login.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await loginService.loginUserToDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User login successfully",
      data: result,
    });
  },
);

export const loginController = {
  loginUser,
};
