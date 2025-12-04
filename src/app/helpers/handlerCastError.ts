/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorMessage } from "../interfaces/error.types";


export const handlerCastError = (error:any) : TGenericErrorMessage  => {
    return{
        statusCode: 400,
        message: `globalErrorHandlar file code:Invalid ${error.path}: ${error.value}`        
    }
}