import {
    StatusCodes,
} from 'http-status-codes';

class ApiError extends Error {

    constructor(statusCode: StatusCodes, message: string, stack = "") {
        super(message);
        //@ts-ignore
        this.statusCode = statusCode;

        if (stack) {
            this.stack = stack;
        }
    }
}

export default ApiError;