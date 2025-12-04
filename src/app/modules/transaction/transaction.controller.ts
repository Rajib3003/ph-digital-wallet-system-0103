import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";


const getMyTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    return;
}); 
const getAllTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
return;
}); 
const getTransactionsByWallet = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
return;
}); 



export const TransactionController = {
    getMyTransactions,
    getAllTransactions,
    getTransactionsByWallet
};