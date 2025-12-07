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

// export interface ITransaction extends Document {
//   type: TransactionType;
//   from?: mongoose.Types.ObjectId; // sender or agent
//   to?: mongoose.Types.ObjectId;   // receiver
//   amount: number;
//   fee?: number;
//   status: TransactionStatus;
// }

export interface ITransaction extends Document{
  type: TransactionType;
  from?: mongoose.Types.ObjectId; // sender or agent
  to?: mongoose.Types.ObjectId;   // receiver
  amount: number;
  fee?: number;
  status: TransactionStatus;
  receiver?: string;
  sender?: string;  
  createdAt?: Date;
  updatedAt?: Date;
}

