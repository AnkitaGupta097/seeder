import { Request, Response } from "express";


const get404 = (req: Request, res: Response)=> {
   res.status(404).json("route not found");
}

export default get404