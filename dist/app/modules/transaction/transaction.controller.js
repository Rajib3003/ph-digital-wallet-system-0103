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
exports.TransactionController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const transaction_service_1 = require("./transaction.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const getMyTransactions = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeToken = req.user;
    if (!decodeToken) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "DecodeToken not found in request !*!");
    }
    const userId = decodeToken === null || decodeToken === void 0 ? void 0 : decodeToken.userId;
    const query = req.query;
    const result = yield transaction_service_1.TransactionService.getMyTransactions(userId, query);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Your transactions fetched successfully !*!",
        statusCode: http_status_codes_1.StatusCodes.OK,
        meta: result.meta,
        data: result.data,
    });
}));
const getAllTransactions = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_service_1.TransactionService.getAllTransactions();
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "All transactions fetched successfully !*!",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: transactions
    });
}));
const getTransactionsByWallet = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId } = req.params;
    const transactions = yield transaction_service_1.TransactionService.getTransactionsByWallet(walletId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Wallet transactions fetched successfully !*!",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: transactions
    });
}));
const createTransaction = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionData = req.body;
    const transaction = yield transaction_service_1.TransactionService.createTransaction(transactionData);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Transaction created successfully !*!",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: transaction
    });
}));
exports.TransactionController = {
    getMyTransactions,
    getAllTransactions,
    getTransactionsByWallet,
    createTransaction
};
