import mongoose from "mongoose";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { transactionSearchableFields } from "./transaction.constant";
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";

// const getMyTransactions = async (userId: string,query: Record<string, string>) => {

//   // const transactions = await Transaction.find({
//   //   $or: [{ to: userId }, { from: userId }]
//   // })
//   // .sort({ createdAt: -1 })
//   // .populate("from", "name email role")
//   // .populate("to", "name email role");


//   // return transactions;
//   const baseQuery = Transaction.find({
//         $or: [{ from: userId }, { to: userId }]
//     })
//     .populate("from", "name email role")  // direct User populate
// .populate("to", "name email role");
//     // Initialize QueryBuilder
//     const queryBuilder = new QueryBuilder(baseQuery, query);

//     // Apply search, filter, sort, fields, pagination
//     const transactionsQuery = queryBuilder
//         .search(transactionSearchableFields)
//         .filter()
//         .sort()
//         .fields()
//         .paginate();

//     // Execute query and meta in parallel
//     const [data, meta] = await Promise.all([
//         transactionsQuery.build(),
//         queryBuilder.getMeta()
//     ]);

//     return {
//       meta,
//       data
        
//     };
// };
 const getMyTransactions = async (userId: string, query: Record<string, string>) => {
  // Ensure userId is ObjectId
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Base query: find transactions where the user is sender or receiver
   const baseQuery = Transaction.find({
    $or: [{ from: userObjectId }, { to: userObjectId }]
  })
  .populate({ path: "from", select: "name email role" })  // populate from
  .populate({ path: "to", select: "name email role" })    // populate to
  .sort({ createdAt: -1 });
  // .populate("from","name email role")
  // .populate("to", "name email role")
  // .sort({ createdAt: -1 }); 
 

  // Initialize QueryBuilder with base query and request query parameters
  const queryBuilder = new QueryBuilder(baseQuery, query);

  // Apply search, filter, sort, fields, and pagination
  const transactionsQuery = queryBuilder
      .search(transactionSearchableFields)
      .filter()
      .sort()
      .fields()
      .paginate();

  // Execute query and get meta data in parallel
  const [data, meta] = await Promise.all([
      transactionsQuery.build(),   // executes the query
      queryBuilder.getMeta()       // get pagination info
  ]);
 console.log("baseQuery",data)
  return { data, meta };
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