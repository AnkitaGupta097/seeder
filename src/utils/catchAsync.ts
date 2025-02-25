import { NextFunction, Request, Response } from "express";


const catchAsync = (fn: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        return fn(req, res, next)?.catch((err: Error) => { next(err) });
    }
};

export default catchAsync;