import express from 'express';
import paymentController from '../../controllers/payment';

const paymentRouter = express.Router()

paymentRouter.post("/", paymentController.addNewPayment)
paymentRouter.get("/",paymentController.getPayments)
paymentRouter.get("/:id",paymentController.getPayment)

export default paymentRouter;