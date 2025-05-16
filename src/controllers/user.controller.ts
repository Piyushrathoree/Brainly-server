import { Request, Response } from "express";
import { User } from "../models/user.model";
import { generateHash, generateVerificationCode } from "../utils/utils";
import bcrypt from "bcryptjs";
import {
    sendForgotPasswordMail,
    sendRegisterMail,
    sendWelcomeBackMail,
} from "../mail/mail";
import crypto from "crypto";

declare global {
    namespace Express {
        interface Request {
            user?: {
                _id: string;
                name: string;
                email: string;
                isVerified: boolean;
                lastLogin?: Date;
                verificationCode?: string;
                verificationCodeExpires?: Date;
                resetPasswordToken?: string;
                resetPasswordTokenExpires?: Date;
                id?: string;
            };
            token?: string;
        }
    }
}
const shareCode = generateHash();
const RegisterUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, password } = req.body;
        console.log(name, email, password);

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const verificationCode = generateVerificationCode();

        if (!verificationCode) {
            return res
                .status(500)
                .json({ message: "Failed to generate verification code" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            verificationCode,
            verificationTokenExpiresAt: Date.now() + 60 * 1000 * 10, // 10 minutes
            shareCode
        });
        await newUser.save();
        const token = newUser.generateAuthToken();
        const userData = await User.findById(newUser._id).select('-password -verificationCode')
        //verificaiton email sending
        const data = await sendRegisterMail(email, verificationCode);
        if (data == null) {
            return res.status(503).json({ message: "Email service unavailable" });
        }
        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: userData,
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const LoginUser = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = user.generateAuthToken();

    user.lastLogin = new Date();
    user.isPublic = false
    await user.save();
    await sendWelcomeBackMail(email, `${process.env.CLIENT_URL}/dashboard`);

    const userData = await User.findById(user._id).select(
        "-password -verificationCode -verificationCodeExpires -resetPasswordToken -resetPasswordTokenExpires"
    );
    return res.status(200).json({
        message: "User logged in successfully",
        token,
        user: userData,
    });
};

const VerifyUser = async (req: Request, res: Response): Promise<any> => {
    const { verificationCode } = req.body;
    if (!verificationCode) {
        return res
            .status(400)
            .json({ message: "Verification code is required" });
    }
    try {
        const user = await User.findOne({ verificationCode });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        return res.status(200).json({ message: "You're verified now" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const ForgotPassword = async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ message: "All fields are required" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }
        const resetPasswordToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000;

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordTokenExpires = new Date(resetPasswordTokenExpires);
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`;
        await sendForgotPasswordMail(email, resetLink);

        return res.status(200).json({
            success: true,
            message: "password reset link has been sent to your email",
            resetPasswordToken,
        });
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "An unknown error occurred"
        );
    }
};

const ResetPassword = async (req: Request, res: Response): Promise<any> => {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
        return res.status(404).json({ message: "something is missing " });
    }
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid or expired token" });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpires = undefined;
        await user.save();
        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
};

const changePassword = async (req: Request, res: Response): Promise<any> => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).send({ message: "All fields are required" });
    }
    try {
        const user = await User.findById(req.user?._id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).send({ message: "Invalid credentials" });
        }
        user.password = bcrypt.hashSync(newPassword, 10);
        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
};

const LogoutUser = async (req: Request, res: Response): Promise<any> => {
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
};

const GetUserProfile = async (req: Request, res: Response): Promise<any> => {
    try {

        const user = await User.findById(req.user?.id).select(
            "-password -verificationCode -verificationCodeExpires -resetPasswordToken -resetPasswordTokenExpires"
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
};

const toggleShare = async (req: Request, res: Response): Promise<any> => {
    const id = req.user?.id;

    console.log(req.user , id );
    
    if (!id) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isPublic = !user.isPublic;
        await user.save();

        return res.status(200).json({
            message: "Your profile visibility has been updated",
            shareDetails: user.isPublic ? { shareCode, publicURL: `https://app-brainly-peach.vercel.app/share/${shareCode}`, LocalPublicUrl: `http://localhost:5173/share/${shareCode}` } : null,
            user
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export {
    RegisterUser,
    LoginUser,
    VerifyUser,
    ForgotPassword,
    ResetPassword,
    LogoutUser,
    GetUserProfile,
    changePassword,
    toggleShare
};
