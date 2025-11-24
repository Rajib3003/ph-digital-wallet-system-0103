import { Router } from "express";
import { UserController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post("/register",validateRequest(createUserZodSchema), UserController.createUser);
router.get("/", UserController.getAllUsers);
router.get("/single-user/:userId", checkAuth(...Object.values(Role)), UserController.getSingleUser);
router.delete("/delete-user/:userId", checkAuth(Role.ADMIN), UserController.deleteUser);
router.patch("/update-user/:userId", UserController.updatedUser);


export const UserRoutes = router