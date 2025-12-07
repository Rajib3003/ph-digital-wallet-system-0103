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
    const wallet = yield wallet_service_1.WalletService.depositMoney(decodeToken === null || decodeToken === void 0 ? void 0 : decodeToken.userId, amount !== undefined ? Number(amount) : undefined);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: amount ? "Money deposited successfully" : "Wallet opened successfully",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: wallet
    });
}));
// const withdrawMoney = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
// const { amount } = req.body;
//       const userId = req.user?.id as string;
//       const wallet = await WalletService.withdrawMoney(userId, Number(amount));
//       sendResponse(res,{
//         success: true,
//         message: "Money withdrawn successfully",
//         statusCode: StatusCodes.OK,
//         data: wallet
//       });
// }); 
// const sendMoney = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
// const { receiverId, amount } = req.body;
//       const senderId = req.user?.id as string;
//       const result = await WalletService.sendMoney(senderId, receiverId, Number(amount));
//       sendResponse(res,{
//         success: true,
//         message: "Money sent successfully",
//         statusCode: StatusCodes.OK,
//         data: result
//       });
// }); 
// const blockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
// const { walletId } = req.params;
//       const wallet = await WalletService.blockWallet(walletId);
//       sendResponse(res,{
//         success: true,
//         message: "Wallet blocked successfully",
//         statusCode: StatusCodes.OK,
//         data: wallet
//       });
// }); 
// const unblockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
// const { walletId } = req.params;
//       const wallet = await WalletService.unblockWallet(walletId);
//       sendResponse(res,{
//         success: true,
//         message: "Wallet unblocked successfully",
//         statusCode: StatusCodes.OK,
//         data: wallet
//       });
// }); 
// const agentCashIn = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
// const { userId, amount } = req.body;
//       const agentId = req.user?.id as string;
//       const wallet = await WalletService.agentCashIn(agentId, userId, Number(amount));
//       sendResponse(res,{
//         success: true,
//         message: "Cash-in successful",
//         statusCode: StatusCodes.OK,
//         data: wallet
//       });
// }); 
// const agentCashOut = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
// const { userId, amount } = req.body;
//       const agentId = req.user?.id as string;
//       const wallet = await WalletService.agentCashOut(agentId, userId, Number(amount));
//       sendResponse(res,{
//         success: true,
//         message: "Cash-out successful",
//         statusCode: StatusCodes.OK,
//         data: wallet
//       });
// }); 
exports.WalletController = {
    depositMoney: exports.depositMoney,
    // withdrawMoney,
    // sendMoney,
    // blockWallet,
    // unblockWallet,
    // agentCashIn,
    // agentCashOut
};
