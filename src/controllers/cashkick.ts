import { Response, Request } from "express"
import Cashkick from "../models/cashkick"
import { CashkicksStatus, contractStatus } from "../utils/enums"
import Contract from "../models/contract"
import User from '../models/user'
import catchAsync from "../utils/catchAsync"
import ApiError from "../utils/ApiError"
import httpStatus from 'http-status-codes';
import { getSortAndPagination } from '../utils/util';

const addNewCashkick = catchAsync((req: Request, res: Response) => {
    const { name, totalAmount, totalFinanced, contractIds } = req.body

    //@ts-ignore
    const loggedInUser = req.user
    let newAddedCashkick: any;

    return Contract.find({ _id: { $in: contractIds } }).then((contracts) => {
        const cashkick = new Cashkick({
            user: loggedInUser._id,
            name,
            totalAmount,
            totalFinanced,
            status: CashkicksStatus.PENDING,
            contracts
        })
        return cashkick.save()
    }).then((newCashkick) => {
        newAddedCashkick = newCashkick;
        return User.findOneAndUpdate(
            {
                _id: loggedInUser._id,
            },
            {
                $set: { 'contracts.RECIPIENT.$[elem].cashkick': newCashkick._id, 'contracts.RECIPIENT.$[elem].status': contractStatus.SIGNED, 'contracts.RECIPIENT.$[elem].startDate': new Date() } // Update cashkick ID
            },
            {
                new: true,
                arrayFilters: [{ 'elem.contractDetail': { $in: contractIds } }] // Filter to match contract IDs
            }
        );
    }).then(() => {
        res.status(201).json(newAddedCashkick)
    })
})

const getCashkick = catchAsync((req: Request, res: Response) => {
    //@ts-ignore
    const loggedInUser = req.user

    const id = req.params.id;
    return Cashkick.find({ user: loggedInUser._id, _id: id }).then((cashkick) => { if (!cashkick?.length) { throw new ApiError(httpStatus.NOT_FOUND, `cashkick id ${id} not found`) } res.status(200).json(cashkick[0]) })

})

const getCashkicks = catchAsync((req: Request, res: Response) => {
    //@ts-ignore
    const loggedInUser = req.user
    const contractIds = (req.query.contractIds as string)?.split(",") || []
    const { skip, pageSize, sortObj } = getSortAndPagination(req);

    return Cashkick.find({ user: loggedInUser._id, ...(contractIds.length && { "contracts": { $elemMatch: { "_id": { $in: contractIds } } } }) }).sort(sortObj).skip(skip).limit(pageSize).then((cashkicks) => res.status(200).json(cashkicks))
})



export default { addNewCashkick, getCashkick, getCashkicks }