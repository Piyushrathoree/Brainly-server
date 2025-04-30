import { Request, Response } from "express";
import Content from "../models/content.model";
const addContent = async (req: Request, res: Response): Promise<any> => {
    const { title, link, type } = req.body;
    
    
    const userId = req.user?.id;

    if (!title || !link || !type) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const content = new Content({
        title,
        link,
        type,
        userId,
        tags: [],
    });
    await content.save();
    return res
        .status(201)
        .json({ message: "Content created successfully", content });
};

const getContent = async (req: Request, res: Response): Promise<any> => {
    const content = await Content.find();
    if (content === undefined) {
        return res.status(404).json({ message: "no content found" });
    }
    return res
        .status(200)
        .json({ message: "all content fetched successfully ", content });
};

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
        .json({ message: "content deleted successfully ", deleteContent });
};

const updateContent = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { title, link } = req.body;

    if (!id) {
        return res.status(404).json("id not found");
    }
    const updatedContent = await Content.findByIdAndUpdate(
        id,
        { ...(title && { title }), ...(link && { link }) },
        { new: true }
    );
    if (!updatedContent) {
        return res
            .status(401)
            .json({ message: "something went wrong while updating content" });
    }
    return res
        .status(201)
        .json({ message: "content updated successfully ", updateContent });
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

export {
    getContent,
    addContent,
    getContentByUserId,
    getContentById,
    updateContent,
    deleteContent,
};
