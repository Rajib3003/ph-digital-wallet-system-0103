/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import { envVar } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";
import mongoose from "mongoose";
import { Wallet } from "../wallet/wallet.model";
import { TransactionStatus, TransactionType } from "../transaction/transaction.interface";
import { createTransactionRecord } from "../../middlewares/createTransactionRecord";


const createUser = async (payload: Partial<IUser>) => { 

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { email, password, ...rest } = payload;
        
        const isUserExist = await User.findOne({ email }).session(session);
        if (isUserExist) {
            throw new AppError(409, "User Already Exist!");
        }
        
        const hashedPassword = await bcrypt.hash(password as string, Number(envVar.BCRYPT_SALT_ROUND));
        
        const authProvider: IAuthProvider = {provider: 'credentials', providerId: email as string};
        const user = await User.create([{
            email,
            password: hashedPassword,
            auths: [authProvider],
            ...rest
        }], { session });
        
        const wallet = await Wallet.create([{
            owner: user[0]._id,
            balance: Number(envVar.INITIAL_BALANCE) || 0
        }], { session });
        
        user[0].wallet = wallet[0]._id;
        await user[0].save({ session });
        
        const superAdmin = await User.findOne({ role: Role.SUPER_ADMIN });
        if (!superAdmin) throw new AppError(500, "Super Admin not found");
                const adminWallet = await Wallet.findOne({ owner: superAdmin._id }).session(session);
        if (!adminWallet) throw new AppError(400, "Admin wallet not found");
        
        if (!adminWallet || adminWallet.balance < (envVar.INITIAL_BALANCE ? Number(envVar.INITIAL_BALANCE) : 0)) {
            throw new AppError(400, "Admin balance insufficient");
        }
        adminWallet.balance -= envVar.INITIAL_BALANCE ? Number(envVar.INITIAL_BALANCE) : 0;
        await adminWallet.save({ session });        

        const numericAmount =  envVar.INITIAL_BALANCE ? Number(envVar.INITIAL_BALANCE) : 0; 
        await createTransactionRecord(
            adminWallet._id,
            wallet[0]._id,
            numericAmount,
            TransactionType.CASHIN,
            TransactionStatus.COMPLETED,
            session,
            {}
        );
                  

        await session.commitTransaction();
        session.endSession();
        return user[0];

    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        throw new AppError(500, error.message);
    }
}

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
    

    const userResult = await User.findByIdAndUpdate(UserId, payload, {new: true, runValidators: true})

    

    return userResult
    
    
}

export const UserService = {
    createUser,
    getAllUsers,
    getSingleUser,
    deleteUser,
    updatedUser
}