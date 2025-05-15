import { Schema, model } from "mongoose";

const contentOptions: string[] = [
    "tweet",
    "image",
    "document",
    "video",
    "note",
    "link"
];
const contentSchema = new Schema(
    {
        link: { type: String , unique:false},
        title: { type: String, required: true },
        type: { type: String, enum: contentOptions, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
        content: { type: String },
    },
    {   
        timestamps: true,
    }
);

const Content = model("Content", contentSchema);
export default Content;
