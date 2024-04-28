import express from 'express';
import contractController from '../../controllers/contract';
import { isRoleAuth } from '../../middlewares/auth';
import { UserRole } from '../../utils/enums';

const contractRouter = express.Router()

contractRouter.post("/", isRoleAuth(UserRole.PROVIDER), contractController.addNewContract)
contractRouter.get("/", isRoleAuth(UserRole.RECIPIENT, UserRole.PROVIDER), contractController.getUserContracts)
contractRouter.get("/:id", isRoleAuth(UserRole.RECIPIENT), contractController.getContractDetail)

export default contractRouter