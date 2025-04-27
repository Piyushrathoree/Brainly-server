"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const AuthRouter = (0, express_1.Router)();
AuthRouter.post("/register", user_controller_1.RegisterUser);
AuthRouter.post("/login", user_controller_1.LoginUser);
exports.default = AuthRouter;
