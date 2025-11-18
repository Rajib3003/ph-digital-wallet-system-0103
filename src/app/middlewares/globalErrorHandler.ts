import { NextFunction, Request, Response } from "express";


export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    const stateusCode = error.statusCode || 500; 
    const message = error.message || "Internal server error";

    return res.status(stateusCode).json({
        success: false,
        message,
        stateusCode,
        stack: error.stack,
        // stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
}

