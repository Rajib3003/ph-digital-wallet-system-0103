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
const transaction_model_1 = require("./transaction.model");
const getMyTransactions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transaction.find({
        $or: [{ to: userId }, { from: userId }]
    })
        .sort({ createdAt: -1 })
        .populate("from", "name email role")
        .populate("to", "name email role");
    return transactions;
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
