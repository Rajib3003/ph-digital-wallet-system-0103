"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionZodSchema = void 0;
const zod_1 = require("zod");
const transaction_interface_1 = require("./transaction.interface");
exports.createTransactionZodSchema = zod_1.z.object({
    type: zod_1.z.enum(Object.values(transaction_interface_1.TransactionType)),
    from: zod_1.z.string().nonempty("From wallet user ID is required"),
    to: zod_1.z.string().nonempty("To wallet user ID is required"),
    amount: zod_1.z.number().positive("Amount must be greater than 0"),
    agentCommission: zod_1.z.number().nonnegative().optional(),
    companyCommission: zod_1.z.number().nonnegative().optional(),
    totalTransactionAmount: zod_1.z.number().nonnegative("Total transaction amount must be positive"),
    status: zod_1.z
        .enum(Object.values(transaction_interface_1.TransactionStatus))
        .optional()
});
