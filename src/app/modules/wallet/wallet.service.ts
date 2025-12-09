/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import mongoose from "mongoose";
import { Wallet } from "./wallet.model";
import { WalletStatus } from "./wallet.interface";
import { TransactionService } from "../transaction/transaction.service";
import { TransactionStatus, TransactionType } from "../transaction/transaction.interface";
import { Transaction } from "../transaction/transaction.model";
import { getSystemWallet } from "../../utils/getSystemWallet";


// export const getSystemWallet = async () => {
//   const systemUser = await User.findOne({ role: "SUPER_ADMIN" });
//   if (!systemUser) throw new Error("Super Admin not found for system wallet");

//   let systemWallet = await Wallet.findOne({ owner: systemUser._id });

//   const startingBalance = Number(envVar.SUPER_ADMIN_DEFAULT_BALANCE) || 1000000;

  
//   if (!systemWallet) {
//     systemWallet = await Wallet.create({
//       owner: systemUser._id,
//       balance: startingBalance,
//     });
//   }

  
//   if (systemWallet.balance <= 0) {
//     systemWallet.balance = startingBalance;
//     await systemWallet.save();
//   }

//   return systemWallet;
// };


export const depositMoney = async (userId: string, amount?: number) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate amount
    amount = Number(amount);
    if (isNaN(amount) || amount <= 0) {
      amount = Number(process.env.INITIAL_BALANCE) || 50; // default 50
    }

    const userWallet = await Wallet.findOne({ owner: userId }).session(session);
    if (!userWallet) throw new AppError(404, "User wallet not found");

    const fromWallet = await getSystemWallet();

    if (fromWallet.balance < amount)
      throw new AppError(400, "System wallet insufficient balance");

    // Update balances
    fromWallet.balance -= amount;
    userWallet.balance += amount;

    await fromWallet.save({ session });
    await userWallet.save({ session });

    // Create transaction record
    await Transaction.create(
      [
        {
          from: fromWallet._id,
          to: userWallet._id,
          amount,
          type: TransactionType.TOPUP,
          status: TransactionStatus.COMPLETED,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return userWallet;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};



 const withdrawMoney = async (userId: string, amount?: number) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    

    try {
        // Find wallet for user
        const wallet = await Wallet.findOne({ owner: userId }).session(session);
        
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
 const blockWallet = async (walletId : string) => {
    const wallet = await Wallet.findById(walletId);
    if(!wallet){
        throw new AppError(StatusCodes.NOT_FOUND,"Wallet not found !*!");
    }
    wallet.status = WalletStatus.BLOCKED;
    await wallet.save();
    return wallet;

 }
 const unblockWallet = async (walletId : string) => {
    const wallet = await Wallet.findById(walletId);
    if(!wallet){
        throw new AppError(StatusCodes.NOT_FOUND,"Wallet not found !*!");
    }
    wallet.status = WalletStatus.ACTIVE;
    await wallet.save();
    return wallet;
 }
 const agentCashIn = async (senderAgentId: string, recieverId: string, amount: number) => {   
    
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Find wallets
        const userWallet = await Wallet.findOne({ owner: recieverId }).session(session);
        const agentWallet = await Wallet.findOne({ owner: senderAgentId }).session(session);        
        
        if (!userWallet) {
            throw new AppError(StatusCodes.NOT_FOUND, "User's wallet not found");
        }
        if (!agentWallet) {
            throw new AppError(StatusCodes.NOT_FOUND, "Agent's wallet not found");
        }
        // Check if wallets are blocked
        if (userWallet.status === WalletStatus.BLOCKED) {
            throw new AppError(StatusCodes.BAD_REQUEST, "User's wallet is blocked");
        }
        if (agentWallet.status === WalletStatus.BLOCKED) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Agent's wallet is blocked");
        }
        // Validate amount
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Cash-in amount must be greater than zero");
        }
        if (agentWallet.balance < numericAmount) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient balance in agent's wallet");
        }
        // Perform cash-in
        agentWallet.balance -= numericAmount;
        userWallet.balance += numericAmount;
        // Create a transaction for this cash-in
        await TransactionService.createTransaction({
            type: TransactionType.CASHIN,
            from: agentWallet.owner,
            to: userWallet.owner,
            amount: numericAmount,
            status: TransactionStatus.COMPLETED
        });
        // Save wallets
        await userWallet.save({ session });
        await agentWallet.save({ session });
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        return {
            userWallet,
            agentWallet
        };
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }

 }
 const agentCashOut = async (userSenderId: string, agentRecieverId: string, amount: number) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Find wallets
        const userWallet = await Wallet.findOne({ owner: userSenderId }).session(session);
        const agentWallet = await Wallet.findOne({ owner: agentRecieverId }).session(session);
        if (!userWallet) {
            throw new AppError(StatusCodes.NOT_FOUND, "User's wallet not found");
        }
        if (!agentWallet) {
            throw new AppError(StatusCodes.NOT_FOUND, "Agent's wallet not found");
        }
        // Check if wallets are blocked
        if (userWallet.status === WalletStatus.BLOCKED) {
            throw new AppError(StatusCodes.BAD_REQUEST, "User's wallet is blocked");
        }
        if (agentWallet.status === WalletStatus.BLOCKED) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Agent's wallet is blocked");
        }
        // Validate amount
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Cash-out amount must be greater than zero");
        }
        if (userWallet.balance < numericAmount) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient balance in user's wallet");
        }
        // Perform cash-out
        userWallet.balance -= numericAmount;
        agentWallet.balance += numericAmount;
        // Create a transaction for this cash-out
        await TransactionService.createTransaction({
            type: TransactionType.CASHOUT,
            from: userWallet.owner,
            to: agentWallet.owner,
            amount: numericAmount,
            status: TransactionStatus.COMPLETED
        });
        // Save wallets
        await userWallet.save({ session });
        await agentWallet.save({ session });
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        return {
            userWallet,
            agentWallet
        };
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
 }



export const WalletService = {
    depositMoney,
    withdrawMoney,
    sendMoney,
    blockWallet,
    unblockWallet,
    agentCashIn,
    agentCashOut
}