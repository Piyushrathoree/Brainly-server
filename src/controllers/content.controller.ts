import { Request, Response } from "express";
import Content from "../models/content.model";
import Tag from "../models/tag.model";
import { User } from "../models/user.model";
import mongoose from "mongoose";

const addContent = async (req: Request, res: Response): Promise<any> => {
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
    const existingContent = await Content.findOne({ title });
    if (existingContent) {
        return res.status(400).json({ message: "Content already exists" });
    }
    const normalizedTags: string[] = tags
        .map((t: any) => String(t).trim())
        .filter((t: string) => t.length > 0);

    const existingTags = await Tag.find({ title: { $in: normalizedTags } });
    const existingTitles = new Set(existingTags.map((t: any) => t.title));
    const missingTitles = normalizedTags.filter(
        (t: string) => !existingTitles.has(t)
    );

    if (missingTitles.length > 0) {
        try {
            await Tag.insertMany(
                missingTitles.map((t: string) => ({ title: t })),
                { ordered: false }
            );
        } catch {
            // ignore duplicate insert races
        }
    }

    const allTags = await Tag.find({ title: { $in: normalizedTags } });
    const tagIds = allTags.map((tag: any) => tag._id);

    const content = new Content({
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

const deleteContent = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    if (!id) {
        return res.status(404).json("id not found");
    }
    const deletedContent = await Content.findByIdAndDelete(id);
    if (!deletedContent) {
        return res
            .status(401)
            .json({ message: "something went wrong while deleting content" });
    }
    return res
        .status(201)
        .json({
            message: "content deleted successfully ",
            content: deletedContent,
        });
};

const updateContent = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { title, link, description } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Content ID not provided" });
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (link) updateData.link = link;
    if (description) updateData.content = description;

    try {
        const updatedContent = await Content.findByIdAndUpdate(id, updateData, {
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
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getContentById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    if (!id) {
        return res.status(404).json("id not found");
    }
    const content = await Content.findById(id);
    if (!content) {
        return res.status(404).json({ message: "content not found " });
    }
    return res
        .status(200)
        .json({ message: "content fetched successfully", content });
};

const getContentByUserId = async (
    req: Request,
    res: Response
): Promise<any> => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(404).json({ message: "userId not found" });
    }
    const userContent = await Content.find({ userId });
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

const GetAllContent = async (req: Request, res: Response): Promise<any> => {
    const userId = req.user?.id;
    const content = await Content.find({ userId });
    if (content === undefined) {
        return res.status(404).json({ message: "no content found" });
    }
    return res
        .status(200)
        .json({ message: "all content fetched successfully ", content });
};

const getPublicContentByUser = async (
    req: Request,
    res: Response
): Promise<any> => {
    const { shareCode } = req.params;
    if (!shareCode) {
        return res.status(404).json({ message: "shareCode not found" });
    }
    const user = await User.findOne({ shareCode });
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }

    const content = await Content.find({ userId: user._id });
    if (!content) {
        return res.status(404).json({ message: "no content found" });
    }
    return res.status(200).json({
        message: "content related to this user is fetched ",
        content,
    });
};
// const getContentByType = async (req: Request, res: Response): Promise<any> => {
//     const { type } = req.params;
//     if (!type) {
//         return res.status(404).json({ message: "type not found" });
//     }
//     const content = await Content.find({ type });
//     if (content === undefined) {
//         return res.status(404).json({
//             message: "something went wrong while fetching content of this type",
//         });
//     }
//     return res.status(200).json({
//         message: "content related to this type is fetched ",
//         content,
//     });
// }

export {
    // getContent,
    addContent,
    getContentByUserId,
    getContentById,
    updateContent,
    deleteContent,
    getPublicContentByUser,
    // getContentByType,
    GetAllContent,
};
