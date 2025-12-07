import {  Request, Response } from "express";
import { UserService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";







const createUser = catchAsync(async(req: Request, res: Response) =>{   
        const user = await UserService.createUser(req.body)

        sendResponse(res,{
            success: true,
            message: "User Created Successfully !*!",
            statusCode: 200,
            data: user,            
        })
    }
)

const getAllUsers = catchAsync(async(req: Request, res: Response)=> {
    const query = req.query
    const result = await UserService.getAllUsers(query as Record<string, string>);
    sendResponse(res,{
        success: true,
        message: "All Users Retrieved Successfully !*!",
        statusCode: StatusCodes.OK,
         meta: result.meta,
        data: result.data,
        
    })
})

const getSingleUser = catchAsync(async(req: Request, res: Response)=> {

    const UserId = req.params.userId;    
    const result = await UserService.getSingleUser(UserId);
    sendResponse(res,{
        success: true,
        message: "Single Users Retrieved Successfully !*!",
        statusCode: StatusCodes.OK,        
        data: result,
        
    })


})
const deleteUser = catchAsync(async(req: Request, res: Response)=> {
    const UserId = req.params.userId;  
    const result = await UserService.deleteUser(UserId)
    sendResponse(res,{
        success: true,
        message: "User Delete Successfully !*!",
        statusCode: StatusCodes.OK,        
        data: result,        
    })
})

const updatedUser = catchAsync(async(req: Request, res: Response)=> {
    const UserId = req.params.userId;  
    const payload = req.body;
    const result = await UserService.updatedUser(UserId, payload)

     sendResponse(res,{
        success: true,
        message: "User Updated Successfully !*!",
        statusCode: StatusCodes.OK,        
        data: result,        
    })

})



 // const query = req.query

   
    // const result = await UserService.getAllUsers(query as Record<string, string>);

export const UserController = {
    createUser,
    getAllUsers,
    getSingleUser,
    deleteUser,
    updatedUser
}