import mongoose, { model, Schema } from "mongoose";
import { IAuthProvider, isActived, IUser, Role } from "./user.interface";


const authProviderSchema = new Schema<IAuthProvider>({
    provider: {
        type: String,
        required: true
    },
    providerId: {
        type: String
    }

},{
    versionKey: false,
    _id: false,
})

const userSchema = new Schema<IUser>({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    phone: {
        type: String
    },
    picture: {
        type: String
    },
    address: {
        type: String
    },
    isDeleted: {
        type: Boolean, 
        default: false
    },
    isActived: {
        type: String, 
        enum: Object.values(isActived),
        default: isActived.ACTIVE
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER
    },
    auths: [authProviderSchema],
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" }
},{
    timestamps: true,
    versionKey: false,
})

export const User = model<IUser>("User", userSchema)