/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import mongoose from "mongoose";
import { Wallet } from "./wallet.model";
import { WalletStatus } from "./wallet.interface";
import { TransactionStatus, TransactionType } from "../transaction/transaction.interface";
import { Transaction } from "../transaction/transaction.model";
import { getSystemWallet } from "../../utils/getSystemWallet";
import { envVar } from "../../config/env";
import { User } from "../user/user.model";




const createTransactionRecord = async (
  fromWalletId: mongoose.Types.ObjectId,
  toWalletId: mongoose.Types.ObjectId,
  amount: number,
  type: TransactionType,
  status: TransactionStatus,
  session: mongoose.ClientSession
) => {
    const fromWallet = await Wallet.findById(fromWalletId).session(session);
  const toWallet = await Wallet.findById(toWalletId).session(session);
    if (!fromWallet || !toWallet) {
    throw new Error("Wallet not found");
  }
    let fee = 0;
    if (type === TransactionType.CASHOUT) {
        fee = Number((amount * Number(envVar.TRANSACTION_FEE_PERCENT)).toFixed(2));
    }
    if (type === TransactionType.SEND) {
        fee = Number(5);
    }
    const totalTransactionAmount = amount + fee

  await Transaction.create(
    [
      {
        from: fromWallet.owner, // <-- User ID
        to: toWallet.owner,
        amount,
        fee,
        totalTransactionAmount,
        type,
        status,
      },
    ],
    { session }
  );
  return fee;
};


const depositMoney = async (userId: string, amount?: number) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate amount
    amount = Number(amount);
    if (isNaN(amount) || amount <= 0) {
      amount = Number(envVar.INITIAL_BALANCE) || 0; 
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

    await createTransactionRecord(
      fromWallet._id,
      userWallet._id,
      amount,
      TransactionType.TOPUP,
      TransactionStatus.COMPLETED,
      session
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



 const withdrawMoney = async (userId: string, recieveId: string, amount: number ) => {
    const session = await mongoose.startSession();
    session.startTransaction();


    try {
        
        // Find wallet for user
        const userWallet = await Wallet.findOne({ owner: userId }).session(session);
        
        if (!userWallet) {
            throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
        }
        const recieverWallet = await Wallet.findOne({owner: recieveId}).session(session)
        
        if(!recieverWallet){
            throw new AppError(StatusCodes.NOT_FOUND,"Reciever Wallet not found")
        }
        // Check if wallet is blocked
        if (userWallet.status === WalletStatus.BLOCKED) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Wallet is blocked");
        }
        if (recieverWallet.status === WalletStatus.BLOCKED) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Reciever Wallet is blocked");
        }
        // Validate amount
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Withdrawal amount must be greater than zero");
        }
        if (userWallet.balance < numericAmount) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient balance");
        }
        
        // Deduct amount
        userWallet.balance -= numericAmount;
        recieverWallet.balance +=numericAmount;
      
        await createTransactionRecord(
            userWallet._id,
            recieverWallet._id,            
            numericAmount,
            TransactionType.WITHDRAW,
            TransactionStatus.COMPLETED,
            session
          );
        // Save wallet
        await userWallet.save({ session });
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        return {
            userWallet,
            recieverWallet
        };
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
        const superAdmin = await User.findOne({ role: "SUPER_ADMIN" }).session(session);

    if (!superAdmin) {
        throw new AppError(StatusCodes.NOT_FOUND, "SuperAdmin user not found");
    }
    
    const superAdminWalletId = superAdmin.wallet;

    if (!superAdminWalletId) {
        throw new AppError(StatusCodes.NOT_FOUND, "SuperAdmin wallet ID missing in user");
    }
    
    const superAdminWallet = await Wallet.findById(superAdminWalletId).session(session);

    if (!superAdminWallet) {
        throw new AppError(StatusCodes.NOT_FOUND, "SuperAdmin wallet not found");
    }

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
          const fee = await createTransactionRecord(
            senderWallet._id,
            receiverWallet._id,
            numericAmount,
            TransactionType.SEND,
            TransactionStatus.COMPLETED,
            session
          );
          const totalDeduction = numericAmount + fee;
            if (senderWallet.balance < totalDeduction) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `Insufficient balance. Required: ${totalDeduction}`
      );
    }
        // Perform transfer
        senderWallet.balance -= totalDeduction;
        receiverWallet.balance += numericAmount;
        superAdminWallet.balance += fee;
      
      
        // Save wallets
        await senderWallet.save({ session });
        await receiverWallet.save({ session });
        await superAdminWallet.save({session});
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        return {
            senderWallet,
            receiverWallet,
            superAdminWallet,
            fee
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
        // await TransactionService.createTransaction({
        //     type: TransactionType.CASHIN,
        //     from: agentWallet.owner,
        //     to: userWallet.owner,
        //     amount: numericAmount,
        //     status: TransactionStatus.COMPLETED
        // });
        await createTransactionRecord(
            agentWallet._id,
            userWallet._id,
            numericAmount,
            TransactionType.CASHIN,
            TransactionStatus.COMPLETED,
            session
          );
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

const agentCashOut = async (
  userSenderId: string,
  agentReceiverId: string,
  amount: number
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {    
    const userWallet = await Wallet.findOne({ owner: userSenderId }).session(session);
    const agentWallet = await Wallet.findOne({ owner: agentReceiverId }).session(session);
    const superAdmin = await User.findOne({ role: "SUPER_ADMIN" }).session(session);

    if (!superAdmin) {
        throw new AppError(StatusCodes.NOT_FOUND, "SuperAdmin user not found");
    }
    
    const superAdminWalletId = superAdmin.wallet;

    if (!superAdminWalletId) {
        throw new AppError(StatusCodes.NOT_FOUND, "SuperAdmin wallet ID missing in user");
    }
    
    const superAdminWallet = await Wallet.findById(superAdminWalletId).session(session);

    if (!superAdminWallet) {
        throw new AppError(StatusCodes.NOT_FOUND, "SuperAdmin wallet not found");
    }

    if (!userWallet) {
        throw new AppError(StatusCodes.NOT_FOUND, "User wallet not found");
    }

    if (!agentWallet){ 
        throw new AppError(StatusCodes.NOT_FOUND, "Agent wallet not found");
    }   

    if (userWallet.status === WalletStatus.BLOCKED){
        throw new AppError(StatusCodes.BAD_REQUEST, "User wallet is blocked");
    }

    if (agentWallet.status === WalletStatus.BLOCKED){
        throw new AppError(StatusCodes.BAD_REQUEST, "Agent wallet is blocked");
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0){
        throw new AppError(StatusCodes.BAD_REQUEST, "Cash-out amount must be greater than zero");
    }

    const fee = await createTransactionRecord(
        userWallet._id,
        agentWallet._id,
        numericAmount,
        TransactionType.CASHOUT,
        TransactionStatus.COMPLETED,
        session
    );

    const totalDeduction = numericAmount + fee;

    // Check balance including charge
    if (userWallet.balance < totalDeduction) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `Insufficient balance. Required: ${totalDeduction}`
      );
    }

    // Deduct amount + charge from user
    userWallet.balance -= totalDeduction;

    // Add only the amount to agent
    agentWallet.balance += numericAmount;

    // Add the fee to SuperAdmin
    superAdminWallet.balance += fee;

    // Save wallets
    await userWallet.save({ session });
    await agentWallet.save({ session });
    await superAdminWallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { userWallet, agentWallet, superAdminWallet, fee };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};



export const WalletService = {
    depositMoney,
    withdrawMoney,
    sendMoney,
    blockWallet,
    unblockWallet,
    agentCashIn,
    agentCashOut
}