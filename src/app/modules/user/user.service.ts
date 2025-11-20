import { envVar } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";


const createUser = async (payload: Partial<IUser>) => {
    const { email,password, ...rest} = payload;

    const isUserExist = await User.findOne({email})

    if(isUserExist){
        throw new AppError(409,"user Already Exist !*!")        
    }

    const hashedPassword = await bcrypt.hash(password as string, Number(envVar.BCRYPT_SALT_ROUND) )
    

    const authProvider: IAuthProvider = {provider: 'credentials', providerId: email as string}

    

    const user = await User.create({        
        email,
        password : hashedPassword,
        auths: [authProvider], 
        ...rest   
    })
    return user
}

export const UserService = {
    createUser
}