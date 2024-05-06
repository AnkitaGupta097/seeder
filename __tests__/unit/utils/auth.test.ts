import jwt from 'jsonwebtoken'
import authUtil from '../../../src/utils/auth'
import { UserRole } from '../../../src/utils/enums';

describe("Auth Util", () => {

    afterEach(() => jest.resetAllMocks())

    it("createJWTToken should work", () => {
        const payload = { userId: "1", role: UserRole.RECIPIENT }
        //@ts-ignore
        const mockedJwtSign = jest.spyOn(jwt, "sign").mockReturnValue("token")
        authUtil.createJWTToken(payload)
        expect(mockedJwtSign).toHaveBeenCalledWith(payload, process.env.JWT_SECRET, { "expiresIn": process.env.JWT_EXPIRY_IN })
    })

})