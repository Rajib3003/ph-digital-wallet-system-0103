/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorMessage } from "../interfaces/error.types";



export const handlerValidationError = (error: any) : TGenericErrorMessage => {
    return{
        statusCode: 400,
        message: Object.values(error.errors).map((value:any)=> value.message).join(", ")
    }
}