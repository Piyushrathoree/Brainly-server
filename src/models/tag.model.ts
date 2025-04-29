import { Schema, model, mongo } from "mongoose";

const TagSchema = new Schema(
    {
        hash: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Tag = model("Tag", TagSchema);
export default Tag;