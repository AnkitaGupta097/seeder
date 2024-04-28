import express from 'express';

import userController from '../../controllers/user';
import { isRoleAuth } from '../../middlewares/auth';
import { UserRole } from '../../utils/enums';

const userRouter = express.Router()

userRouter.get("/:userId", isRoleAuth(UserRole.PROVIDER, UserRole.RECIPIENT), userController.getUserDetail)
userRouter.post("/", userController.registerUser)
userRouter.patch("/", isRoleAuth(UserRole.PROVIDER, UserRole.RECIPIENT), userController.updatePassword)


export default userRouter;
