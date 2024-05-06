import { Request } from 'express'
import { getSortAndPagination } from '../../../src/utils/util'

describe("Util", () => {

    it("getSortAndPagination ", () => {
        const outputObject = getSortAndPagination({ query: {} } as Request)
        const expectedObject = { skip: 0, pageSize: 5, sortObj: { createdAt: -1 } }
        expect(outputObject).toEqual(expectedObject)
    })

})