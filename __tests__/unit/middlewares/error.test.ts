import { MongooseError } from "mongoose";
import { errorConverter } from "../../../src/middlewares/error";
import ApiError from "../../../src/utils/ApiError";
import httpStatus from 'http-status-codes'

describe("Error Middleware", () => {

    it("should handle errors correctly", () => {
        const serverError = new Error("Internal server error")
        const next = jest.fn()

        //@ts-ignore
        errorConverter(serverError, {}, {}, next)

        expect(next).toHaveBeenCalledTimes(1)
        const error = next.mock.calls[0][0]
        expect(error).toBeInstanceOf(ApiError)
        expect(error.message).toBe("Internal server error")
        expect(error.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR)
    })

    it("should handle mongoose errors correctly", () => {
        const mongooseSchemaError = new MongooseError("mongoose error")
        const next = jest.fn()

        //@ts-ignore
        errorConverter(mongooseSchemaError, {}, {}, next)

        expect(next).toHaveBeenCalledTimes(1)
        const error = next.mock.calls[0][0]
        expect(error).toBeInstanceOf(ApiError)
        expect(error.message).toBe("mongoose error")
        expect(error.statusCode).toBe(httpStatus.BAD_REQUEST)
    })
})