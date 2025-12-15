"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const transaction_constant_1 = require("./transaction.constant");
const transaction_model_1 = require("./transaction.model");
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
const getMyTransactions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_model_1.Transaction.find({ $or: [{ from: userId }, { to: userId }] })
        .populate("from", "name email role")
        .populate("to", "name email role")
        .sort({ createdAt: -1 });
    // const [data, meta] = await Promise.all([
    //       result.build(),
    //       queryBuilder.getMeta()
    //   ]);
    const total = result.length;
    return { data: result, total };
});
const getAllTransactions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(transaction_model_1.Transaction.find(), query);
    const transactionsQuery = queryBuilder
        .search(transaction_constant_1.transactionSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        transactionsQuery.build(),
        queryBuilder.getMeta()
    ]);
    return { data, meta };
});
const getTransactionsByWallet = (walletId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transaction.find({
        $or: [{ from: walletId }, { to: walletId }]
    })
        .sort({ createdAt: -1 })
        .populate("from", "name email role")
        .populate("to", "name email role");
    return transactions;
});
const createTransaction = (transactionData) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield transaction_model_1.Transaction.create(transactionData);
    return transaction;
});
exports.TransactionService = {
    getMyTransactions,
    getAllTransactions,
    getTransactionsByWallet,
    createTransaction
};
