import { body } from "express-validator"
import { contractType } from "../utils/enums"


const addNewContract = [
    body("name").isLength({ min: 3 }).withMessage('Name must be at least 3 characters long').trim(),
    body("termLength").isNumeric().withMessage('term length must be a numeric value').trim(),
    body("type").trim().notEmpty().isIn(Object.values(contractType)).withMessage("Invalid contract type"),
    body("totalAmount").trim().isFloat().withMessage('total amount must be a decimal value'),
    body("totalFinanced").trim().isFloat().withMessage('total financed must be a decimal value').custom((value, { req }) => {
        if (value < req.body.totalAmount) {
            throw new Error("total financed can not be less than total amount")
        }
        return true
    }),
    body("perPayment").trim().isFloat().withMessage('per payment must be a decimal value')
]




export default { addNewContract }