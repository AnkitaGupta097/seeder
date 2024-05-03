import express from 'express';
import cashkickController from '../../controllers/cashkick';

const cashkickRouter = express.Router()

cashkickRouter.post("/", cashkickController.addNewCashkick)
cashkickRouter.get("/", cashkickController.getCashkicks)
cashkickRouter.get("/:id", cashkickController.getCashkick)

export default cashkickRouter;