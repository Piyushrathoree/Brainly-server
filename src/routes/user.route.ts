import { Router } from "express";
import { ForgotPassword, GetUserProfile, LoginUser, LogoutUser, RegisterUser, ResetPassword, toggleShare, VerifyUser } from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";


const AuthRouter = Router();

AuthRouter.post("/register", RegisterUser)
AuthRouter.post("/login", LoginUser)
AuthRouter.post("/verify", VerifyUser);
AuthRouter.post("/forgot-password", ForgotPassword);
AuthRouter.post("/reset-password/:token", ResetPassword);
AuthRouter.post('/logout',authMiddleware, LogoutUser)
AuthRouter.put("/share/toggle",authMiddleware,toggleShare)

AuthRouter.get('/profile', authMiddleware,GetUserProfile);
export default AuthRouter;