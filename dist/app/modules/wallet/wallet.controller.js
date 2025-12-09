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
exports.WalletController = exports.depositMoney = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const wallet_service_1 = require("./wallet.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
exports.depositMoney = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body; // optional
    const decodeToken = req.user;
    const wallet = yield wallet_service_1.WalletService.depositMoney(decodeToken === null || decodeToken === void 0 ? void 0 : decodeToken.userId, amount !== undefined ? Number(amount) : 0);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Money deposited successfully",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: wallet
    });
}));
const withdrawMoney = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    const decodeToken = req.user;
    const wallet = yield wallet_service_1.WalletService.withdrawMoney(decodeToken.userId, Number(amount));
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Money withdrawn successfully !*!",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: wallet
    });
}));
const sendMoney = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverId, amount } = req.body;
    const decodeToken = req.user;
    const result = yield wallet_service_1.WalletService.sendMoney(decodeToken.userId, receiverId, Number(amount));
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Money sent successfully !*!",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result
    });
}));
const blockWallet = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId } = req.params;
    const wallet = yield wallet_service_1.WalletService.blockWallet(walletId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Wallet blocked successfully",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: wallet
    });
}));
const unblockWallet = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId } = req.params;
    const wallet = yield wallet_service_1.WalletService.unblockWallet(walletId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Wallet unblocked successfully",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: wallet
    });
}));
const agentCashIn = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { recieverId, amount } = req.body;
    const decodeToken = req.user;
    const senderId = decodeToken.userId;
    const wallet = yield wallet_service_1.WalletService.agentCashIn(senderId, recieverId, Number(amount));
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Cash-in successful !*!",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: wallet
    });
}));
const agentCashOut = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentRecieverId, amount } = req.body;
    const decodeToken = req.user;
    const userSenderId = decodeToken.userId;
    const wallet = yield wallet_service_1.WalletService.agentCashOut(userSenderId, agentRecieverId, Number(amount));
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Cash-out successful",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: wallet
    });
}));
exports.WalletController = {
    depositMoney: exports.depositMoney,
    withdrawMoney,
    sendMoney,
    blockWallet,
    unblockWallet,
    agentCashIn,
    agentCashOut
};
