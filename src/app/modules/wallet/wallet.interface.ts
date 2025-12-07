
import mongoose from "mongoose";

export enum WalletStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED"
}

export interface IWallet extends Document {
  owner: mongoose.Types.ObjectId;
  balance: number;
  status: WalletStatus;
}
export interface IWalletCreation {
  owner: mongoose.Types.ObjectId;
  initialDeposit?: number;
}