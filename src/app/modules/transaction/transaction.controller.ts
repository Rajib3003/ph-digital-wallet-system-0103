/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { TransactionService } from "./transaction.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";


const getMyTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    
    const decodeToken = req.user as JwtPayload
     
    if(!decodeToken){
        throw new AppError(StatusCodes.BAD_REQUEST,"DecodeToken not found in request !*!");
    } 

      const transactions = await TransactionService.getMyTransactions(decodeToken?.userId);

      sendResponse(res,{
        success: true,
        message: "Your transactions fetched successfully !*!",
        statusCode: StatusCodes.OK,
        data: transactions
      });
}); 
const getAllTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const transactions = await TransactionService.getAllTransactions();

      sendResponse(res,{
        success: true,
        message: "All transactions fetched successfully !*!",
        statusCode: StatusCodes.OK,
        data: transactions
      });

}); 
const getTransactionsByWallet = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{      
      const { walletId } = req.params;  
      const transactions = await TransactionService.getTransactionsByWallet(walletId);
      sendResponse(res, {
        success: true,
        message: "Wallet transactions fetched successfully !*!",
        statusCode: StatusCodes.OK,
        data: transactions        
      });
}); 
const createTransaction = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const transactionData = req.body;    
        const transaction = await TransactionService.createTransaction(transactionData);
        console.log("transaction====",transaction)
        sendResponse(res,{
            success: true,
            message: "Transaction created successfully !*!",
            statusCode: StatusCodes.OK,
            data: transaction
        });
});



export const TransactionController = {
    getMyTransactions,
    getAllTransactions,
    getTransactionsByWallet,
    createTransaction
};