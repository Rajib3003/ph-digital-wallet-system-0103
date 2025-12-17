import httpStatusCode from 'http-status-codes';
import { Request, Response } from "express"

const notFound = (req:Request, res:Response)=>{
    res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "Route Not Found"
    })
}
export default notFound;