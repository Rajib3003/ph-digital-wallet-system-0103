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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = require("http-status-codes");
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const user_constant_1 = require("./user.constant");
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_model_1 = require("../wallet/wallet.model");
const transaction_model_1 = require("../transaction/transaction.model");
const transaction_interface_1 = require("../transaction/transaction.interface");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
        // 1️⃣ Check if user exists
        const isUserExist = yield user_model_1.User.findOne({ email }).session(session);
        if (isUserExist) {
            throw new AppError_1.default(409, "User Already Exist!");
        }
        // 2️⃣ Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVar.BCRYPT_SALT_ROUND));
        // 3️⃣ Create user
        const authProvider = { provider: 'credentials', providerId: email };
        const user = yield user_model_1.User.create([Object.assign({ email, password: hashedPassword, auths: [authProvider] }, rest)], { session });
        // 4️⃣ Create wallet for user with 50 balance
        const wallet = yield wallet_model_1.Wallet.create([{
                owner: user[0]._id,
                balance: Number(env_1.envVar.INITIAL_BALANCE) || 0
            }], { session });
        // 5️⃣ Update user with wallet reference
        user[0].wallet = wallet[0]._id;
        yield user[0].save({ session });
        // 6️⃣ Deduct 50 from admin wallet
        const superAdmin = yield user_model_1.User.findOne({ role: user_interface_1.Role.SUPER_ADMIN });
        if (!superAdmin)
            throw new AppError_1.default(500, "Super Admin not found");
        const adminWallet = yield wallet_model_1.Wallet.findOne({ owner: superAdmin._id }).session(session);
        if (!adminWallet)
            throw new AppError_1.default(400, "Admin wallet not found");
        console.log("test", adminWallet);
        if (!adminWallet || adminWallet.balance < (env_1.envVar.INITIAL_BALANCE ? Number(env_1.envVar.INITIAL_BALANCE) : 0)) {
            throw new AppError_1.default(400, "Admin balance insufficient");
        }
        adminWallet.balance -= env_1.envVar.INITIAL_BALANCE ? Number(env_1.envVar.INITIAL_BALANCE) : 0;
        yield adminWallet.save({ session });
        // 7️⃣ Create transaction record
        yield transaction_model_1.Transaction.create([{
                from: adminWallet._id,
                to: wallet[0]._id,
                amount: env_1.envVar.INITIAL_BALANCE ? Number(env_1.envVar.INITIAL_BALANCE) : 0,
                type: transaction_interface_1.TransactionType.TOPUP,
                status: transaction_interface_1.TransactionStatus.COMPLETED
            }], { session });
        yield session.commitTransaction();
        session.endSession();
        return user[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(500, error.message);
    }
});
// const getAllUsers = async (query: Record<string, string>) => {
// const queryBuilder = new QueryBuilder(User.find(), query)
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const users = queryBuilder
        .search(user_constant_1.userSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        users.build(),
        queryBuilder.getMeta()
    ]);
    // const allUser = await User.find({})
    // const total = await User.countDocuments();
    // const totalUser = Number(total)
    return {
        data,
        meta
    };
});
const getSingleUser = (UserId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!UserId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User Id Not Found !*!");
    }
    const singleUser = yield user_model_1.User.findById(UserId);
    return singleUser;
});
const deleteUser = (UserId) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.User.findByIdAndDelete(UserId);
    return null;
});
const updatedUser = (UserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(UserId);
    const userResult = yield user_model_1.User.findByIdAndUpdate(UserId, payload, { new: true, runValidators: true });
    console.log(user);
    console.log(userResult);
    return userResult;
});
exports.UserService = {
    createUser,
    getAllUsers,
    getSingleUser,
    deleteUser,
    updatedUser
};
