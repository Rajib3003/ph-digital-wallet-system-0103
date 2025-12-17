import { envVar } from "../config/env";
import { User } from "../modules/user/user.model";
import { Wallet } from "../modules/wallet/wallet.model";


export const getSystemWallet = async () => {
  const systemUser = await User.findOne({ role: "SUPER_ADMIN" });
  if (!systemUser) throw new Error("Super Admin not found for system wallet");

  let systemWallet = await Wallet.findOne({ owner: systemUser._id });

  const startingBalance = Number(envVar.SUPER_ADMIN_DEFAULT_BALANCE) || 1000000;

  
  if (!systemWallet) {
    systemWallet = await Wallet.create({
      owner: systemUser._id,
      balance: startingBalance,
    });
  }

  
  if (systemWallet.balance <= 0) {
    systemWallet.balance = startingBalance;
    await systemWallet.save();
  }

  return systemWallet;
};