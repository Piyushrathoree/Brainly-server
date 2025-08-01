"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllContent = exports.getPublicContentByUser = exports.deleteContent = exports.updateContent = exports.getContentById = exports.getContentByUserId = exports.addContent = void 0;
const content_model_1 = __importDefault(require("../models/content.model"));
const tag_model_1 = __importDefault(require("../models/tag.model"));
const user_model_1 = require("../models/user.model");
const addContent = async (req, res) => {
    const { title, link, type, description } = req.body;
    const userId = req.user?.id;
    const tags = req.body.tags || [];
    if (!tags || !Array.isArray(tags)) {
        return res.status(400).json({ message: "Tags must be an array" });
    }
    if (!title || !type) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const existingContent = await content_model_1.default.findOne({ title });
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
        tags: tagIds,
        content: description,
    });
    await content.save();
    return res
        .status(201)
        .json({ message: "Content created successfully", content });
};
exports.addContent = addContent;
//controller for admin 
// const getContent = async (req: Request, res: Response): Promise<any> => {
//     const content = await Content.find();
//     if (content === undefined) {
//         return res.status(404).json({ message: "no content found" });
//     }
//     return res
//         .status(200)
//         .json({ message: "all content fetched successfully ", content });
// };
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
    const { title, link, description } = req.body;
    if (!id) {
        return res.status(400).json({ message: "Content ID not provided" });
    }
    const updateData = {};
    if (title)
        updateData.title = title;
    if (link)
        updateData.link = link;
    if (description)
        updateData.content = description;
    try {
        const updatedContent = await content_model_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
        });
        if (!updatedContent) {
            return res
                .status(404)
                .json({ message: "Content not found with provided ID" });
        }
        return res.status(200).json({
            message: "Content updated successfully",
            content: updatedContent,
        });
    }
    catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
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
const GetAllContent = async (req, res) => {
    const userId = req.user?.id;
    const content = await content_model_1.default.find({ userId });
    if (content === undefined) {
        return res.status(404).json({ message: "no content found" });
    }
    return res
        .status(200)
        .json({ message: "all content fetched successfully ", content });
};
exports.GetAllContent = GetAllContent;
const getPublicContentByUser = async (req, res) => {
    const { shareCode } = req.params;
    if (!shareCode) {
        return res.status(404).json({ message: "shareCode not found" });
    }
    const user = await user_model_1.User.findOne({ shareCode });
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }
    const content = await content_model_1.default.find({ userId: user._id });
    if (!content) {
        return res.status(404).json({ message: "no content found" });
    }
    return res.status(200).json({
        message: "content related to this user is fetched ",
        content,
    });
};
exports.getPublicContentByUser = getPublicContentByUser;
