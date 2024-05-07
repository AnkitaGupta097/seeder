import { body } from "express-validator"
import { UserRole, contractStatus } from "../utils/enums"


const addNewCashkick = [
    body("name").isLength({ min: 3 }).withMessage('Name must be at least 3 characters long').trim(),
    body("totalAmount").trim().isFloat().withMessage('total amount must be a decimal value'),
    body("totalFinanced").trim().isFloat().withMessage('total financed must be a decimal value').custom((value, { req }) => {
        if (value < req.body.totalAmount) {
            throw new Error("total financed can not be less than total amount")
        }
        return true
    }),
    body("contractIds").isArray({ min: 1 }).custom((contracts, { req }) => {
        //@ts-ignore
        const loggedInUser = req.user
        const availableContracts = loggedInUser.contracts?.[UserRole.RECIPIENT].filter((userContract: any) => contracts.includes(userContract.contractDetail.toString()) && userContract.status == contractStatus.AVAILABLE)?.map((c: any) => c.contractDetail.toString())
        if (availableContracts?.length != contracts?.length) {
            const nonAvailableContracts = contracts?.filter((cId: string) => !availableContracts.includes(cId))
            throw new Error(`Invalid contract(s) ${nonAvailableContracts}`)
        }

        return true
    })

]




export default { addNewCashkick }