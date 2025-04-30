"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentByTag = exports.showAllTag = exports.createTag = void 0;
const tag_model_1 = __importDefault(require("../models/tag.model"));
const content_model_1 = __importDefault(require("../models/content.model"));
const createTag = async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(404).json({ message: "title not found" });
    }
    const tag = await tag_model_1.default.findOne({ title });
    if (tag) {
        return res.status(401).json({ message: "this tag already exists and the tag must be unique" });
    }
    const newTag = new tag_model_1.default({ title });
    await newTag.save();
    return res.status(201).json(newTag);
};
exports.createTag = createTag;
const showAllTag = async (req, res) => {
    const tags = await tag_model_1.default.find();
    return res.status(200).json(tags);
};
exports.showAllTag = showAllTag;
const getContentByTag = async (req, res) => {
    const title = req.query.title;
    if (!title || !title.trim()) {
        return res.status(400).json({ message: "Tag title is required" });
    }
    try {
        const tag = await tag_model_1.default.findOne({ title: title }).lean();
        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }
        const contents = await content_model_1.default.find({ tags: tag._id })
            .populate("tags", "title")
            .lean();
        if (!contents.length) {
            return res.status(404).json({ message: "No content found for this tag" });
        }
        return res.status(200).json({ contents });
    }
    catch (error) {
        console.error("Error fetching content by tag:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getContentByTag = getContentByTag;
