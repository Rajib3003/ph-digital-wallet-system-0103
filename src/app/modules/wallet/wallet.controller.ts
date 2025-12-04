import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";



const depositMoney = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    
return;
}); 
const withdrawMoney = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
return;
}); 
const sendMoney = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
return;
}); 
const blockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
return;
}); 
const unblockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
return;
}); 
const agentCashIn = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
return;
}); 
const agentCashOut = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
return;
}); 

export const WalletController = {
    depositMoney,
    withdrawMoney,
    sendMoney,
    blockWallet,
    unblockWallet,
    agentCashIn,
    agentCashOut
}