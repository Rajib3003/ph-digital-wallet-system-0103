import { Router } from "express";

import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { WalletController } from "./wallet.controller";

const router = Router();


router.post("/deposit", checkAuth(Role.USER, Role.AGENT), WalletController.depositMoney);
router.post("/withdraw", checkAuth(Role.USER), WalletController.withdrawMoney);
router.post("/send", checkAuth(Role.USER), WalletController.sendMoney);
router.patch("/block/:walletId", checkAuth(Role.ADMIN), WalletController.blockWallet);
router.patch("/unblock/:walletId", checkAuth(Role.ADMIN), WalletController.unblockWallet);
router.post("/agent/cash-in", checkAuth(Role.AGENT), WalletController.agentCashIn);
router.post("/agent/cash-out", checkAuth(Role.USER), WalletController.agentCashOut);

export const WalletRoutes = router;
