import { Router } from "express";
import { ForgotPassword, GetUserProfile, LoginUser, LogoutUser, RegisterUser, ResetPassword, toggleShare, VerifyUser } from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";
import passport from "passport";
import { googleCallback, githubCallback, logout } from "../controllers/googleAuth.controller";

const AuthRouter = Router();

//manual authentication

AuthRouter.post("/register", RegisterUser)
AuthRouter.post("/login", LoginUser)
AuthRouter.post("/verify", VerifyUser);
AuthRouter.post("/forgot-password", ForgotPassword);
AuthRouter.post("/reset-password/:token", ResetPassword);
AuthRouter.post('/logout', authMiddleware, LogoutUser)
AuthRouter.put("/share/toggle", authMiddleware, toggleShare)

AuthRouter.get('/profile', authMiddleware, GetUserProfile);

//oauth authentication

const router = Router()
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    googleCallback
);

// GitHub auth
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback",
    passport.authenticate("github", { failureRedirect: "/" }),
    githubCallback
);

// Logout route
router.get("/logout", logout);
export { router };
export default AuthRouter;