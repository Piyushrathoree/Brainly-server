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

AuthRouter.get('/profile', authMiddleware, (req, res) => {
    res.status(200).json({ user: req.user?.id });
});
export default AuthRouter;