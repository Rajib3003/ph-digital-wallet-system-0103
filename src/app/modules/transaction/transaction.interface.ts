import mongoose from "mongoose";

export enum TransactionType {
  TOPUP = "TOPUP",
  WITHDRAW = "WITHDRAW",
  SEND = "SEND",
  CASHIN = "CASHIN",
  CASHOUT = "CASHOUT"
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}


export interface ITransaction extends Document{
  type: TransactionType;
  from?: mongoose.Types.ObjectId; 
  to?: mongoose.Types.ObjectId;   
  amount: number;
  fee?: number;
  totalTransactionAmount?: number;
  status: TransactionStatus;  
  createdAt?: Date;
  updatedAt?: Date;
}

