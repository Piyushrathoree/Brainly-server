"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const contentOptions = [
    "tweet",
    "image",
    "document",
    "video",
    "note",
    "link"
];
const contentSchema = new mongoose_1.Schema({
    link: { type: String, unique: false },
    title: { type: String, required: true },
    type: { type: String, enum: contentOptions, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Tag" }],
    content: { type: String },
}, {
    timestamps: true,
});
const Content = (0, mongoose_1.model)("Content", contentSchema);
exports.default = Content;
