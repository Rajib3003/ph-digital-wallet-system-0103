import { z } from "zod";
import { TransactionStatus, TransactionType } from "./transaction.interface";


export const createTransactionZodSchema = z.object({
  type: z.enum(Object.values(TransactionType) as [string, ...string[]]),
  from: z.string().nonempty("From wallet user ID is required"),
  to: z.string().nonempty("To wallet user ID is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  agentCommission: z.number().nonnegative().optional(),
  companyCommission: z.number().nonnegative().optional(),
  totalTransactionAmount: z.number().nonnegative("Total transaction amount must be positive"),
  status: z
    .enum(Object.values(TransactionStatus) as [string, ...string[]])    
    .optional()
});
