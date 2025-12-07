/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { WalletService } from "./wallet.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";



export const depositMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body; // optional
    const decodeToken = req.user as JwtPayload;

    const wallet = await WalletService.depositMoney(
        decodeToken?.userId,
        amount !== undefined ? Number(amount) : undefined
    );

    sendResponse(res, {
        success: true,
        message: amount ? "Money deposited successfully" : "Wallet opened successfully",
        statusCode: StatusCodes.OK,
        data: wallet
    });
});


// const withdrawMoney = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
// const { amount } = req.body;
//       const userId = req.user?.id as string;

//       const wallet = await WalletService.withdrawMoney(userId, Number(amount));

//       sendResponse(res,{
//         success: true,
//         message: "Money withdrawn successfully",
//         statusCode: StatusCodes.OK,
//         data: wallet
//       });
// }); 
// const sendMoney = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
// const { receiverId, amount } = req.body;
//       const senderId = req.user?.id as string;

//       const result = await WalletService.sendMoney(senderId, receiverId, Number(amount));

//       sendResponse(res,{
//         success: true,
//         message: "Money sent successfully",
//         statusCode: StatusCodes.OK,
//         data: result
//       });
// }); 
// const blockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
// const { walletId } = req.params;

//       const wallet = await WalletService.blockWallet(walletId);

//       sendResponse(res,{
//         success: true,
//         message: "Wallet blocked successfully",
//         statusCode: StatusCodes.OK,
//         data: wallet
//       });
// }); 
// const unblockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
// const { walletId } = req.params;

//       const wallet = await WalletService.unblockWallet(walletId);

//       sendResponse(res,{
//         success: true,
//         message: "Wallet unblocked successfully",
//         statusCode: StatusCodes.OK,
//         data: wallet
//       });
// }); 
// const agentCashIn = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
// const { userId, amount } = req.body;
//       const agentId = req.user?.id as string;

//       const wallet = await WalletService.agentCashIn(agentId, userId, Number(amount));

//       sendResponse(res,{
//         success: true,
//         message: "Cash-in successful",
//         statusCode: StatusCodes.OK,
//         data: wallet
//       });
// }); 
// const agentCashOut = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
// const { userId, amount } = req.body;
//       const agentId = req.user?.id as string;

//       const wallet = await WalletService.agentCashOut(agentId, userId, Number(amount));

//       sendResponse(res,{
//         success: true,
//         message: "Cash-out successful",
//         statusCode: StatusCodes.OK,
//         data: wallet
//       });
// }); 

export const WalletController = {
    depositMoney,
    // withdrawMoney,
    // sendMoney,
    // blockWallet,
    // unblockWallet,
    // agentCashIn,
    // agentCashOut
}