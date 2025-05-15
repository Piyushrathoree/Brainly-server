import { Router } from "express";

const TagRouter = Router()
import { createTag, showAllTag, getContentByTag } from "../controllers/tags.controller";

TagRouter.post("/create", createTag);
TagRouter.get("/All", showAllTag);
TagRouter.get("/content", getContentByTag);

export default TagRouter