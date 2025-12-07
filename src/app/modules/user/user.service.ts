import { StatusCodes } from "http-status-codes";
import { envVar } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";


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

// const getAllUsers = async (query: Record<string, string>) => {


    // const queryBuilder = new QueryBuilder(User.find(), query)
const getAllUsers = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(User.find(), query );

    const users = queryBuilder
        .search(userSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        users.build(),
        queryBuilder.getMeta()

    ])

    // const allUser = await User.find({})
    // const total = await User.countDocuments();
    // const totalUser = Number(total)

      return {
            data,
            meta
        }
}

const getSingleUser = async (UserId: string) => {
    if(!UserId){
        throw new AppError(StatusCodes.BAD_REQUEST,"User Id Not Found !*!")
    }
    const singleUser = await User.findById(UserId)
    return singleUser
}

const deleteUser = async (UserId: string) => {
  await User.findByIdAndDelete(UserId)
  
    return null
}

const updatedUser = async (UserId: string , payload: Partial<IUser>) => {
    const user = await User.findById(UserId)

    const userResult = await User.findByIdAndUpdate(UserId, payload, {new: true, runValidators: true})

    console.log(user)
    console.log(userResult)

    return userResult
    
    
}

export const UserService = {
    createUser,
    getAllUsers,
    getSingleUser,
    deleteUser,
    updatedUser
}