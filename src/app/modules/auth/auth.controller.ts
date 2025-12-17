/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import passport from "passport";
import AppError from "../../errorHelpers/AppError";
import StatusCodes from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { createUserToken } from "../../utils/userToken";
import { setAuthCookie } from "../../utils/setCookie";
import { AuthService } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../../config/env";







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

const getNewAccessToken = catchAsync( async (req: Request, res: Response, next:NextFunction) => {
    
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
const logout = catchAsync( async (req: Request, res: Response,next:NextFunction) => {
    
    res.clearCookie("accessToken",{
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    })
    res.clearCookie("refreshToken",{
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    })
    sendResponse(res,{
        success: true,
        message: "User logged out successfully !*!",
        statusCode: StatusCodes.OK,
        data: null
    })
})
const changePassword = catchAsync( async (req: Request, res: Response,next:NextFunction) => {
    const decodedToken = req.user;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    if(!decodedToken){
        throw new AppError(StatusCodes.BAD_REQUEST, "Decoded token is not recieved")
    }
    await AuthService.changePassword(oldPassword, newPassword, decodedToken);

    sendResponse(res,{
        success: true,
        message: "Password changed successfully !*!",
        statusCode: StatusCodes.OK,
        data: null
    })
})
const setPassword = catchAsync( async (req: Request, res: Response,next:NextFunction) => {
    
    const decodedToken = req.user as JwtPayload;       
    const {password} = req.body;   
    
    if(!decodedToken){
        throw new AppError(StatusCodes.BAD_REQUEST, "Decoded token is not recieved !*!")
    }
    await AuthService.setPassword(decodedToken.userId, password);
    
    sendResponse(res,{
        success: true,
        message: "Password Changed successfully !*!",
        statusCode: StatusCodes.OK,
        data: null
    })
});
const forgotPassword = catchAsync( async (req: Request, res: Response,next:NextFunction) => {
    const { email } = req.body;
    await AuthService.forgotPassword(email);
    sendResponse(res,{
        success: true,
        message: "Email sent successfully !*!",
        statusCode: StatusCodes.OK,
        data: null
    })
});

const resetPassword = catchAsync( async (req: Request, res: Response,next:NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    
    if(!decodedToken){
        throw new AppError(StatusCodes.BAD_REQUEST, "Decoded token is not recieved !*!")
    }
    await AuthService.resetPassword(req.body, decodedToken);
    
    sendResponse(res,{
        success: true,
        message: "Password reset successfully !*!",
        statusCode: StatusCodes.OK,
        data: null
    })
});
const googleCallBackController = catchAsync( async (req: Request, res: Response,next:NextFunction) => {

    
    

    let redirectTo = req.query.state ? req.query.state as string : "";
    if(redirectTo.startsWith("/")){
        redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    
    if(!user){
        throw new AppError(StatusCodes.UNAUTHORIZED, "User Not Found !*!")
    }
   
        
    const tokenInfo = createUserToken(user)
    setAuthCookie(res, tokenInfo)
    

    res.redirect(`${envVar.FRONTEND_URL}/${redirectTo}`);
    
});


export const AuthController = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword,
    googleCallBackController
}