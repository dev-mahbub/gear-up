import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { gearService } from "./gear.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const provider_id = req.user?.id;
    const payload = req.body;

    const result = await gearService.createGearToDB(
      provider_id as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Gear created successfully",
      data: result,
    });
  },
);

const getAllGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await gearService.getAllGearToDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gears retirved successfully",
      data: result,
    });
  },
);

const getGearById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gearId = req.params?.id;
    const result = await gearService.getGearWithIdToDB(gearId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gear retirved successfully",
      data: result,
    });
  },
);

const updateGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const provider_id = req.user?.id;
    const gear_id = req.params.id;
    const payload = req.body;
    const isProvider = req.user?.role === "PROVIDER";

    const result = await gearService.updateGearToDB(
      provider_id as string,
      gear_id as string,
      payload,
      isProvider,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gear updated successfully",
      data: result,
    });
  },
);

const deleteGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const gearController = {
  createGear,
  getAllGear,
  getGearById,
  updateGear,
  deleteGear,
};
