"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerValidationError = void 0;
const handlerValidationError = (error) => {
    return {
        statusCode: 400,
        message: Object.values(error.errors).map((value) => value.message).join(", ")
    };
};
exports.handlerValidationError = handlerValidationError;
