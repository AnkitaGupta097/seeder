import express from 'express';

import userController from '../../controllers/user';

const userRouter = express.Router()

userRouter.get("/:userId", userController.getUserDetail)
userRouter.post("/", userController.registerUser)
userRouter.patch("/:userId", userController.updatePassword)


export default userRouter;
