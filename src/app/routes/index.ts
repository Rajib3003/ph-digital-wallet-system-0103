import { Router } from "express";
import { UserRoutes } from "../modules/user/user.router";

export const router = Router();

const modelRoutes = [
    {
        path: "/user",
        route: UserRoutes
    }
]

modelRoutes.forEach((route)=>{
    router.use(route.path, route.route)
})