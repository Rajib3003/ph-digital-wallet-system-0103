/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import passport from "passport";
import AppError from "../../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { createUserToken } from "../../utils/userToken";







const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
     passport.authenticate('local', async (error: any , user: any, info: any)=>{
        if(error){
            return next(error)
        }
        if(!user){
            return next(new AppError(StatusCodes.UNAUTHORIZED, info.message))
        }

         const { password: _password, ...userWithoutPassword } = user.toObject(); 
        
        if(!_password){
            return next(new AppError(StatusCodes.BAD_REQUEST, "Password is required !*!"))
        }

        const userToken = createUserToken(user)

        sendResponse(res,{
            success: true,
            message: "User Login Successfully !*!",
            statusCode: StatusCodes.OK,
            data: {
                user: userWithoutPassword,
                userToken: userToken,
            }
        })
     } )(req,res,next)
    
})


export const AuthController = {
    credentialsLogin
}