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
exports.WalletService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_model_1 = require("./wallet.model");
const wallet_interface_1 = require("./wallet.interface");
const transaction_interface_1 = require("../transaction/transaction.interface");
const transaction_model_1 = require("../transaction/transaction.model");
const getSystemWallet_1 = require("../../utils/getSystemWallet");
const env_1 = require("../../config/env");
const user_model_1 = require("../user/user.model");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const wallet_constant_1 = require("./wallet.constant");
const createTransactionRecord_1 = require("../../middlewares/createTransactionRecord");
const depositMoney = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Validate amount
        amount = Number(amount);
        if (isNaN(amount) || amount <= 0) {
            amount = Number(env_1.envVar.INITIAL_BALANCE) || 0;
        }
        const userWallet = yield wallet_model_1.Wallet.findOne({ owner: userId }).session(session);
        if (!userWallet)
            throw new AppError_1.default(404, "User wallet not found");
        const fromWallet = yield (0, getSystemWallet_1.getSystemWallet)();
        if (fromWallet.balance < amount)
            throw new AppError_1.default(400, "System wallet insufficient balance");
        // Update balances
        fromWallet.balance -= amount;
        userWallet.balance += amount;
        yield fromWallet.save({ session });
        yield userWallet.save({ session });
        yield (0, createTransactionRecord_1.createTransactionRecord)(fromWallet._id, userWallet._id, amount, transaction_interface_1.TransactionType.TOPUP, transaction_interface_1.TransactionStatus.COMPLETED, session);
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
const withdrawMoney = (userId, recieveId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Find wallet for user
        const userWallet = yield wallet_model_1.Wallet.findOne({ owner: userId }).session(session);
        if (!userWallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Wallet not found");
        }
        const recieverWallet = yield wallet_model_1.Wallet.findOne({ owner: recieveId }).session(session);
        if (!recieverWallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Reciever Wallet not found");
        }
        // Check if wallet is blocked
        if (userWallet.status === wallet_interface_1.WalletStatus.BLOCKED) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Wallet is blocked");
        }
        if (recieverWallet.status === wallet_interface_1.WalletStatus.BLOCKED) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Reciever Wallet is blocked");
        }
        // Validate amount
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Withdrawal amount must be greater than zero");
        }
        if (userWallet.balance < numericAmount) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Insufficient balance");
        }
        // Deduct amount
        userWallet.balance -= numericAmount;
        recieverWallet.balance += numericAmount;
        yield (0, createTransactionRecord_1.createTransactionRecord)(userWallet._id, recieverWallet._id, numericAmount, transaction_interface_1.TransactionType.WITHDRAW, transaction_interface_1.TransactionStatus.COMPLETED, session);
        // Save wallet
        yield userWallet.save({ session });
        // Commit transaction
        yield session.commitTransaction();
        session.endSession();
        return {
            userWallet,
            recieverWallet
        };
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
        const superAdmin = yield user_model_1.User.findOne({ role: "SUPER_ADMIN" }).session(session);
        if (!superAdmin) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "SuperAdmin user not found");
        }
        const superAdminWalletId = superAdmin.wallet;
        if (!superAdminWalletId) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "SuperAdmin wallet ID missing in user");
        }
        const superAdminWallet = yield wallet_model_1.Wallet.findById(superAdminWalletId).session(session);
        if (!superAdminWallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "SuperAdmin wallet not found");
        }
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
        const commissionRate = Number(env_1.envVar.SEND_MONEY_COMMISSION); // 5 taka
        const commissionAmount = commissionRate;
        const totalDeduction = numericAmount + commissionAmount;
        if (senderWallet.balance < totalDeduction) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Insufficient balance. Required: ${totalDeduction}`);
        }
        // Perform transfer
        senderWallet.balance -= totalDeduction;
        receiverWallet.balance += numericAmount;
        superAdminWallet.balance += commissionAmount;
        const commission = yield (0, createTransactionRecord_1.createTransactionRecord)(senderWallet._id, receiverWallet._id, numericAmount, transaction_interface_1.TransactionType.SEND, transaction_interface_1.TransactionStatus.COMPLETED, session, {
            companyCommission: commissionAmount > 0 ? commissionAmount : undefined
        });
        // Save wallets
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        yield superAdminWallet.save({ session });
        // Commit transaction
        yield session.commitTransaction();
        session.endSession();
        return {
            senderWallet,
            receiverWallet,
            superAdminWallet,
            commission
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
        const superAdmin = yield user_model_1.User.findOne({ role: "SUPER_ADMIN" }).session(session);
        if (!superAdmin) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "SuperAdmin user not found");
        }
        const superAdminWalletId = superAdmin.wallet;
        if (!superAdminWalletId) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "SuperAdmin wallet ID missing in user");
        }
        const superAdminWallet = yield wallet_model_1.Wallet.findById(superAdminWalletId).session(session);
        if (!superAdminWallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "SuperAdmin wallet not found");
        }
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
        const commissionRate = Number(env_1.envVar.AGENT_COMMISSION_PERCENT); // 1%
        const commissionAmount = numericAmount * commissionRate;
        agentWallet.balance -= numericAmount;
        userWallet.balance += numericAmount;
        if (commissionAmount > 0) {
            superAdminWallet.balance -= commissionAmount;
            agentWallet.balance += commissionAmount;
        }
        yield (0, createTransactionRecord_1.createTransactionRecord)(agentWallet._id, userWallet._id, numericAmount, transaction_interface_1.TransactionType.CASHIN, transaction_interface_1.TransactionStatus.COMPLETED, session, {
            agentCommission: commissionAmount > 0 ? commissionAmount : undefined,
        });
        // Save wallets
        yield userWallet.save({ session });
        yield agentWallet.save({ session });
        yield superAdminWallet.save({ session });
        // Commit transaction
        yield session.commitTransaction();
        session.endSession();
        return {
            userWallet,
            agentWallet,
            superAdminWallet,
            commissionAmount
        };
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const agentCashOut = (userSenderId, agentReceiverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const userWallet = yield wallet_model_1.Wallet.findOne({ owner: userSenderId }).session(session);
        const agentWallet = yield wallet_model_1.Wallet.findOne({ owner: agentReceiverId }).session(session);
        const superAdmin = yield user_model_1.User.findOne({ role: "SUPER_ADMIN" }).session(session);
        if (!superAdmin) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "SuperAdmin user not found");
        }
        const superAdminWalletId = superAdmin.wallet;
        if (!superAdminWalletId) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "SuperAdmin wallet ID missing in user");
        }
        const superAdminWallet = yield wallet_model_1.Wallet.findById(superAdminWalletId).session(session);
        if (!superAdminWallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "SuperAdmin wallet not found");
        }
        if (!userWallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User wallet not found");
        }
        if (!agentWallet) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Agent wallet not found");
        }
        if (userWallet.status === wallet_interface_1.WalletStatus.BLOCKED) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User wallet is blocked");
        }
        if (agentWallet.status === wallet_interface_1.WalletStatus.BLOCKED) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Agent wallet is blocked");
        }
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Cash-out amount must be greater than zero");
        }
        const agentCommissionRate = Number(env_1.envVar.AGENT_COMMISSION_PERCENT); // 1%
        const companyCommissionRate = Number(env_1.envVar.TRANSACTION_FEE_PERCENT); // 0.085%    
        const agentCommissionAmount = numericAmount * agentCommissionRate;
        const companyCommissionAmount = Number((numericAmount * companyCommissionRate).toFixed(2));
        const totalCommissionAmount = agentCommissionAmount + companyCommissionAmount;
        const totalDeduction = numericAmount + totalCommissionAmount;
        // Check balance including charge
        if (userWallet.balance < totalDeduction) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Insufficient balance. Required: ${totalDeduction}`);
        }
        // Deduct amount + charge from user
        userWallet.balance -= totalDeduction;
        // Add only the amount to agent
        agentWallet.balance += numericAmount;
        // Add the commission to SuperAdmin
        superAdminWallet.balance += companyCommissionAmount;
        // Add only the amount to agent
        agentWallet.balance += agentCommissionAmount;
        const commission = yield (0, createTransactionRecord_1.createTransactionRecord)(userWallet._id, agentWallet._id, numericAmount, transaction_interface_1.TransactionType.CASHOUT, transaction_interface_1.TransactionStatus.COMPLETED, session, {
            agentCommission: agentCommissionAmount > 0 ? agentCommissionAmount : undefined,
            companyCommission: companyCommissionAmount > 0 ? companyCommissionAmount : undefined
        });
        // Save wallets
        yield userWallet.save({ session });
        yield agentWallet.save({ session });
        yield superAdminWallet.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return { userWallet, agentWallet, superAdminWallet, commission };
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const getCommissionHistory = (currentUserId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserWallet = yield wallet_model_1.Wallet.findOne({ owner: currentUserId });
    if (!currentUserWallet)
        throw new AppError_1.default(404, "Agent wallet not found");
    const currentOwnerId = currentUserWallet.owner;
    // const agentObjectId = new mongoose.Types.ObjectId(agentId)  
    console.log("agentObjectId====", currentOwnerId);
    const baseQuery = transaction_model_1.Transaction.find({
        $or: [
            { to: currentOwnerId },
            { from: currentOwnerId }
        ]
    })
        // .populate({ path: "from", select: "name email role" })
        // .populate({ path: "to", select: "name email role" })
        .sort({ createdAt: -1 });
    const queryBuilder = new QueryBuilder_1.QueryBuilder(baseQuery, query);
    const agentQuery = queryBuilder
        .search(wallet_constant_1.walletSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        agentQuery.build(),
        queryBuilder.getMeta()
    ]);
    return { data, meta };
});
exports.WalletService = {
    depositMoney,
    withdrawMoney,
    sendMoney,
    blockWallet,
    unblockWallet,
    agentCashIn,
    agentCashOut,
    getCommissionHistory
};
