import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import mongoose from "mongoose";
import httpStatus from 'http-status-codes'
import ValidationError from "../utils/ValidationError";
import logger from "../logger";

const errorConverter = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let error = err;
    if (!(error instanceof ApiError || error instanceof ValidationError)) {
        const statusCode = error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;

        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, err.stack);
    }
    next(error);
};

const errorHandler = (err: ApiError | ValidationError, req: Request, res: Response, _next: NextFunction) => {

    //@ts-ignore
    let { statusCode, message, errors } = err;

    const response = {
        code: statusCode,
        message,
        ...(errors ? errors : {})
    };

    res.status(statusCode).json(response);
    logger.error(err)
};

export { errorConverter, errorHandler };