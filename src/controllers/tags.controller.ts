import { Request, Response } from "express";
import Tag from "../models/tag.model";
import Content from "../models/content.model";


const createTag = async (req: Request, res: Response): Promise<any> => {
    const { title } = req.body
    if (!title) {
        return res.status(404).json({ message: "title not found" })
    }
    const tag = await Tag.findOne({ title })
    if (tag) {
        return res.status(401).json({ message: "this tag already exists and the tag must be unique" })
    }
    const newTag = new Tag({ title });
    await newTag.save();
    return res.status(201).json(newTag);
}

const showAllTag = async (req: Request, res: Response): Promise<any> => {
    const tags = await Tag.find();
    return res.status(200).json(tags);
}

const getContentByTag = async (req: Request, res: Response): Promise<any> => {
    const title = req.query.title as string;

    if (!title || !title.trim()) {
        return res.status(400).json({ message: "Tag title is required" });
    }

    try {
        const tag = await Tag.findOne({ title: title }).lean();
        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }

        const contents = await Content.find({ tags: tag._id })
            .populate("tags", "title")
            .lean();

        if (!contents.length) {
            return res.status(404).json({ message: "No content found for this tag" });
        }

        return res.status(200).json({ contents });
    } catch (error) {
        console.error("Error fetching content by tag:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export { createTag, showAllTag, getContentByTag }