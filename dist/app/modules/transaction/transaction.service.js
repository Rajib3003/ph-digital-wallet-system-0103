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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
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
const getMyTransactions = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure userId is ObjectId
    const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
    // Base query: find transactions where the user is sender or receiver
    const baseQuery = transaction_model_1.Transaction.find({
        $or: [{ from: userObjectId }, { to: userObjectId }]
    })
        .populate({ path: "from", select: "name email role" }) // populate from
        .populate({ path: "to", select: "name email role" }) // populate to
        .sort({ createdAt: -1 });
    // .populate("from","name email role")
    // .populate("to", "name email role")
    // .sort({ createdAt: -1 }); 
    // Initialize QueryBuilder with base query and request query parameters
    const queryBuilder = new QueryBuilder_1.QueryBuilder(baseQuery, query);
    // Apply search, filter, sort, fields, and pagination
    const transactionsQuery = queryBuilder
        .search(transaction_constant_1.transactionSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    // Execute query and get meta data in parallel
    const [data, meta] = yield Promise.all([
        transactionsQuery.build(), // executes the query
        queryBuilder.getMeta() // get pagination info
    ]);
    console.log("baseQuery", data);
    return { data, meta };
});
const getAllTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transaction.find({})
        .sort({ createdAt: -1 })
        .populate("from", "name email role")
        .populate("to", "name email role");
    return transactions;
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
