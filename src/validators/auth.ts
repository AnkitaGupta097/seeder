import { body } from "express-validator"

const login = [body("email", "Invalid emai").isEmail().normalizeEmail().trim()]


export default { login }