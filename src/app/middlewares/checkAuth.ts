import { NextFunction, Request, Response } from "express"
import { verifyToken } from "../utils/jwt";
import { envVar } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { User } from "../modules/user/user.model";
import { isActived } from "../modules/user/user.interface";


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessTokenRecieved = req.headers.authorization;

        if(!accessTokenRecieved){
            throw new AppError(StatusCodes.BAD_REQUEST,"accessToken is not access !*!")
        }

        const verifiedToken = verifyToken(accessTokenRecieved,envVar.JWT_ACCESS_SECRET) as JwtPayload
        const isUserExist = await User.findOne({email: verifiedToken.email})

        if(!isUserExist){
            throw new AppError(StatusCodes.BAD_REQUEST,"User does not Exist !*!")
        }
        if(!isUserExist?.isVerified){
            throw new AppError(StatusCodes.BAD_REQUEST,"User is not Verified Yet !*!")
        }
        if(isUserExist.isActived === isActived.BLOCKED || isUserExist.isActived === isActived.INACTIVE ){
            throw new AppError(StatusCodes.BAD_REQUEST,`User is ${isUserExist.isActived} !*!`)
        }
        if(isUserExist.isDeleted){
            throw new AppError(StatusCodes.BAD_REQUEST,"User is Deleted !*!")
        }
        if(!authRoles.includes(verifiedToken.role)){
             throw new AppError(StatusCodes.BAD_REQUEST,"This Role is not permitated !*!")
        }
        req.user = verifiedToken        
        next()
    } catch (error) {       
        next(error)
    }
    
}