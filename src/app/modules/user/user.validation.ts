import z from "zod";
import { Role } from "./user.interface";



export const createUserZodSchema =z.object( {
    name : z
    .string()    
    .min(2,"Name 2 leter kom deoya jabe na")
    .max(100,"Name 100 letter beshi deoya jabe na"),
    email: z
    .string()
    .email("Please provide the valied Email"),
    password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[\W_]/, { message: "Password must contain at least one special character" }) 
    .optional(),
    phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),            
    address: z
    .string()
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional() ,
    role: z
    .enum(Object.values(Role) as [string, ...string[]])
    .optional()


})
export const updateUserZodSchema = z.object({
    name : z
    .string()    
    .min(2,"Name 2 leter kom deoya jabe na")
    .max(100,"Name 100 letter beshi deoya jabe na")
    .optional(),
    phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),            
    address: z
    .string()
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional() ,    
    role: z
    .enum(Object.values(Role) as [string, ...string[]])
    .optional()

});