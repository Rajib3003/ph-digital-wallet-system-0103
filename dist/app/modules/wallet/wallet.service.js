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
exports.WalletService = exports.depositMoney = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_model_1 = require("./wallet.model");
const wallet_interface_1 = require("./wallet.interface");
const transaction_service_1 = require("../transaction/transaction.service");
const transaction_interface_1 = require("../transaction/transaction.interface");
const depositMoney = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Find wallet for user
        let wallet = yield wallet_model_1.Wallet.findOne({ owner: userId }).session(session);
        // If wallet doesn't exist, create it (Mongoose default balance = 50)
        if (!wallet) {
            const createdWallets = yield wallet_model_1.Wallet.create([{
                    owner: userId,
                    status: wallet_interface_1.WalletStatus.ACTIVE
                }], { session });
            wallet = createdWallets[0];
        }
        // Ensure balance is a number (default safety)
        wallet.balance = (_a = wallet.balance) !== null && _a !== void 0 ? _a : 50;
        // Check if wallet is blocked
        if (wallet.status === wallet_interface_1.WalletStatus.BLOCKED) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Wallet is blocked");
        }
        // Add deposit if amount is provided
        if (amount !== undefined) {
            const numericAmount = Number(amount);
            if (isNaN(numericAmount) || numericAmount <= 0) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Deposit amount must be greater than zero");
            }
            wallet.balance += numericAmount;
            // Create a transaction for this deposit
            yield transaction_service_1.TransactionService.createTransaction({
                type: transaction_interface_1.TransactionType.TOPUP,
                to: wallet.owner,
                amount: numericAmount,
                status: transaction_interface_1.TransactionStatus.COMPLETED
            });
        }
        // Save wallet
        yield wallet.save({ session });
        // Commit transaction
        yield session.commitTransaction();
        session.endSession();
        return wallet;
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
exports.depositMoney = depositMoney;
//  const withdrawMoney = () => {
//  }
//  const sendMoney = () => {
//  }
//  const blockWallet = () => {
//  }
//  const unblockWallet = () => {
//  }
//  const agentCashIn = () => {
//  }
//  const agentCashOut = () => {
//  }
exports.WalletService = {
    depositMoney: exports.depositMoney,
    // withdrawMoney,
    // sendMoney,
    // blockWallet,
    // unblockWallet,
    // agentCashIn,
    // agentCashOut
};
