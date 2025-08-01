"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TagSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true }
}, { timestamps: true });
const Tag = (0, mongoose_1.model)("Tag", TagSchema);
exports.default = Tag;
