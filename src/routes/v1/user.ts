import express from 'express';

import userController from '../../controllers/user';
import { isRoleAuth } from '../../middlewares/auth';
import { UserRole } from '../../utils/enums';
import userValidator from '../../validators/user'
import validationHandler from '../../middlewares/validationHandler';

const userRouter = express.Router()

userRouter.get("/:userId", isRoleAuth(UserRole.PROVIDER, UserRole.RECIPIENT), userController.getUserDetail)
userRouter.post("/", userValidator.registerUser, validationHandler, userController.registerUser)
userRouter.patch("/", isRoleAuth(UserRole.PROVIDER, UserRole.RECIPIENT), userValidator.updatePassword, validationHandler, userController.updatePassword)


export default userRouter;
