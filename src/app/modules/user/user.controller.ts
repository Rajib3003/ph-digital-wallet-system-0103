import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";


const createUser = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const user = await UserService.createUser(req.body)

          res.status(200).json({ // use res.status() to set HTTP status
            success: true,
            message: "User created successfully",
            statusCode: 200,
            data: user,
        });
        
    } catch (error) {
        console.log(error);
         res.status(500).json({
            success: false,
            message: "Internal server error",
            statusCode: 500,
        });
    }
}

export const UserController = {
    createUser
}