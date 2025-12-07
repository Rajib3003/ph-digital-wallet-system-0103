"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerCastError = void 0;
const handlerCastError = (error) => {
    return {
        statusCode: 400,
        message: `globalErrorHandlar file code:Invalid ${error.path}: ${error.value}`
    };
};
exports.handlerCastError = handlerCastError;
