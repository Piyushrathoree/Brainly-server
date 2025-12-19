"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = ensureAuthenticated;
const jwt_1 = require("../utils/jwt");
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
        const decoded = (0, jwt_1.verifyJwt)(token, process.env.JWT_SECRET);
        const id = decoded.id;
        if (typeof id !== "string") {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        req.user = { id };
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
