import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import mongoose from "mongoose";
import httpStatus from 'http-status-codes'

const errorConverter = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode = error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;

        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, err.stack);
    }
    next(error);
};

const errorHandler = (err: ApiError, req: Request, res: Response, _next: NextFunction) => {

    //@ts-ignore
    let { statusCode, message } = err;

    const response = {
        code: statusCode,
        message,
    };

    res.status(statusCode).json(response);
    console.error(err)
};

export { errorConverter, errorHandler };