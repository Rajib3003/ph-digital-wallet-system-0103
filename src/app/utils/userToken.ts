import { envVar } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";


 

export const createUserToken = (user: Partial<IUser>) => {
    const jwtPayload = {
        user_id: user._id,
        email: user.email,
        role: user.role
    }
 

    const accessToken = generateToken(jwtPayload, envVar.JWT_ACCESS_SECRET,envVar.JWT_ACCESS_EXPIRES)

    return{
        accessToken
    }
}