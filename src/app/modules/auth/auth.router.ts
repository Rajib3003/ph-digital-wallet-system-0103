import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVar } from "../../config/env";


const router = Router();

router.post("/login", AuthController.credentialsLogin);
router.post("/refresh-token", AuthController.getNewAccessToken)
router.post("/logout", AuthController.logout)
router.post("/change-password", checkAuth(...Object.values(Role)), AuthController.changePassword)
router.post("/set-password", checkAuth(...Object.values(Role)), AuthController.setPassword)
router.post("/forgot-password", AuthController.forgotPassword)
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthController.resetPassword)


router.get("/google", async (req:Request, res: Response, next: NextFunction)=> {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string})(req, res, next);
})

router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${envVar.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with our support team  !*!`}), AuthController.googleCallBackController)


//http://localhost:5000/api/v1/auth/google/callback?state=%2F&code=4%2F0Ab32j93vD1o3WLIIT6x9r_-nurx4BNrCgpg_FKW2u05guTaxqqDBBeDHhEYDtH5CsfwjBQ&scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&authuser=0&prompt=none
export const AuthRoutes = router