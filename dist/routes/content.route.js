"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const content_controller_1 = require("../controllers/content.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const contentRouter = (0, express_1.Router)();
//middleware for authorization
contentRouter.use(auth_middleware_1.default);
//routes
contentRouter.get("/all-content", content_controller_1.getContent);
contentRouter.post("/add", content_controller_1.addContent);
contentRouter.delete("/delete/:id", content_controller_1.deleteContent);
contentRouter.put("/update/:id", content_controller_1.updateContent);
contentRouter.get("/get-content/:id", content_controller_1.getContentById);
contentRouter.get("/user/:userId", content_controller_1.getContentByUserId);
exports.default = contentRouter;
