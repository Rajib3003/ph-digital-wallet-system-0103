/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorMessage } from "../interfaces/error.types";


export const handlerDuplicatedError = (error : any): TGenericErrorMessage => {
    const matcheArray = error.message.match(/"([^"]*)"/)
    return{
        statusCode: 400,
        message: `Duplicate value entered for ${matcheArray[1]} field, please choose another value`
    }
}