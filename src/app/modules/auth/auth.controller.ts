import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import passport from "passport";





const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
     passport.authenticate('local', ()=>{
        
     } )
    
})


export const AuthController = {
    credentialsLogin
}