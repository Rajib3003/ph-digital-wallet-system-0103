"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const handlerZodError_1 = require("../helpers/handlerZodError");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const handlerDuplicatedError_1 = require("../helpers/handlerDuplicatedError");
const handlerValidationError_1 = require("../helpers/handlerValidationError");
const handlerCastError_1 = require("../helpers/handlerCastError");
const globalErrorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong !*!";
    let errorSources = undefined;
    if (error.code === 11000) {
        const simpifiedError = (0, handlerDuplicatedError_1.handlerDuplicatedError)(error);
        statusCode = simpifiedError.statusCode;
        message = simpifiedError.message;
    }
    else if (error.name === "ValidationError") {
        const simpifiedError = (0, handlerValidationError_1.handlerValidationError)(error);
        statusCode = simpifiedError.statusCode;
        message = simpifiedError.message;
    }
    else if (error.name === "CastError") {
        const simpifiedError = (0, handlerCastError_1.handlerCastError)(error);
        statusCode = simpifiedError.statusCode;
        message = simpifiedError.message;
    }
    else if (error.name === "ZodError") {
        const simpifiedError = (0, handlerZodError_1.handlerZodError)(error);
        statusCode = simpifiedError.statusCode;
        message = simpifiedError.message;
        errorSources = simpifiedError.errorSources;
    }
    else if (error instanceof AppError_1.default) {
        statusCode = error.statusCode;
        message = error.message;
    }
    else if (error instanceof Error) {
        statusCode = 500;
        message = error.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        // stack: error.stack?.split("\n"),
        error: process.env.NODE_ENV === "development" ? error : null,
        stack: process.env.NODE_ENV === "development" ? error.stack : null,
        // error:envVars.NODE_ENV === "development" ? error : null,        
        // stack: envVars.NODE_ENV === "development" ? error.stack : null, 
        // stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
};
exports.globalErrorHandler = globalErrorHandler;
