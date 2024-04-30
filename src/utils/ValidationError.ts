import { Result } from 'express-validator';
import {
    StatusCodes,
} from 'http-status-codes';

class ValidationError extends Error {

    constructor(statusCode: StatusCodes, message: string, errors: Result) {
        super(message);
        //@ts-ignore
        this.statusCode = statusCode || StatusCodes.BAD_REQUEST;
        //@ts-ignore
        this.errors = errors;

    }
}

export default ValidationError;