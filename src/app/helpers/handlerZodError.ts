import { TErrorSources, TGenericErrorMessage } from "../interfaces/error.types";




export const handlerZodError = (error:any) : TGenericErrorMessage => {
    const errorSources : TErrorSources [] = [];     

    error.issues.forEach((issue:any)=> {
        errorSources.push({
            path: issue.path[issue.path.length -1],
            message: issue.message,
        })
    })

    return{
        statusCode: 400,
        message: "global Error Handler code: Zod Error",
        errorSources
    }
}