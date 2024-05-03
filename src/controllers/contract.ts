import { Request, Response } from "express";
import Contract from "../models/contract";
import User, { userSchema } from "../models/user";
import { UserRole } from "../utils/enums";

const addNewContract = (req: Request, res: Response) => {
  const { name, termLength, type, termRate, totalAmount, totalFinanced, perPayment } = req.body

  //@ts-ignore
  const contractOwner = req.user

  const contract = new Contract({
    name,
    termLength,
    type,
    termRate,
    totalAmount,
    totalFinanced,
    perPayment,
    contractOwner
  })
  return contract.save()
    .then((contract) => {
      res.status(201).json(contract.toObject());
      return contract
    }).then((newContract) => {
      contractOwner.contracts.PROVIDER.push(newContract)
      contractOwner.save().catch((err: any) => {
        err.statusCode = err.statusCode || 500;
        console.error(err)
      })
      return User.updateMany({ role: UserRole.RECIPIENT },
        {
          $addToSet: {
            [`contracts.${UserRole.RECIPIENT}`]: { contractDetail: newContract._id }
          }
        }, { multi: true })
    })
    .catch((err: any) => {
      err.statusCode = err.statusCode || 500;
      console.error(err)
    })
}

const getUserContracts = (req: Request, res: Response) => {
  const status = req.query.status
  const cashkick = req.query.cashkick

  //@ts-ignore
  const loggedInUser = req.user

  if (loggedInUser.role === UserRole.PROVIDER) {
    res
      .status(200)
      .json(loggedInUser.contracts?.PROVIDER);
  } else {
    const filteredContracts = loggedInUser.contracts?.[UserRole.RECIPIENT].filter((contract: any) => {
      let result = true;
      if (status) {
        result = contract.status === status
      }
      if (cashkick) {
        result = result && contract.cashkick.toString() === cashkick.toString()
      }
      return result
    })
    User.populate(filteredContracts, {
      path: 'contractDetail',
    }).then((contracts: any) => {
      res
        .status(200)
        .json(contracts)
    })
      .catch((err: any) => {
        err.statusCode = err.statusCode || 500;
        console.error(err)
      })
  }
}

const getContractDetail = (req: Request, res: Response) => {
  const contractId = req.params.id
  const includeRef = (req.query.includes as string)?.split(",") || []
  includeRef.push("contractDetail")

  const pathsToInclude = includeRef?.map((field) => ({ path: field })) || []

  //@ts-ignore
  const loggedInUser = req.user

  const filteredContract = loggedInUser.contracts?.[loggedInUser.role].find((contract: any) => contract.contractDetail == contractId)

  if (!filteredContract) {
    // throw error
    return
  }

  User.populate(filteredContract, pathsToInclude).then((contract) => res.status(200).json(contract)).catch((err) => console.error(err))
}


export default { addNewContract, getContractDetail, getUserContracts }