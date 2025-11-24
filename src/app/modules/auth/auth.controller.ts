/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import passport from "passport";
import AppError from "../../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { createUserToken } from "../../utils/userToken";
import { setAuthCookie } from "../../utils/setCookie";
import { AuthService } from "./auth.service";







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

        const userTokens = createUserToken(user)

        setAuthCookie(res, userTokens)

        sendResponse(res,{
            success: true,
            message: "User Login Successfully !*!",
            statusCode: StatusCodes.OK,
            data: {
                userToken: userTokens,
                user: userWithoutPassword,
                
            }
        })
     } )(req,res,next)
    
})

const getNewAccessToken = catchAsync( async (req: Request, res: Response) => {
    
    const refreshToken = req.cookies.refreshToken
    


    if(!refreshToken){
        throw new AppError(StatusCodes.BAD_REQUEST,"Refresh Token do not recieved !*!")
    }
    const tokenInfo = await AuthService.getNewAccessToken(refreshToken) 
   

     setAuthCookie(res, tokenInfo)
    sendResponse(res,{
        success: true,
        message: "Access Token create successfully",
        statusCode: StatusCodes.OK,
        data: tokenInfo
    })
})


export const AuthController = {
    credentialsLogin,
    getNewAccessToken
}