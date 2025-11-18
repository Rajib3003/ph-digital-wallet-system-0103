import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import catchAsync from "../../utils/catchAsync";





const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{   
        const user = await UserService.createUser(req.body)
        
        res.status(200).json({ 
            success: true,
            message: "User created successfully",
            statusCode: 200,
            data: user,
        });
    }
)

export const UserController = {
    createUser
}