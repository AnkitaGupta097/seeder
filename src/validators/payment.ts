import { body } from "express-validator"
import { PaymentStatus, UserRole, contractStatus } from "../utils/enums"
import User from '../models/user'


const addNewPayment = [
    body("dueDate").isDate({ format: 'MM-DD-YYYY' }).withMessage("Invalid Date"),
    body("expectedAmount").trim().isFloat().withMessage('expected amount must be a decimal value'),
    body("outstandingAmount").trim().isFloat().withMessage('outstanding amount must be a decimal value'),
    body("status").isIn(Object.values(PaymentStatus)),
    body("userId").custom((userId, { req }) => {
        return User.findById(userId).then((user) => { if (!user) { throw new Error("User not found") } })
    }),
    body("contract").custom((contractId, { req }) => {
        return User.findById(req.body.userId).then((user) => {
            const userContract = user?.contracts?.[UserRole.RECIPIENT]?.find((contract: any) => contract?.contractDetail.toString() == contractId)
            if (!userContract) {
                throw new Error(`Contract ${contractId} not found`)
            }
            if (!userContract?.cashkick) {
                throw new Error(`Contract ${contractId} is not used in any cashkick by user ${req.body.userId}`)
            }
        })
    }),
]




export default { addNewPayment }