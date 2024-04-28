import { Request, Response } from "express"
import User from '../models/user'
import bcrypt from 'bcryptjs'
import authUtil from "../utils/auth"
import ApiError from "../utils/ApiError"
import httpStatus from 'http-status-codes';
import catchAsync from "../utils/catchAsync"


const login = catchAsync((req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    let loggedUser: any;

    return User.findOne({ email }).then((user) => {
        if (!user) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user email")
        }
        loggedUser = user
        return bcrypt.compare(password, user.password)
    }).then((isMatched) => {
        if (!isMatched) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user password")
        }
        const token = authUtil.createJWTToken({ userId: loggedUser._id, role: loggedUser.role })

        res
            .status(200)
            .json({
                token: token
            });
    })

})

export default { login }