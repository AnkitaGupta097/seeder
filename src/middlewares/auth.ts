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
            return Promise.reject(new ApiError(httpStatus.UNAUTHORIZED, "Not authenticated'. please login to access"))
        }

        const token = authHeader.split(' ')[1];
        let decodedToken: any;

        decodedToken = jwt.verify(token, secretKey);

        if (!decodedToken) {
            return Promise.reject(new ApiError(httpStatus.UNAUTHORIZED, "Not authenticated"))
        }

        if (!roles.includes(decodedToken.role)) {
            return Promise.reject(new ApiError(httpStatus.FORBIDDEN, "Unauthorized access"))
        }

        return User.findById(decodedToken.userId).then((user) => {
            //@ts-ignores
            req.user = user;
            next();
        })
    })

}

export { isRoleAuth }