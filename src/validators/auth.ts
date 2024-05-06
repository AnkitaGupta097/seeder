import { body } from "express-validator"

const login = [body("email", "Invalid email").isEmail().normalizeEmail().trim()]


export default { login }