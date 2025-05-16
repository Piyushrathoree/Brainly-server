"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const content_controller_1 = require("../controllers/content.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const contentRouter = (0, express_1.Router)();
// Protected routes
contentRouter.post("/add", auth_middleware_1.default, content_controller_1.addContent);
contentRouter.delete("/delete/:id", auth_middleware_1.default, content_controller_1.deleteContent);
contentRouter.put("/update/:id", auth_middleware_1.default, content_controller_1.updateContent);
contentRouter.get("/get-content/:id", auth_middleware_1.default, content_controller_1.getContentById);
contentRouter.get("/user/:userId", auth_middleware_1.default, content_controller_1.getContentByUserId);
// contentRouter.get("/getcontentByType", authMiddleware, getContentByType); 
// Public route (no middleware)
contentRouter.get("/share/:shareCode", content_controller_1.getPublicContentByUser);
// route for sending all data to user 
contentRouter.get("/all-content", auth_middleware_1.default, content_controller_1.GetAllContent);
exports.default = contentRouter;
