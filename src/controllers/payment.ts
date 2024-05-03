import { Response, Request } from "express"
import Payment from "../models/payment"
import User from '../models/user'
import Contract from "../models/contract"
import { convertToDate } from "../utils/dateUtil"


const addNewPayment = (req: Request, res: Response) => {
    const { dueDate, expectedAmount, outstandingAmount, status, contract } = req.body

    //@ts-ignore
    const loggedInUser = req.user
    let newAddedPaymentData: any;

    Contract.find({ _id: contract, user: loggedInUser._id}).then((contract) => {
        const payment = new Payment({
           dueDate: convertToDate(dueDate),
           expectedAmount,
           outstandingAmount,
           status,
           contract,
           user: loggedInUser._id
        })
        return payment.save()
    }).then((payment) => {
        newAddedPaymentData = payment;
        return User.findOneAndUpdate(
            {
                _id: loggedInUser._id,
            },
            {
                $addToSet: { 'contracts.RECIPIENT.$[elem].payments': payment._id }
            },
            {
                new: true,
                arrayFilters: [{ 'elem.contractDetail': contract }] // Filter to match contract IDs
            }
        );
    }).then(() => {
        res.status(201).json(newAddedPaymentData)
    })
        .catch((err: any) => {
            console.error(err)
        })


}

const getPayment = (req: Request, res: Response) => {
    //@ts-ignore
    const loggedInUser = req.user

    const id = req.params.id;
    Payment.find({ user: loggedInUser._id, _id: id }).then((payment) => res.status(200).json(payment)).catch((err) => console.log(err))

}

const getPayments = (req: Request, res: Response) => {
    //@ts-ignore
    const loggedInUser = req.user
    const contractIds = (req.query.contractIds as string)?.split(",") || []

    Payment.find({ user: loggedInUser._id, ...(contractIds.length && { "contract._id": { $in: contractIds } }) }).then((payment) => res.status(200).json(payment)).catch((err) => console.log(err))
}



export default { addNewPayment, getPayment, getPayments }