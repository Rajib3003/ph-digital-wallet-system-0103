import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";


 

export const createUserToken = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
 

    const accessToken = generateToken(jwtPayload, envVar.JWT_ACCESS_SECRET,envVar.JWT_ACCESS_EXPIRES)

    const refreshToken = generateToken(jwtPayload, envVar.JWT_REFRESH_SECRET, envVar.JWT_REFRESH_EXPIRES)

    return{
        accessToken,
        refreshToken
    }
}


export const createNewAccessTokenWithRefreshToken = async (refreshToken : string) => {
    const veryfyRefreshToken = verifyToken(refreshToken, envVar.JWT_REFRESH_SECRET) as JwtPayload    
    const isUserExist = await User.findOne({email: veryfyRefreshToken.email})
    if(!isUserExist){
        throw new AppError(StatusCodes.BAD_REQUEST, "User does not Exist !*!")
    }

    const jwtPayload = {
        userId : isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    } 

    const accessToken = generateToken(jwtPayload, envVar.JWT_ACCESS_SECRET,envVar.JWT_ACCESS_EXPIRES)

    return accessToken       
    
}