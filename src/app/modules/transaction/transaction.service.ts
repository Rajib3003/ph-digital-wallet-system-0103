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
 const getMyTransactions = async (userId: string ) => {  
  const result = await Transaction.find({$or: [{ from: userId }, { to: userId }] })
  .populate("from", "name email role")  
  .populate("to", "name email role")
  .sort({ createdAt: -1 }); 
 

  // const [data, meta] = await Promise.all([
  //       result.build(),
  //       queryBuilder.getMeta()
  //   ]);
  const total = result.length

  return { data : result , total};
  
};


const getAllTransactions = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Transaction.find(), query); 
const transactionsQuery = queryBuilder
      .search(transactionSearchableFields)
      .filter()
      .sort()
      .fields()
      .paginate();

const [data, meta] = await Promise.all([
      transactionsQuery.build(), 
      queryBuilder.getMeta()
]); 

  return { data, meta };
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