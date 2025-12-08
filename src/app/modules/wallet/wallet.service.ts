import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import mongoose from "mongoose";
import { Wallet } from "./wallet.model";
import { WalletStatus } from "./wallet.interface";
import { TransactionService } from "../transaction/transaction.service";
import { TransactionStatus, TransactionType } from "../transaction/transaction.interface";



export const depositMoney = async (userId: string, amount?: number) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find wallet for user
        let wallet = await Wallet.findOne({ owner: userId }).session(session);

        // If wallet doesn't exist, create it (Mongoose default balance = 50)
        if (!wallet) {
            const createdWallets = await Wallet.create([{
                owner: userId,
                status: WalletStatus.ACTIVE
            }], { session });
            wallet = createdWallets[0];

            await TransactionService.createTransaction({
                type: TransactionType.TOPUP,   
                to: wallet.owner,
                amount: wallet.balance ?? 50,               
                status: TransactionStatus.COMPLETED
            });

        }

        // Ensure balance is a number (default safety)
        wallet.balance = wallet.balance ?? 50;

        // Check if wallet is blocked
        if (wallet.status === WalletStatus.BLOCKED) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Wallet is blocked");
        }

        // Add deposit if amount is provided
        if (amount !== undefined) {
            const numericAmount = Number(amount);
            if (isNaN(numericAmount) || numericAmount <= 0) {
                throw new AppError(StatusCodes.BAD_REQUEST, "Deposit amount must be greater than zero");
            }

            wallet.balance += numericAmount;
            

            // Create a transaction for this deposit
            await TransactionService.createTransaction({
                type: TransactionType.TOPUP,
                to: wallet.owner,                
                amount: numericAmount,
                status: TransactionStatus.COMPLETED
            });
        }

        // Save wallet
        await wallet.save({ session });

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        return wallet;

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
};

 const withdrawMoney = async (userId: string, amount?: number) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    console.log("session===",session)

    try {
        // Find wallet for user
        const wallet = await Wallet.findOne({ owner: userId }).session(session);
        console.log("wallet===",wallet)
        if (!wallet) {
            throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
        }
        // Check if wallet is blocked
        if (wallet.status === WalletStatus.BLOCKED) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Wallet is blocked");
        }
        // Validate amount
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Withdrawal amount must be greater than zero");
        }
        if (wallet.balance < numericAmount) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient balance");
        }
        console.log("numericAmount===",numericAmount)
        // Deduct amount
        wallet.balance -= numericAmount;
        // Create a transaction for this withdrawal
        await TransactionService.createTransaction({
            type: TransactionType.WITHDRAW,
            from: wallet.owner,
            amount: numericAmount,
            status: TransactionStatus.COMPLETED
        }); 
        // Save wallet
        await wallet.save({ session });
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        return wallet;
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }

 }
 const sendMoney = async (senderId: string, receiverId: string, amount:number) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Find wallets
        const senderWallet = await Wallet.findOne({ owner: senderId }).session(session);
        const receiverWallet = await Wallet.findOne({ owner: receiverId }).session(session);

        if (!senderWallet) {
            throw new AppError(StatusCodes.NOT_FOUND, "Sender's wallet not found");
        }
        if (!receiverWallet) {
            throw new AppError(StatusCodes.NOT_FOUND, "Receiver's wallet not found");
        }
        // Check if wallets are blocked
        if (senderWallet.status === WalletStatus.BLOCKED) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Sender's wallet is blocked");
        }
        if (receiverWallet.status === WalletStatus.BLOCKED) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Receiver's wallet is blocked");
        }
        // Validate amount
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Transfer amount must be greater than zero");
        }
        if (senderWallet.balance < numericAmount) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient balance in sender's wallet");
        }
        // Perform transfer
        senderWallet.balance -= numericAmount;
        receiverWallet.balance += numericAmount;
        // Create a transaction for this transfer
        await TransactionService.createTransaction({
            type: TransactionType.SEND,
            from: senderWallet.owner,
            to: receiverWallet.owner,
            amount: numericAmount,
            status: TransactionStatus.COMPLETED
        });
        // Save wallets
        await senderWallet.save({ session });
        await receiverWallet.save({ session });
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        return {
            senderWallet,
            receiverWallet
        };
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }

 }
//  const blockWallet = () => {

//  }
//  const unblockWallet = () => {

//  }
//  const agentCashIn = () => {

//  }
//  const agentCashOut = () => {

//  }



export const WalletService = {
    depositMoney,
    withdrawMoney,
    sendMoney,
    // blockWallet,
    // unblockWallet,
    // agentCashIn,
    // agentCashOut
}