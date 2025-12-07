
import mongoose, { Schema } from "mongoose";
import { IWallet, WalletStatus } from "./wallet.interface";

const walletSchema = new Schema<IWallet>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, default: 50 },
    status: {
      type: String,
      enum: Object.values(WalletStatus),
      default: WalletStatus.ACTIVE
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Wallet = mongoose.model<IWallet>("Wallet", walletSchema);
