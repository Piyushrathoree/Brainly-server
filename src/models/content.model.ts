import { Schema, model } from "mongoose";

const contentOptions: string[] = [
    "youtube",
    "tweet",
    "image",
    "article",
    "blog",
    "other",
];
const contentSchema = new Schema(
    {
        link: { type: String, required: true },
        title: { type: String, required: true },
        type: { type: String, enum: contentOptions, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    },
    {
        timestamps: true,
    }
);

const Content = model("Content", contentSchema);
export default Content;
