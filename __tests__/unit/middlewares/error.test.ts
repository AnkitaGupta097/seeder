import { MongooseError } from "mongoose";
import { errorConverter, errorHandler } from "../../../src/middlewares/error";
import ApiError from "../../../src/utils/ApiError";
import httpStatus from 'http-status-codes'
import logger from "../../../src/logger";

describe("Error Middleware", () => {
    //@ts-ignore
    let request: any;
    let response: any;

    beforeEach(() => {
        request = {
        };
        response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => jest.resetAllMocks())

    it("should handle errors correctly", () => {
        const serverError = new Error("Internal server error")
        const next = jest.fn()

        errorConverter(serverError, request, response, next)

        expect(next).toHaveBeenCalledTimes(1)
        const error = next.mock.calls[0][0]
        expect(error).toBeInstanceOf(ApiError)
        expect(error.message).toBe("Internal server error")
        expect(error.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR)
    })

    it("should handle mongoose errors correctly", () => {
        const mongooseSchemaError = new MongooseError("mongoose error")
        const next = jest.fn()

        errorConverter(mongooseSchemaError, request, response, next)

        expect(next).toHaveBeenCalledTimes(1)
        const error = next.mock.calls[0][0]
        expect(error).toBeInstanceOf(ApiError)
        expect(error.message).toBe("mongoose error")
        expect(error.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it("should call next with APi Error", () => {
        const apiError = new ApiError(httpStatus.UNAUTHORIZED, "unauthorized user")
        const next = jest.fn()

        errorConverter(apiError, request, response, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(apiError)
    })

    it("should send error response correctly", () => {
        const apiError = new ApiError(httpStatus.BAD_REQUEST, "an eror")
        const next = jest.fn()
        const responseObj = {
            code: httpStatus.BAD_REQUEST,
            message: "an eror"
        };
        let spy = jest.spyOn(logger, 'error').mockImplementation();

        errorHandler(apiError, request, response, next)

        expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST)
        expect(response.json).toHaveBeenCalledWith(responseObj)
        expect(spy).toHaveBeenCalledWith(apiError)
    })
})