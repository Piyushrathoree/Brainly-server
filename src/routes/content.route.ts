import { Router } from "express";
import {
    addContent,
    deleteContent,
    getContentById,
    getContentByUserId,
    getPublicContentByUser,
    updateContent,
} from "../controllers/content.controller";
import authMiddleware from "../middlewares/auth.middleware";

const contentRouter = Router();

// Protected routes
contentRouter.post("/add", authMiddleware, addContent);
contentRouter.delete("/delete/:id", authMiddleware, deleteContent);
contentRouter.put("/update/:id", authMiddleware, updateContent);
contentRouter.get("/get-content/:id", authMiddleware, getContentById);
contentRouter.get("/user/:userId", authMiddleware, getContentByUserId);

// Public route (no middleware)
contentRouter.get("/share/:userId", getPublicContentByUser);

export default contentRouter;
