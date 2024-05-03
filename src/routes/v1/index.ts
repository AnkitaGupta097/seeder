import express from "express";
import userRouter from "./user";
import cashkickRouter from "./cashkick";
import contractRouter from "./contract";
import paymentRouter from "./payment";

const router = express.Router()


router.use("/users", userRouter)
router.use("/contracts", contractRouter)
router.use("/cashkicks", cashkickRouter)
router.use("/payments", paymentRouter)

export default router

