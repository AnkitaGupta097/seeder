import express from 'express';
import paymentController from '../../controllers/payment';
import { isRoleAuth } from '../../middlewares/auth';
import { UserRole } from '../../utils/enums';
import paymentValidator from '../../validators/payment';
import validationHandler from '../../middlewares/validationHandler';

const paymentRouter = express.Router()

paymentRouter.post("/", paymentValidator.addNewPayment, validationHandler, paymentController.addNewPayment)
paymentRouter.get("/", isRoleAuth(UserRole.RECIPIENT), paymentController.getPayments)
paymentRouter.get("/:id", isRoleAuth(UserRole.RECIPIENT), paymentController.getPayment)

export default paymentRouter;