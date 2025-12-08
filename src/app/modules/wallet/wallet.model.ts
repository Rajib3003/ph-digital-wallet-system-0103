import mongoose, { Schema } from "mongoose";
import { IWallet, WalletStatus } from "./wallet.interface";
import { envVar } from "../../config/env";

const walletSchema = new Schema<IWallet>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: {
      type: Number,
      default: function () {
        const val = Number(envVar.INITIAL_BALANCE);
        return isNaN(val) ? 0 : val;
      },
    },
    status: {
      type: String,
      enum: Object.values(WalletStatus),
      default: WalletStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Wallet = mongoose.model<IWallet>("Wallet", walletSchema);
