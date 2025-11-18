
export interface TErrorSources {
    path: string,
    message: string,
}

export interface TGenericErrorMessage{
    statusCode: number,
    message: string,
    errorSources?: TErrorSources[],
}