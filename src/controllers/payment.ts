import { Response, Request } from "express"
import Payment from "../models/payment"
import User from '../models/user'
import Contract from "../models/contract"
import { convertToDate } from "../utils/dateUtil"
import catchAsync from "../utils/catchAsync"
import ApiError from "../utils/ApiError"
import httpStatus from 'http-status-codes';
import { getSortAndPagination } from "../utils/util"


const addNewPayment = catchAsync((req: Request, res: Response) => {
    const { dueDate, expectedAmount, outstandingAmount, status, contract, userId } = req.body

    let newAddedPaymentData: any;

    return Contract.find({ _id: contract }).then((contract) => {
        const payment = new Payment({
            dueDate: convertToDate(dueDate),
            expectedAmount,
            outstandingAmount,
            status,
            contract,
            user: userId
        })
        return payment.save()
    }).then((payment) => {
        newAddedPaymentData = payment;
        return User.findOneAndUpdate(
            {
                _id: userId,
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

})

const getPayment = catchAsync((req: Request, res: Response) => {
    //@ts-ignore
    const loggedInUser = req.user

    const id = req.params.id;
    return Payment.findOne({ user: loggedInUser._id, _id: id }).then((payment) => { if (!payment) { throw new ApiError(httpStatus.NOT_FOUND, `paymeny id ${id} not found`) } res.status(200).json(payment) })

})

const getPayments = catchAsync((req: Request, res: Response) => {
    //@ts-ignore
    const loggedInUser = req.user
    const contractIds = (req.query.contractIds as string)?.split(",") || []
    const { skip, pageSize, sortObj } = getSortAndPagination(req);


    return Payment.find({ user: loggedInUser._id, ...(contractIds.length && { "contract._id": { $in: contractIds } }) }).sort(sortObj).skip(skip).limit(pageSize).then((payment) => res.status(200).json(payment))
})


export default { addNewPayment, getPayment, getPayments }