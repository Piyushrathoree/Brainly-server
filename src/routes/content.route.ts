import { Router } from "express";
import {
    addContent,
    deleteContent,
    getContent,
    getContentById,
    getContentByUserId,
    updateContent,
} from "../controllers/content.controller";
import authMiddleware from "../middlewares/auth.middleware";

const contentRouter = Router();

//middleware for authorization
contentRouter.use(authMiddleware)
//routes

contentRouter.get("/all-content", getContent);
contentRouter.post("/add", addContent);
contentRouter.delete("/delete/:id", deleteContent);
contentRouter.put("/update/:id", updateContent);
contentRouter.get("/get-content/:id", getContentById);
contentRouter.get("/user/:userId",getContentByUserId);

export default contentRouter;
