import { Response } from "express";

interface IMeta {
    page: number;
    limit: number;
    totalPage: number;
    total : number;
}


interface IResponse<T> {
    success: boolean;
    message: string;
    statusCode: number;
    data: T;
    meta?: IMeta;
    
}

const sendResponse =<T>(res: Response, data: IResponse<T> ) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        statusCode: data.statusCode,
        meta: data.meta,
        data: data.data,        
    })
}

export default sendResponse;