import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { paymentService } from "./payment.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user!.id;
    const result = await paymentService.createCheckoutSession(
      customerId,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);

const webhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers["stripe-signature"] as string;
    await paymentService.handleWebhook(req.body, signature);
    res.status(200).json({ received: true });
  },
);

const getMyPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user!.id;
    const result = await paymentService.getMyPayments(customerId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payments retrieved successfully",
      data: result,
    });
  },
);

const getPaymentById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const paymentId = req.params.id;
    const result = await paymentService.getPaymentById(
      paymentId as string,
      customerId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment retrieved successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createCheckoutSession,
  webhook,
  getMyPayments,
  getPaymentById,
};
