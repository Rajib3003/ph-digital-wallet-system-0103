import { JwtPayload } from "jsonwebtoken"
import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken"
import { User } from "../user/user.model"
import AppError from "../../errorHelpers/AppError"
import { StatusCodes } from "http-status-codes"
import bcrypt from "bcryptjs"
import { envVar } from "../../config/env"
import { IAuthProvider } from "../user/user.interface"



const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
    return {
       accessToken : newAccessToken
    }
}
const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId);
    if(!user){
        throw new AppError(StatusCodes.BAD_REQUEST,"auth service User do not recieved !*!")
    }
    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password as string);
    if(!isOldPasswordMatch){
        throw new AppError(StatusCodes.BAD_REQUEST,"Old Password is not matched !*!")
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.password as string);
    if(isSamePassword){
        throw new AppError(StatusCodes.BAD_REQUEST,"New Password can not be same as Old Password !*!")
    }
    user.password= await bcrypt.hash(newPassword, Number(envVar.BCRYPT_SALT_ROUND));     
    await user.save();
    
}
const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId);
    if(!user){
        throw new AppError(StatusCodes.BAD_REQUEST,"auth service User do not recieved !*!")
    }
    if(user.password && user.auths.some(providerObject => providerObject.provider === "Google")){
        throw new AppError(StatusCodes.BAD_REQUEST,"You have already set you password . Now you can change the password from your profile password update")
    }
    const hashPassword = await bcrypt.hash(plainPassword, Number(envVar.BCRYPT_SALT_ROUND));    
    const credentialsProvider : IAuthProvider = {
        provider: "credentials",
        providerId: user.email as string,
    } 
    const auths: IAuthProvider[] = [...user.auths, credentialsProvider]
    user.password = hashPassword
    user.auths = auths
    
    await user.save();

}

export const AuthService = {
    getNewAccessToken,
    changePassword,
    setPassword
}