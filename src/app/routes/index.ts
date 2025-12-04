import { Router } from "express";
import { UserRoutes } from "../modules/user/user.router";
import { AuthRoutes } from "../modules/auth/auth.router";
import { TransactionRoutes } from "../modules/transaction/transaction.router";
import { WalletRoutes } from "../modules/wallet/wallet.router";

export const router = Router();

const modelRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },    
    {
        path: "/wallet",
        route: WalletRoutes
    },
    {
        path: "/transaction",
        route: TransactionRoutes
    }
]

modelRoutes.forEach((route)=>{
    router.use(route.path, route.route)
})