import { Request } from "express";

export const getSortAndPagination = (req: Request) => {

    const { sortBy = "createdAt", sortOrder = "desc", page = "1", limit = "5" } = req.query as { [key: string]: string }

    const sortObj: any = {}
    sortObj[sortBy as string] = sortOrder === 'desc' ? -1 : 1

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const pageSize = parseInt(limit)

    return { skip, pageSize, sortObj }

}