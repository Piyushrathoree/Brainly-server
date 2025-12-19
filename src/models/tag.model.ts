import { Schema, model } from "mongoose";

interface ITag {
    title: string;
}

const tagSchema = new Schema<ITag>(
    {
        title: { type: String, required: true, unique: true, trim: true },
    },
    { timestamps: true }
);

const Tag = model("Tag", tagSchema);
export default Tag;
