import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";


const createUser = async (payload: Partial<IUser>) => {
    const {name, email, password} = payload;

    const isUserExist = await User.findOne({email})

    if(isUserExist){
        throw new AppError(409,"user Already Exist !*!")        
    }

    const authProvider: IAuthProvider = {provider: 'credentials', providerId: email as string}

    const user = await User.create({
        name,
        email,
        auths: [authProvider],    
    })
    return user
}

export const UserService = {
    createUser
}