"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHash = exports.generateVerificationCode = void 0;
const generateVerificationCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
};
exports.generateVerificationCode = generateVerificationCode;
const uuid_1 = require("uuid");
const generateHash = () => {
    const hash = (0, uuid_1.v4)().replace(/-/g, ''); // Remove dashes from UUID
    return hash.substring(0, 16); // Return the first 16 characters
};
exports.generateHash = generateHash;
