import { convertToDate } from '../../../src/utils/dateUtil'

describe("Date Util", () => {

    it("converToDate should convert date string to Date Object correctly", () => {
        const dateString = "02-23-2020"  // MM-DD-YYYY
        const outputDateObject = convertToDate(dateString)
        const expectedDate = new Date(2020, 1, 23)
        expect(outputDateObject).toEqual(expectedDate)
    })

})