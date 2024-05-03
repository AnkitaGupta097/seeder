import express from 'express';
import contractController from '../../controllers/contract';

const contractRouter = express.Router()

contractRouter.post("/", contractController.addNewContract)
contractRouter.get("/", contractController.getUserContracts)
contractRouter.get("/:id", contractController.getContractDetail)

export default contractRouter