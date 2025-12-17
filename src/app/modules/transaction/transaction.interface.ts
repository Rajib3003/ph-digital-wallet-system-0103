import mongoose from "mongoose";

export enum TransactionType {
  TOPUP = "TOPUP",
  WITHDRAW = "WITHDRAW",
  SEND = "SEND",
  CASHIN = "CASHIN",
  CASHOUT = "CASHOUT",
  COMMISSION = "COMMISSION"
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

export interface ITransactionOptions {
  agentCommission?: number;   // optional
  companyCommission?: number; // optional
}


export interface ITransaction extends Document{
  type: TransactionType;
  from?: mongoose.Types.ObjectId; 
  to?: mongoose.Types.ObjectId;   
  amount: number;
  agentCommission?: number;    
  companyCommission?: number;  
  totalTransactionAmount?: number;
  status: TransactionStatus;  
  createdAt?: Date;
  updatedAt?: Date;
}

