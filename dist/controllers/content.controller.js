"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContent = exports.updateContent = exports.getContentById = exports.getContentByUserId = exports.addContent = exports.getContent = void 0;
const content_model_1 = __importDefault(require("../models/content.model"));
const tag_model_1 = __importDefault(require("../models/tag.model"));
const addContent = async (req, res) => {
    const { title, link, type } = req.body;
    const userId = req.user?.id;
    const tags = req.body.tags || [];
    if (!tags || !Array.isArray(tags)) {
        return res.status(400).json({ message: "Tags must be an array" });
    }
    if (!title || !link || !type) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const existingContent = await content_model_1.default.findOne({ link });
    if (existingContent) {
        return res.status(400).json({ message: "Content already exists" });
    }
    const tag = await tag_model_1.default.find({ title: { $in: tags } });
    const tagIds = tag.map(tag => tag._id);
    const content = new content_model_1.default({
        title,
        link,
        type,
        userId,
        tags: tagIds
    });
    await content.save();
    return res
        .status(201)
        .json({ message: "Content created successfully", content });
};
exports.addContent = addContent;
const getContent = async (req, res) => {
    const content = await content_model_1.default.find();
    if (content === undefined) {
        return res.status(404).json({ message: "no content found" });
    }
    return res
        .status(200)
        .json({ message: "all content fetched successfully ", content });
};
exports.getContent = getContent;
const deleteContent = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(404).json("id not found");
    }
    const deletedContent = await content_model_1.default.findByIdAndDelete(id);
    if (!deletedContent) {
        return res
            .status(401)
            .json({ message: "something went wrong while deleting content" });
    }
    return res
        .status(201)
        .json({ message: "content deleted successfully ", deleteContent });
};
exports.deleteContent = deleteContent;
const updateContent = async (req, res) => {
    const { id } = req.params;
    const { title, link } = req.body;
    if (!id) {
        return res.status(404).json("id not found");
    }
    const updatedContent = await content_model_1.default.findByIdAndUpdate(id, { ...(title && { title }), ...(link && { link }) }, { new: true });
    if (!updatedContent) {
        return res
            .status(401)
            .json({ message: "something went wrong while updating content" });
    }
    return res
        .status(201)
        .json({ message: "content updated successfully ", updateContent });
};
exports.updateContent = updateContent;
const getContentById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(404).json("id not found");
    }
    const content = await content_model_1.default.findById(id);
    if (!content) {
        return res.status(404).json({ message: "content not found " });
    }
    return res
        .status(200)
        .json({ message: "content fetched successfully", content });
};
exports.getContentById = getContentById;
const getContentByUserId = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(404).json({ message: "userId not found" });
    }
    const userContent = await content_model_1.default.find({ userId });
    if (userContent === undefined) {
        return res.status(404).json({
            message: "something went wrong while fetching content of this user",
        });
    }
    return res.status(200).json({
        message: "content related to this user is fetched ",
        userContent,
    });
};
exports.getContentByUserId = getContentByUserId;
