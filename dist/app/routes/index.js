"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_router_1 = require("../modules/user/user.router");
const auth_router_1 = require("../modules/auth/auth.router");
const transaction_router_1 = require("../modules/transaction/transaction.router");
const wallet_router_1 = require("../modules/wallet/wallet.router");
exports.router = (0, express_1.Router)();
const modelRoutes = [
    {
        path: "/user",
        route: user_router_1.UserRoutes
    },
    {
        path: "/auth",
        route: auth_router_1.AuthRoutes
    },
    {
        path: "/wallet",
        route: wallet_router_1.WalletRoutes
    },
    {
        path: "/transaction",
        route: transaction_router_1.TransactionRoutes
    }
];
modelRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
