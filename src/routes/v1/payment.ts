import express from 'express';
import paymentController from '../../controllers/payment';
import { isRoleAuth } from '../../middlewares/auth';
import { UserRole } from '../../utils/enums';

const paymentRouter = express.Router()

paymentRouter.post("/", paymentController.addNewPayment)
paymentRouter.get("/", isRoleAuth(UserRole.RECIPIENT), paymentController.getPayments)
paymentRouter.get("/:id", isRoleAuth(UserRole.RECIPIENT), paymentController.getPayment)

export default paymentRouter;