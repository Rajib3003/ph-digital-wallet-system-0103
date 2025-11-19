import { Request, Response } from "express";
import { UserService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";






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

export const UserController = {
    createUser
}