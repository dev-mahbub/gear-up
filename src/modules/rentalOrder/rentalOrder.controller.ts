import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { rentalOrderService } from "./rentalOrder.service";

const createRentalOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const payload = req.body;

    const result = await rentalOrderService.createRentalOrderToDB(
      customerId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rental order created successfully",
      data: result,
    });
  },
);

const getMyRentalOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;

    const result = await rentalOrderService.getMyRentalOrdersFromDB(
      customerId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental orders retrieved successfully",
      data: result,
    });
  },
);

const getRentalOrderWithId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const rentalOrderId = req.params?.id;

    const result = await rentalOrderService.getRentalOrderWithIdFromDB(
      rentalOrderId as string,
      customerId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental order retrieved successfully",
      data: result,
    });
  },
);

export const rentalOrderController = {
  createRentalOrder,
  getMyRentalOrders,
  getRentalOrderWithId,
};
