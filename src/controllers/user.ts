import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import User from "../models/user";
import catchAsync from "../utils/catchAsync";
import httpStatus from 'http-status-codes';
import ApiError from "../utils/ApiError";

const getUserDetail = catchAsync((req: Request, res: Response) => {
    const userId = req.params.userId;
    //@ts-ignores
    const user = req.user

    if (userId != user._id.toString()) {
        throw new ApiError(httpStatus.NOT_FOUND, `${userId} user not found`)
    }

    res
        .status(200)
        .json(user);

})

const registerUser = catchAsync((req: Request, res: Response) => {
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
    const role = req.body.role

    //encrypt password beforing storing in db
    return bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
            email: email,
            name: name,
            role: role,
            password: hashedPassword
        })
        return user.save()
    }).then((user) => {
        const userResponse = {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        }
        res.status(201).json(userResponse);
    })
})

const updatePassword = catchAsync((req: Request, res: Response) => {
    const password = req.body.password;
    const currentPassword = req.body.currentPassword;

    let userDetail: any;
    //@ts-ignore
    userDetail = req.user
    return bcrypt.compare(currentPassword, userDetail.password).then((isMatched) => {
        if (!isMatched) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Invalid current password")
        }
        return bcrypt.hash(password, 12)
            .then((hashedPassword) => {
                userDetail.password = hashedPassword
                return userDetail.save()
            })
            .then(user => res.status(201).json(user))
    })
})

export default { getUserDetail, registerUser, updatePassword }