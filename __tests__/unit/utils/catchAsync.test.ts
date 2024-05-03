import catchAsync from "../../../src/utils/catchAsync"

describe("Catch Async", () => {

    it("should catch error thrown from any async method", () => {
        const error = new Error("An error!");
        const asyncMethod = (req: any, res: any, next: any) => Promise.resolve().then(() => { throw error })
        const next = jest.fn()
        //@ts-ignore
        catchAsync(asyncMethod)({}, {}, next).then(() => {
            expect(next).toHaveBeenCalledTimes(1)
            expect(next).toHaveBeenCalledWith(error)
        })

    })

    it("should not call next func in case when no error thrown from async method", () => {
        const error = new Error("An error!");
        const asyncMethod = (req: any, res: any, next: any) => Promise.resolve("no error")
        const next = jest.fn()
        //@ts-ignore
        catchAsync(asyncMethod)({}, {}, next).then(() => {
            expect(next).toHaveBeenCalledTimes(0)
        })

    })
})