import { Router } from "express";
import { UserRoutes } from "../modules/user/user.router";
import { AuthRoutes } from "../modules/auth/auth.router";

export const router = Router();

const modelRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    }
]

modelRoutes.forEach((route)=>{
    router.use(route.path, route.route)
})