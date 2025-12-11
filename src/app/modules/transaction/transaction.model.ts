import mongoose, { Schema } from "mongoose";
import { ITransaction, TransactionStatus, TransactionType } from "./transaction.interface";


// const transactionSchema = new Schema<ITransaction>({
//   type: { type: String, enum: Object.values(TransactionType), required: true },
//   from: { type: Schema.Types.ObjectId, ref: 'User' },
//   to: { type: Schema.Types.ObjectId, ref: 'User' },
//   amount: { type: Number, required: true },
//   fee: { type: Number, default: 0 },
//   status: { type: String, enum: Object.values(TransactionStatus), default: TransactionStatus.PENDING }
// }, { 
//     timestamps: true ,
//     versionKey: false
// });

const transactionSchema = new Schema<ITransaction>({
  type: { type: String, enum: Object.values(TransactionType), required: true },
  from: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
  to: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
  amount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  totalTransactionAmount: { type: Number, required: true },
  status: { type: String, enum: Object.values(TransactionStatus), default: TransactionStatus.COMPLETED }
}, { 
    timestamps: true ,
    versionKey: false
});


export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);