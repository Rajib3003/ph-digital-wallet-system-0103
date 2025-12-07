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

//  const withdrawMoney = () => {

//  }
//  const sendMoney = () => {

//  }
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
    // withdrawMoney,
    // sendMoney,
    // blockWallet,
    // unblockWallet,
    // agentCashIn,
    // agentCashOut
}