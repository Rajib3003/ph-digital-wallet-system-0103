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
exports.getSystemWallet = void 0;
const env_1 = require("../config/env");
const user_model_1 = require("../modules/user/user.model");
const wallet_model_1 = require("../modules/wallet/wallet.model");
const getSystemWallet = () => __awaiter(void 0, void 0, void 0, function* () {
    const systemUser = yield user_model_1.User.findOne({ role: "SUPER_ADMIN" });
    if (!systemUser)
        throw new Error("Super Admin not found for system wallet");
    let systemWallet = yield wallet_model_1.Wallet.findOne({ owner: systemUser._id });
    const startingBalance = Number(env_1.envVar.SUPER_ADMIN_DEFAULT_BALANCE) || 1000000;
    if (!systemWallet) {
        systemWallet = yield wallet_model_1.Wallet.create({
            owner: systemUser._id,
            balance: startingBalance,
        });
    }
    if (systemWallet.balance <= 0) {
        systemWallet.balance = startingBalance;
        yield systemWallet.save();
    }
    return systemWallet;
});
exports.getSystemWallet = getSystemWallet;
