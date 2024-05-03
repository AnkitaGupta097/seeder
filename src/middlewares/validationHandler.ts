import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ValidationError from "../utils/ValidationError";
import { StatusCodes } from "http-status-codes";

const validationHandler = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    next(new ValidationError(StatusCodes.BAD_REQUEST, "Invalid input(s)", errors))
}

export default validationHandler