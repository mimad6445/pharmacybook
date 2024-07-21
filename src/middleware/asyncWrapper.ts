import { Request, Response, NextFunction } from "express";

module.exports = (asyncfn : Function)=>{
    return (req : Request,res : Response,next: NextFunction)=>{
        asyncfn(req,res,next)
            .catch((err:any)=>{
                next(err)
            })
    }
}