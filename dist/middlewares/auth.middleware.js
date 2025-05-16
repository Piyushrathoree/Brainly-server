"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = ensureAuthenticated;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Unauthorized by middleware" });
        return;
    }
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        if (typeof decoded === "object" && decoded !== null) {
            req.user = decoded;
        }
        else {
            throw new Error("Invalid token payload");
        }
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" });
        return;
    }
};
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect("/");
}
exports.default = authMiddleware;
