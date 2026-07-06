import { Response } from "express";

type IMeta = {
  page: number;
  limit: number;
  total: number;
};
type ISendResponseData<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: IMeta;
};

export const sendResponse = <T>(res: Response, data: ISendResponseData<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};
