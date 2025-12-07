import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";

const getMyTransactions = async (userId: string) => {


  const transactions = await Transaction.find({
  $or: [{ to: userId }, { from: userId }]
})
.sort({ createdAt: -1 })
.populate("from", "name email role")
.populate("to", "name email role");



   
  return transactions;
};

const getAllTransactions = async () => {
    const transactions = await Transaction.find({})
      .sort({ createdAt: -1 })
      .populate("from", "name email role")
      .populate("to", "name email role");
    return transactions;
}
const getTransactionsByWallet = async (walletId: string) => {
    const transactions = await Transaction.find({
      $or: [{ from: walletId }, { to: walletId }]
    })
      .sort({ createdAt: -1 })
      .populate("from", "name email role")
      .populate("to", "name email role");
    return transactions;
}
const createTransaction = async (transactionData: Partial<ITransaction>) => {
    const transaction = await Transaction.create(transactionData);
    
    return transaction;
}



export const TransactionService = {
    getMyTransactions,
    getAllTransactions,
    getTransactionsByWallet,
    createTransaction
}