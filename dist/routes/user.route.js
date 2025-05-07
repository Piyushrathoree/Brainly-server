"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const passport_1 = __importDefault(require("passport"));
const googleAuth_controller_1 = require("../controllers/googleAuth.controller");
const AuthRouter = (0, express_1.Router)();
//manual authentication
AuthRouter.post("/register", user_controller_1.RegisterUser);
AuthRouter.post("/login", user_controller_1.LoginUser);
AuthRouter.post("/verify", user_controller_1.VerifyUser);
AuthRouter.post("/forgot-password", user_controller_1.ForgotPassword);
AuthRouter.post("/reset-password/:token", user_controller_1.ResetPassword);
AuthRouter.post('/logout', auth_middleware_1.default, user_controller_1.LogoutUser);
AuthRouter.put("/share/toggle", auth_middleware_1.default, user_controller_1.toggleShare);
AuthRouter.get('/profile', auth_middleware_1.default, user_controller_1.GetUserProfile);
//oauth authentication
const router = (0, express_1.Router)();
exports.router = router;
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/" }), googleAuth_controller_1.googleCallback);
// GitHub auth
router.get("/github", passport_1.default.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport_1.default.authenticate("github", { failureRedirect: "/" }), googleAuth_controller_1.githubCallback);
// Logout route
router.get("/logout", googleAuth_controller_1.logout);
exports.default = AuthRouter;
