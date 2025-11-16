import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";


const createUser = async (payload: Partial<IUser>) => {
    const {name, email, password} = payload;

    const isUserExist = await User.findOne({email})

    if(isUserExist){
        const error = new Error("User Already Exist");
        (error as any).statusCode = 401;
        throw error;
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