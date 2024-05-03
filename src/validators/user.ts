import { body } from "express-validator"
import User from "../models/user";
import { UserRole } from "../utils/enums";


const passwordValidator = body("password").matches(/[A-Z]/).withMessage('Password must contain at least one capital letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')

const registerUser = [
    body("email").isEmail().withMessage('please enter a valid email').custom((value) => {
        return User
            .findOne({ email: value })
            .then(user => {
                if (user) throw new Error('email already exists, please use another email');
            })
    }).normalizeEmail().trim(),
    passwordValidator,
    body("name").trim().notEmpty().isLength({ min: 3 }).withMessage("Name should have min 3 character atleast"),
    body("role").trim().notEmpty().isIn(Object.values(UserRole)).withMessage("Invalid role")
]

const updatePassword = [
    passwordValidator,
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('passwords do not match');
            }
            return true;
        })
]

export default { registerUser, updatePassword }