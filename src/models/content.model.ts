import { Schema, model } from "mongoose";

const contentOptions: string[] = [
    "tweet",
    "image",
    "document",
    "video",
    "note",
];
const contentSchema = new Schema(
    {
        link: { type: String, required: true ,unique: true },
        title: { type: String, required: true },
        type: { type: String, enum: contentOptions, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    },
    {
        timestamps: true,
    }
);

const Content = model("Content", contentSchema);
export default Content;
