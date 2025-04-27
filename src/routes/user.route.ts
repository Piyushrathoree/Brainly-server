import { Router } from "express";
import { LoginUser, RegisterUser } from "../controllers/user.controller";


const AuthRouter = Router();

AuthRouter.post("/register", RegisterUser)
AuthRouter.post("/login", LoginUser)

export default AuthRouter;