import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import User from "../models/user";

const getUserDetail = (req: Request, res: Response) => {
    const userId = req.params.userId;
    User
        .findById(userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                const errorWIthStatusCode = Object.assign(error, { statusCode: 404 })
                throw errorWIthStatusCode;
            }

            res
                .status(200)
                .json(user);
        })
        .catch((err: any) => {
            err.statusCode = err.statusCode || 500;
            console.error(err)
        })
}

const registerUser = (req: Request, res: Response) => {
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
    const role = req.body.role
    console.log("---register user", req.body)

    //encrypt password beforing storing in db
    bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
            email: email,
            name: name,
            role: role,
            password: hashedPassword
        })
        return user.save()
    }).then((user) => {
        const userResponse = {
            email: user.email,
            name: user.name,
            role: user.role
        }
        res.status(201).json(userResponse);
    })
        .catch((err: any) => {
            err.statusCode = err.statusCode || 500;
            console.error(err)
        })
}

const updatePassword = (req: Request, res: Response) => {
    const userId = req.params.userId;
    const password = req.body.password;

    const confirmPassword = req.body.confirmPassword;
    //TODO validation of request input

    let userDetail: any;

    User
        .findById(userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                const errorWIthStatusCode = Object.assign(error, { statusCode: 404 })
                throw errorWIthStatusCode;
            }
            userDetail = user
            return bcrypt.hash(password, 12)
        }).then((hashedPassword) => {
            userDetail.password = hashedPassword
            return userDetail.save()
        })
        .then(user => res.status(201).json(user))
        .catch((err: any) => {
            err.statusCode = err.statusCode || 500;
            console.error(err)
        })
}

export default { getUserDetail, registerUser, updatePassword }