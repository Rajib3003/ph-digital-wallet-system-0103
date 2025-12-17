import mongoose from "mongoose";
import { Transaction } from "../modules/transaction/transaction.model";
import { ITransactionOptions, TransactionStatus, TransactionType } from "../modules/transaction/transaction.interface";
import { Wallet } from "../modules/wallet/wallet.model";

export const createTransactionRecord = async (
  fromWalletId: mongoose.Types.ObjectId,
  toWalletId: mongoose.Types.ObjectId,
  amount: number,  
  type: TransactionType,
  status: TransactionStatus,
  session: mongoose.ClientSession,
  options?: ITransactionOptions,
) => {
    const fromWallet = await Wallet.findById(fromWalletId).session(session);
  const toWallet = await Wallet.findById(toWalletId).session(session);
    if (!fromWallet || !toWallet) {
    throw new Error("Wallet not found");
  }

  const agentCommission = options?.agentCommission || 0;
  const companyCommission = options?.companyCommission || 0;
  const totalTransactionAmount = amount + agentCommission + companyCommission;
    
    

  await Transaction.create(
    [
      {
        from: fromWallet.owner, 
        to: toWallet.owner,
        amount,
        agentCommission,
        companyCommission,
        totalTransactionAmount,        
        type,
        status,
      },
    ],
    { session }
  );
  return { agentCommission, companyCommission };
};