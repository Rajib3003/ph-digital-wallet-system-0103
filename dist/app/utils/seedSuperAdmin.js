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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSuperAdmin = void 0;
const env_1 = require("../config/env");
const user_interface_1 = require("../modules/user/user.interface");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../modules/user/user.model");
const wallet_model_1 = require("../modules/wallet/wallet.model");
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuperAdminExist = yield user_model_1.User.findOne({ email: env_1.envVar.SUPER_ADMIN_EMAIL });
        if (isSuperAdminExist) {
            console.log("Super Admin Allready Exist!!");
            return;
        }
        console.log("Trying to create super admin... ");
        const provider = {
            provider: "credentials",
            providerId: env_1.envVar.SUPER_ADMIN_EMAIL,
        };
        const hashedPassword = yield bcryptjs_1.default.hash(env_1.envVar.SUPER_ADMIN_PASSWORD, Number(env_1.envVar.BCRYPT_SALT_ROUND));
        const payload = {
            name: "Super Admin",
            email: env_1.envVar.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: user_interface_1.Role.SUPER_ADMIN,
            isVerified: true,
            auths: [provider],
        };
        const superAdmin = yield user_model_1.User.create(payload);
        const wallet = yield wallet_model_1.Wallet.create({
            owner: superAdmin._id,
            balance: 0
        });
        superAdmin.wallet = wallet._id;
        yield superAdmin.save();
        console.log("super admin created successfully \n");
        console.log(superAdmin);
    }
    catch (error) {
        console.log("Error while seeding Super Admin !*!", error);
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
