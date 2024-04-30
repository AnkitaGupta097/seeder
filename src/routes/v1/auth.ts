import express from "express";
import authController from "../../controllers/auth"
import authValidator from "../../validators/auth"
import validationHandler from "../../middlewares/validationHandler";

const authRouter = express.Router()

authRouter.post("/login", authValidator.login, validationHandler, authController.login)


export default authRouter