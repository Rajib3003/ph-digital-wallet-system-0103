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
exports.createTransactionRecord = void 0;
const transaction_model_1 = require("../modules/transaction/transaction.model");
const wallet_model_1 = require("../modules/wallet/wallet.model");
const createTransactionRecord = (fromWalletId, toWalletId, amount, type, status, session, options) => __awaiter(void 0, void 0, void 0, function* () {
    const fromWallet = yield wallet_model_1.Wallet.findById(fromWalletId).session(session);
    const toWallet = yield wallet_model_1.Wallet.findById(toWalletId).session(session);
    if (!fromWallet || !toWallet) {
        throw new Error("Wallet not found");
    }
    const agentCommission = (options === null || options === void 0 ? void 0 : options.agentCommission) || 0;
    const companyCommission = (options === null || options === void 0 ? void 0 : options.companyCommission) || 0;
    const totalTransactionAmount = amount + agentCommission + companyCommission;
    yield transaction_model_1.Transaction.create([
        {
            from: fromWallet.owner,
            to: toWallet.owner,
            amount,
            agentCommission,
            companyCommission,
            totalTransactionAmount,
            type,
            status,
        },
    ], { session });
    return { agentCommission, companyCommission };
});
exports.createTransactionRecord = createTransactionRecord;
