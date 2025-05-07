"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUser = void 0;
const mongoose_1 = require("mongoose");
const authUserSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true, unique: true },
    email: { type: String },
    name: { type: String },
    avatar: { type: String },
});
exports.AuthUser = (0, mongoose_1.model)("AuthUser", authUserSchema);
