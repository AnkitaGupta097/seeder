import express from 'express';
import cashkickController from '../../controllers/cashkick';
import cashkickValidator from '../../validators/cashkick';
import validationHandler from '../../middlewares/validationHandler';

const cashkickRouter = express.Router()

cashkickRouter.post("/", cashkickValidator.addNewCashkick, validationHandler, cashkickController.addNewCashkick)
cashkickRouter.get("/", cashkickController.getCashkicks)
cashkickRouter.get("/:id", cashkickController.getCashkick)

export default cashkickRouter;