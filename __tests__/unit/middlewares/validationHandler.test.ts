import { Request, Response } from 'express';
import validationHandler from '../../../src/middlewares/validationHandler'
import { Result, validationResult } from "express-validator";
import ValidationError from '../../../src/utils/ValidationError';
import { StatusCodes } from "http-status-codes";

jest.mock('express-validator', () => {
    const originalModule = jest.requireActual('express-validator');

    return {
        __esModule: true,
        ...originalModule,
        validationResult: jest.fn(),
    };
});

describe("Validation Handler", () => {
    let mockValidationResult: any;
    beforeAll(() => {
        mockValidationResult = {
            isEmpty: jest.fn(),
        };

        //@ts-ignore
        validationResult.mockReturnValue(mockValidationResult);
    })

    afterAll(() => jest.resetAllMocks())

    it("should throw validation error when validationResult contains error", () => {
        const next = jest.fn()

        mockValidationResult.isEmpty.mockReturnValue(false);

        validationHandler({} as Request, {} as Response, next)
        expect(next).toHaveBeenCalledTimes(1)
        const validationError = next.mock.calls[0][0]
        expect(validationError).toBeInstanceOf(ValidationError)
        expect(validationError.statusCode).toBe(StatusCodes.BAD_REQUEST)
        expect(validationError.message).toBe("Invalid input(s)")
    })

    it("should call to next middleware when validationResult does not contain error", () => {
        const next = jest.fn()

        mockValidationResult.isEmpty.mockReturnValue(true);

        validationHandler({} as Request, {} as Response, next)
        expect(next).toHaveBeenCalledTimes(1)
        const validationError = next.mock.calls[0][0]
        expect(validationError).toBe(undefined)
    })
})