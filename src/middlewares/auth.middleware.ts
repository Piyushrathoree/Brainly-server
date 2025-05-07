import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const token = req.cookies?.token;
    
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error(
                "JWT_SECRET is not defined in environment variables"
            );
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        if (typeof decoded === "object" && decoded !== null) {
            req.user = decoded as {
                _id: string;
                name: string;
                email: string;
                isVerified: boolean;
                lastLogin?: Date;
                verificationCode?: string;
                verificationCodeExpires?: Date;
                resetPasswordToken?: string;
                resetPasswordTokenExpires?: Date;
            };
        } else {
            throw new Error("Invalid token payload");
        }
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

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) return next();
    res.redirect("/");
}


export default authMiddleware;
