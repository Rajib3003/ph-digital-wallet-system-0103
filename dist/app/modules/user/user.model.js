"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authProviderSchema = new mongoose_1.Schema({
    provider: {
        type: String,
        required: true
    },
    providerId: {
        type: String
    }
}, {
    versionKey: false,
    _id: false,
});
const userSchema = new mongoose_1.Schema({
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
        enum: Object.values(user_interface_1.isActived),
        default: user_interface_1.isActived.ACTIVE
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.USER
    },
    auths: [authProviderSchema]
}, {
    timestamps: true,
    versionKey: false,
});
exports.User = (0, mongoose_1.model)("User", userSchema);
