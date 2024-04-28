import express from "express";
import userRouter from "./user";
import cashkickRouter from "./cashkick";
import contractRouter from "./contract";
import paymentRouter from "./payment";
import authRouter from "./auth";
import { isRoleAuth } from "../../middlewares/auth";
import { UserRole } from "../../utils/enums";

const router = express.Router()

router.use("/auth", authRouter)

router.use("/users", userRouter)
router.use("/contracts", contractRouter)
router.use("/cashkicks", isRoleAuth(UserRole.RECIPIENT), cashkickRouter)
router.use("/payments", paymentRouter)

export default router

