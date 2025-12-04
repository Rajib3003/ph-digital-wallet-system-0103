/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from "express";
import { handlerZodError } from "../helpers/handlerZodError";
import { TErrorSources } from "../interfaces/error.types";
import AppError from "../errorHelpers/AppError";
import { handlerDuplicatedError } from "../helpers/handlerDuplicatedError";
import { handlerValidationError } from "../helpers/handlerValidationError";
import { handlerCastError } from "../helpers/handlerCastError";




export const globalErrorHandler = (error : any, req: Request, res: Response) => {
    let statusCode = 500; 
    let message =  "Something went wrong !*!";
    let errorSources: TErrorSources[] | undefined = undefined;


    if(error.code === 11000){
        const simpifiedError = handlerDuplicatedError(error)
        statusCode = simpifiedError.statusCode
        message = simpifiedError.message
    }else if(error.name === "ValidationError"){
        const simpifiedError = handlerValidationError(error)
        statusCode = simpifiedError.statusCode
        message = simpifiedError.message
    }else if(error.name === "CastError"){
        const simpifiedError = handlerCastError(error)
        statusCode = simpifiedError.statusCode
        message = simpifiedError.message
    }else if(error.name === "ZodError"){        
        const simpifiedError =handlerZodError(error)
        statusCode = simpifiedError.statusCode
        message = simpifiedError.message
        errorSources = simpifiedError.errorSources        
    }else if(error instanceof AppError){
        statusCode= error.statusCode
        message = error.message        
    }else if(error instanceof Error){
        statusCode = 500
        message = error.message
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

