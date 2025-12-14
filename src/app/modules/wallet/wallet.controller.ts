import { JwtPayload } from 'jsonwebtoken';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { WalletService } from "./wallet.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";





export const depositMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body; // optional
    const decodeToken = req.user as JwtPayload;

    const wallet = await WalletService.depositMoney(
        decodeToken?.userId,
        amount !== undefined ? Number(amount) : 0
    );

    sendResponse(res, {
        success: true,
        message: "Money deposited successfully",
        statusCode: StatusCodes.OK,
        data: wallet
    });
});



const withdrawMoney = catchAsync( async (req: Request, res: Response, next: NextFunction)=>{
    const {id,amount} = req.body;

    const decodeToken = req.user as JwtPayload;
    const userId = decodeToken.userId;

    const wallet = await WalletService.withdrawMoney(userId,id,amount);

    sendResponse(res,{
    success: true,
    message: "Money withdrawn successfully !*!",
    statusCode: StatusCodes.OK,
    data: wallet
    });
}); 
const sendMoney = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
      const { receiverId, amount } = req.body;
      const decodeToken = req.user as JwtPayload;     

      const result = await WalletService.sendMoney(decodeToken.userId, receiverId, Number(amount));

      sendResponse(res,{
        success: true,
        message: "Money sent successfully !*!",
        statusCode: StatusCodes.OK,
        data: result
      });
}); 
const blockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const { walletId } = req.params;

     const wallet = await WalletService.blockWallet(walletId);

     sendResponse(res,{
        success: true,
        message: "Wallet blocked successfully",
        statusCode: StatusCodes.OK,
        data: wallet
      });
}); 
const unblockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const { walletId } = req.params;

    const wallet = await WalletService.unblockWallet(walletId);

    sendResponse(res,{
        success: true,
        message: "Wallet unblocked successfully",
        statusCode: StatusCodes.OK,
        data: wallet
    });
}); 
const agentCashIn = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const { recieverId, amount } = req.body;
    const decodeToken = req.user as JwtPayload;
    const senderId= decodeToken.userId



    const wallet = await WalletService.agentCashIn(senderId, recieverId, Number(amount));

    sendResponse(res,{
        success: true,
        message: "Cash-in successful !*!",
        statusCode: StatusCodes.OK,
        data: wallet
    });
}); 
const agentCashOut = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const { agentRecieverId, amount } = req.body;
    const decodeToken = req.user as JwtPayload;
    const userSenderId= decodeToken.userId

    const wallet = await WalletService.agentCashOut(userSenderId, agentRecieverId, Number(amount));

    sendResponse(res,{
        success: true,
        message: "Cash-out successful",
        statusCode: StatusCodes.OK,
        data: wallet
    });
}); 
const getCommissionHistory = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
    const decodeToken = req.user as JwtPayload;
    const currentUserId= decodeToken.userId
    const query = req.query
    const result = await WalletService.getCommissionHistory( currentUserId,query as Record<string, string> );

     sendResponse(res,{
        success: true,
        message: "commission history successful !*!",
        statusCode: StatusCodes.OK,
        meta: result.meta,
        data: result.data,
    });
})

export const WalletController = {
    depositMoney,
    withdrawMoney,
    sendMoney,
    blockWallet,
    unblockWallet,
    agentCashIn,
    agentCashOut,
    getCommissionHistory
}