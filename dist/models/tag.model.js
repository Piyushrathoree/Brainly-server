"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TagSchema = new mongoose_1.Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
const Tag = (0, mongoose_1.model)("Tag", TagSchema);
exports.default = Tag;
