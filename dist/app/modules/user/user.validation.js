"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(2, "Name 2 leter kom deoya jabe na")
        .max(100, "Name 100 letter beshi deoya jabe na"),
    email: zod_1.default
        .string()
        .email("Please provide the valied Email"),
    password: zod_1.default
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[\W_]/, { message: "Password must contain at least one special character" })
        .optional(),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    address: zod_1.default
        .string()
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    role: zod_1.default
        .enum(Object.values(user_interface_1.Role))
        .optional()
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(2, "Name 2 leter kom deoya jabe na")
        .max(100, "Name 100 letter beshi deoya jabe na")
        .optional(),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    address: zod_1.default
        .string()
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    role: zod_1.default
        .enum(Object.values(user_interface_1.Role))
        .optional()
});
