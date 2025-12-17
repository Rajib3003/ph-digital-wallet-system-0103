import dotenv from "dotenv";

dotenv.config()

interface EnvConfig {
    PORT : string,
    DB_URL : string,
    NODE_ENV : string,
    BCRYPT_SALT_ROUND : string,
    JWT_ACCESS_SECRET : string,
    JWT_ACCESS_EXPIRES: string,
    JWT_REFRESH_SECRET: string,
    JWT_REFRESH_EXPIRES: string,
    FRONTEND_URL: string,
    BACKEND_URL: string,
    GOOGLE_CLIENT_SECRET: string,
    GOOGLE_CLIENT_ID: string,
    GOOGLE_CALLBACK_URL: string,
    EXPRESS_SESSION_SECRET: string,
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASSWORD: string,
    INITIAL_BALANCE: string,
    TRANSACTION_FEE_PERCENT: string,
    AGENT_COMMISSION_PERCENT: string,
    SUPER_ADMIN_DEFAULT_BALANCE: string,
    SEND_MONEY_COMMISSION: string,
    EMAIL_SENDER: {
        SMTP_USER: string;
        SMTP_PASS: string;
        SMTP_PORT: string;
        SMTP_HOST: string;
        SMTP_FROM: string;
    };

}


const loadEnvVariables = () : EnvConfig => {
    const requiredEnvVariables : string [] = [    
        "PORT",
        "DB_URL",
        "NODE_ENV",
        "BCRYPT_SALT_ROUND",
        "JWT_ACCESS_SECRET",
        "JWT_ACCESS_EXPIRES",
        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_EXPIRES",
        "FRONTEND_URL",
        "BACKEND_URL",
        "SMTP_PASS",
        "SMTP_PORT",
        "SMTP_HOST",
        "SMTP_USER",
        "SMTP_FROM", 
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_CALLBACK_URL",
        "EXPRESS_SESSION_SECRET",
        "SUPER_ADMIN_EMAIL",
        "SUPER_ADMIN_PASSWORD",
        "INITIAL_BALANCE",
        "TRANSACTION_FEE_PERCENT",
        "AGENT_COMMISSION_PERCENT",
        "SUPER_ADMIN_DEFAULT_BALANCE",
        "SEND_MONEY_COMMISSION"
    ]

    requiredEnvVariables.forEach(key =>{
        if(!process.env[key]){
            throw new Error(`Missing require environment variabl ${key}`)
        }
    })


    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as string,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        BACKEND_URL: process.env.BACKEND_URL as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
        INITIAL_BALANCE: process.env.INITIAL_BALANCE as string,
        TRANSACTION_FEE_PERCENT: process.env.TRANSACTION_FEE_PERCENT as string,
        AGENT_COMMISSION_PERCENT: process.env.AGENT_COMMISSION_PERCENT as string,
        SUPER_ADMIN_DEFAULT_BALANCE: process.env.SUPER_ADMIN_DEFAULT_BALANCE as string,
        SEND_MONEY_COMMISSION: process.env.SEND_MONEY_COMMISSION as string,
        EMAIL_SENDER: {
            SMTP_USER: process.env.SMTP_USER as string,
            SMTP_PASS: process.env.SMTP_PASS as string,
            SMTP_PORT: process.env.SMTP_PORT as string,
            SMTP_HOST: process.env.SMTP_HOST as string,
            SMTP_FROM: process.env.SMTP_FROM as string,
        },

    }
}

export const envVar = loadEnvVariables()


