import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Unauthorized by middleware" });
        return;
    }

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error(
                "JWT_SECRET is not defined in environment variables"
            );
        }
        const decoded = verifyJwt(token, process.env.JWT_SECRET);
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
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
        return;
    }
};

export function ensureAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.isAuthenticated()) return next();
    res.redirect("/");
}

export default authMiddleware;
