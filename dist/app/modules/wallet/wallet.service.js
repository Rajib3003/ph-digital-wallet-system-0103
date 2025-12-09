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
exports.WalletService = exports.depositMoney = exports.getSystemWallet = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_model_1 = require("./wallet.model");
const wallet_interface_1 = require("./wallet.interface");
const transaction_service_1 = require("../transaction/transaction.service");
const transaction_interface_1 = require("../transaction/transaction.interface");
const transaction_model_1 = require("../transaction/transaction.model");
const user_model_1 = require("../user/user.model");
const env_1 = require("../../config/env");
const getSystemWallet = () => __awaiter(void 0, void 0, void 0, function* () {
    const systemUser = yield user_model_1.User.findOne({ role: "SUPER_ADMIN" });
    if (!systemUser)
        throw new Error("Super Admin not found for system wallet");
    let systemWallet = yield wallet_model_1.Wallet.findOne({ owner: systemUser._id });
    const startingBalance = Number(env_1.envVar.SUPER_ADMIN_DEFAULT_BALANCE) || 1000000;
    // Create system wallet if not exists
    if (!systemWallet) {
        systemWallet = yield wallet_model_1.Wallet.create({
            owner: systemUser._id,
            balance: startingBalance,
        });
    }
    // Update balance if 0 (for dev)
    if (systemWallet.balance <= 0) {
        systemWallet.balance = startingBalance;
        yield systemWallet.save();
    }
    return systemWallet;
});
exports.getSystemWallet = getSystemWallet;
const depositMoney = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Validate amount
        amount = Number(amount);
        if (isNaN(amount) || amount <= 0) {
            amount = Number(process.env.INITIAL_BALANCE) || 50; // default 50
        }
        const userWallet = yield wallet_model_1.Wallet.findOne({ owner: userId }).session(session);
        if (!userWallet)
            throw new AppError_1.default(404, "User wallet not found");
        const fromWallet = yield (0, exports.getSystemWallet)();
        if (fromWallet.balance < amount)
            throw new AppError_1.default(400, "System wallet insufficient balance");
        // Update balances
        fromWallet.balance -= amount;
        userWallet.balance += amount;
        yield fromWallet.save({ session });
        yield userWallet.save({ session });
        // Create transaction record
        yield transaction_model_1.Transaction.create([
            {
                from: fromWallet._id,
                to: userWallet._id,
                amount,
                type: transaction_interface_1.TransactionType.TOPUP,
                status: transaction_interface_1.TransactionStatus.COMPLETED,
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return userWallet;
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
exports.depositMoney = depositMoney;
const withdrawMoney = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Find wallet for user
        const wallet = yield wallet_model_1.Wallet.findOne({ owner: userId }).session(session);
        if (!wallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Wallet not found");
        }
        // Check if wallet is blocked
        if (wallet.status === wallet_interface_1.WalletStatus.BLOCKED) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Wallet is blocked");
        }
        // Validate amount
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Withdrawal amount must be greater than zero");
        }
        if (wallet.balance < numericAmount) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Insufficient balance");
        }
        // Deduct amount
        wallet.balance -= numericAmount;
        // Create a transaction for this withdrawal
        yield transaction_service_1.TransactionService.createTransaction({
            type: transaction_interface_1.TransactionType.WITHDRAW,
            from: wallet.owner,
            amount: numericAmount,
            status: transaction_interface_1.TransactionStatus.COMPLETED
        });
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
const sendMoney = (senderId, receiverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Find wallets
        const senderWallet = yield wallet_model_1.Wallet.findOne({ owner: senderId }).session(session);
        const receiverWallet = yield wallet_model_1.Wallet.findOne({ owner: receiverId }).session(session);
        if (!senderWallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Sender's wallet not found");
        }
        if (!receiverWallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Receiver's wallet not found");
        }
        // Check if wallets are blocked
        if (senderWallet.status === wallet_interface_1.WalletStatus.BLOCKED) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Sender's wallet is blocked");
        }
        if (receiverWallet.status === wallet_interface_1.WalletStatus.BLOCKED) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Receiver's wallet is blocked");
        }
        // Validate amount
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Transfer amount must be greater than zero");
        }
        if (senderWallet.balance < numericAmount) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Insufficient balance in sender's wallet");
        }
        // Perform transfer
        senderWallet.balance -= numericAmount;
        receiverWallet.balance += numericAmount;
        // Create a transaction for this transfer
        yield transaction_service_1.TransactionService.createTransaction({
            type: transaction_interface_1.TransactionType.SEND,
            from: senderWallet.owner,
            to: receiverWallet.owner,
            amount: numericAmount,
            status: transaction_interface_1.TransactionStatus.COMPLETED
        });
        // Save wallets
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        // Commit transaction
        yield session.commitTransaction();
        session.endSession();
        return {
            senderWallet,
            receiverWallet
        };
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const blockWallet = (walletId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findById(walletId);
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Wallet not found !*!");
    }
    wallet.status = wallet_interface_1.WalletStatus.BLOCKED;
    yield wallet.save();
    return wallet;
});
const unblockWallet = (walletId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findById(walletId);
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Wallet not found !*!");
    }
    wallet.status = wallet_interface_1.WalletStatus.ACTIVE;
    yield wallet.save();
    return wallet;
});
const agentCashIn = (senderAgentId, recieverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Find wallets
        const userWallet = yield wallet_model_1.Wallet.findOne({ owner: recieverId }).session(session);
        const agentWallet = yield wallet_model_1.Wallet.findOne({ owner: senderAgentId }).session(session);
        if (!userWallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User's wallet not found");
        }
        if (!agentWallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Agent's wallet not found");
        }
        // Check if wallets are blocked
        if (userWallet.status === wallet_interface_1.WalletStatus.BLOCKED) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User's wallet is blocked");
        }
        if (agentWallet.status === wallet_interface_1.WalletStatus.BLOCKED) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Agent's wallet is blocked");
        }
        // Validate amount
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Cash-in amount must be greater than zero");
        }
        if (agentWallet.balance < numericAmount) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Insufficient balance in agent's wallet");
        }
        // Perform cash-in
        agentWallet.balance -= numericAmount;
        userWallet.balance += numericAmount;
        // Create a transaction for this cash-in
        yield transaction_service_1.TransactionService.createTransaction({
            type: transaction_interface_1.TransactionType.CASHIN,
            from: agentWallet.owner,
            to: userWallet.owner,
            amount: numericAmount,
            status: transaction_interface_1.TransactionStatus.COMPLETED
        });
        // Save wallets
        yield userWallet.save({ session });
        yield agentWallet.save({ session });
        // Commit transaction
        yield session.commitTransaction();
        session.endSession();
        return {
            userWallet,
            agentWallet
        };
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const agentCashOut = (userSenderId, agentRecieverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Find wallets
        const userWallet = yield wallet_model_1.Wallet.findOne({ owner: userSenderId }).session(session);
        const agentWallet = yield wallet_model_1.Wallet.findOne({ owner: agentRecieverId }).session(session);
        if (!userWallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User's wallet not found");
        }
        if (!agentWallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Agent's wallet not found");
        }
        // Check if wallets are blocked
        if (userWallet.status === wallet_interface_1.WalletStatus.BLOCKED) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User's wallet is blocked");
        }
        if (agentWallet.status === wallet_interface_1.WalletStatus.BLOCKED) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Agent's wallet is blocked");
        }
        // Validate amount
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Cash-out amount must be greater than zero");
        }
        if (userWallet.balance < numericAmount) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Insufficient balance in user's wallet");
        }
        // Perform cash-out
        userWallet.balance -= numericAmount;
        agentWallet.balance += numericAmount;
        // Create a transaction for this cash-out
        yield transaction_service_1.TransactionService.createTransaction({
            type: transaction_interface_1.TransactionType.CASHOUT,
            from: userWallet.owner,
            to: agentWallet.owner,
            amount: numericAmount,
            status: transaction_interface_1.TransactionStatus.COMPLETED
        });
        // Save wallets
        yield userWallet.save({ session });
        yield agentWallet.save({ session });
        // Commit transaction
        yield session.commitTransaction();
        session.endSession();
        return {
            userWallet,
            agentWallet
        };
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
exports.WalletService = {
    depositMoney: exports.depositMoney,
    withdrawMoney,
    sendMoney,
    blockWallet,
    unblockWallet,
    agentCashIn,
    agentCashOut
};
