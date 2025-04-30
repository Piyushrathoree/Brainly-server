"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const linkSchema = new mongoose_1.Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
const Link = (0, mongoose_1.model)("Link", linkSchema);
exports.default = Link;
