import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { categoryService } from "./category.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const result = await categoryService.categoryCreateToDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category created successfylly",
      data: result,
    });
  },
);

const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getAllCategoryToDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Categories retrived successfylly",
      data: result,
    });
  },
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category_id = req.params?.id;
    const payload = req.body;

    const result = await categoryService.updateCategoryToDB(
      category_id as string,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category updated successfylly",
      data: result,
    });
  },
);

const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category_id = req.params?.id;

    await categoryService.deleteCategoryToDB(category_id as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category deleted successfylly",
      data: null,
    });
  },
);

export const categoryController = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
