import { NextFunction, Request, Response } from "express";
import { handlerZodError } from "../helpers/handlerZodError";
import { TErrorSources } from "../interfaces/error.types";




export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = error.statusCode || 500; 
    let message = error.message || "Something went wrong !*!";
    let errorSources: TErrorSources[] | undefined = undefined;

    // if(error instanceof ZodError){

    // }
    if(error.name === "ZodError"){        
        const simpifiedError =handlerZodError(error)
        statusCode = simpifiedError.statusCode
        message = simpifiedError.message
        errorSources = simpifiedError.errorSources        
    }

    

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        // stack: error.stack?.split("\n"),
        error:process.env.NODE_ENV === "development" ? error : null,        
        stack: process.env.NODE_ENV === "development" ? error.stack : null, 
        // error:envVars.NODE_ENV === "development" ? error : null,        
        // stack: envVars.NODE_ENV === "development" ? error.stack : null, 
        // stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
}

