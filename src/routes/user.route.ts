import { Router } from "express";
import { ForgotPassword, LoginUser, LogoutUser, RegisterUser, ResetPassword, VerifyUser } from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";


const AuthRouter = Router();

AuthRouter.post("/register", RegisterUser)
AuthRouter.post("/login", LoginUser)
AuthRouter.post("/verify", VerifyUser);
AuthRouter.post("/forgot-password", ForgotPassword);
AuthRouter.post("/reset-password/:token", ResetPassword);
AuthRouter.post('/logout',authMiddleware, LogoutUser)

export default AuthRouter;