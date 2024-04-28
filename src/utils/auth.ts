import jwt from 'jsonwebtoken'

const createJWTToken = (payload: any) => {
   const JWT_EXPIRY_IN = process.env.JWT_EXPIRY_IN
   const JWT_SECRET = process.env.JWT_SECRET as string
   return jwt.sign({ ...payload }, JWT_SECRET, { "expiresIn": JWT_EXPIRY_IN })
}

export default { createJWTToken }