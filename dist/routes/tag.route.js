"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TagRouter = (0, express_1.Router)();
const tags_controller_1 = require("../controllers/tags.controller");
TagRouter.post("/create", tags_controller_1.createTag);
TagRouter.get("/All", tags_controller_1.showAllTag);
TagRouter.get("/content", tags_controller_1.getContentByTag);
exports.default = TagRouter;
