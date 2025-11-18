import { Response } from "express";

interface IMeta {
    total: number,
    page: number,
    limit: number,
    totalPages: number,
}


interface IResponse<T> {
    success: boolean,
    message: string,
    statusCode: number,
    data: T,
    meta?: IMeta,
}

const sendResponse =<T>(res: Response, data: IResponse<T> ) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        statusCode: data.statusCode,
        data: data.data,
        meta: data.meta,
    })
}

export default sendResponse;