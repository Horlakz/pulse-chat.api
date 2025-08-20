import { HttpException } from "@/exceptions/http-exception";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status ?? 500;
  const message = error.message ?? "Something went wrong";

  console.error(`[ERROR] ${status} - ${message}`);

  res.status(status).json({
    message: "error",
    error: message,
  });
};
