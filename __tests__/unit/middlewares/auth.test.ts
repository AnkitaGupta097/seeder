import ApiError from "../../../src/utils/ApiError";
import httpStatus from 'http-status-codes'
import { isRoleAuth } from '../../../src/middlewares/auth'
import { UserRole } from "../../../src/utils/enums";
import jwt from 'jsonwebtoken'
import User from "../../../src/models/user";

describe("Auth Middleware", () => {
    //@ts-ignore
    let request: any;
    let response: any;

    beforeEach(() => {
        request = {
            get: () => null
        };
        response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => jest.resetAllMocks())

    it("should throw not authenticated error when no token is presents", () => {
        const next = jest.fn()

        isRoleAuth(UserRole.PROVIDER)(request, response, next).then(() => {
            expect(next).toHaveBeenCalledTimes(1)
            const error = next.mock.calls[0][0]
            expect(error).toBeInstanceOf(ApiError)
            expect(error.message).toBe("Not authenticated'. please login to access")
            expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED)
        })

    })

    it("should throw unauthorized error when token is invalid", () => {
        const next = jest.fn()
        request = {
            get: () => "Bearer token.token.token"
        };
        jest.spyOn(jwt, "verify").mockReturnValue()

        isRoleAuth(UserRole.PROVIDER)(request, response, next).then(() => {
            expect(next).toHaveBeenCalledTimes(1)
            const error = next.mock.calls[0][0]
            expect(error).toBeInstanceOf(ApiError)
            expect(error.message).toBe("Not authenticated")
            expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED)
        })

    })

    it("should throw forbidden error when token is valid but role does not have access", () => {
        const next = jest.fn()
        request = {
            get: () => "Bearer token.token.token"
        };
        //@ts-ignore
        jest.spyOn(jwt, "verify").mockReturnValue({ role: UserRole.RECIPIENT })

        isRoleAuth(UserRole.PROVIDER)(request, response, next).then(() => {

            expect(next).toHaveBeenCalledTimes(1)
            const error = next.mock.calls[0][0]
            expect(error).toBeInstanceOf(ApiError)
            expect(error.message).toBe("Unauthorized access")
            expect(error.statusCode).toBe(httpStatus.FORBIDDEN)
        })
    })

    it("should call to next middleware when user is authorized", () => {
        const next = jest.fn()
        request = {
            get: () => "Bearer token.token.token"
        };
        const user = { role: UserRole.PROVIDER, userId: 1, name: 'name', email: "email" }
        //@ts-ignore
        jest.spyOn(jwt, "verify").mockReturnValue({ role: UserRole.PROVIDER, userId: 1 })
        const findByIdMock = jest.spyOn(User, "findById").mockResolvedValue(user)

        isRoleAuth(UserRole.PROVIDER)(request, response, next).then(() => {

            expect(next).toHaveBeenCalledTimes(1)
            expect(findByIdMock).toHaveBeenCalledTimes(1)
            expect(findByIdMock).toHaveBeenCalledWith(1)
            expect(request.user).toBe(user)
        })
    })

})