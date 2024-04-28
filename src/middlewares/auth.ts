import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import User from "../models/user"
import { UserRole } from "../utils/enums"
import httpStatus from 'http-status-codes';
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";

const isRoleAuth = (...roles: UserRole[]) => {

    return catchAsync((req: Request, _res: Response, next: NextFunction) => {
        const secretKey = process.env.JWT_SECRET as string

        const authHeader = req.get("Authorization")
        if (!authHeader) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Not authenticated'. please login to access")
        }

        const token = authHeader.split(' ')[1];
        let decodedToken: any;

        decodedToken = jwt.verify(token, secretKey);

        if (!decodedToken) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Not authenticated")
        }

        if (!roles.includes(decodedToken.role)) {
            throw new ApiError(httpStatus.FORBIDDEN, "Unauthorized access")
        }

        User.findById(decodedToken.userId).then((user) => {
            //@ts-ignores
            req.user = user;
            next();
        })
    })

}

export { isRoleAuth }