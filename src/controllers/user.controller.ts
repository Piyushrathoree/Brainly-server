import { Request, Response } from "express";
import { User } from "../models/user.model";
import { generateVerificationCode } from "../utils/utils";
import bcrypt from "bcryptjs";
import {
    sendForgotPasswordMail,
    sendVerificationMail,
    sendWelcomeBackMail,
} from "../mail/mail";
import crypto from "crypto";
import jwt from "jsonwebtoken";
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
            };
            token?: string;
        }
    }
}
const RegisterUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: "User already exists" });
        }

        const verificationCode = generateVerificationCode();

        if (!verificationCode) {
            return res
                .status(500)
                .send({ message: "Failed to generate verification code" });
        }

        if (process.env.RESEND_API_KEY === undefined) {
            return res
                .status(500)
                .send({ message: "Resend API key is not set" });
        }

        //verificaiton email sending
        sendVerificationMail(email, verificationCode);

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            verificationCode,
            verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        });
        await newUser.save();
        const token = newUser.generateAuthToken();
        res.cookie("token", token, { httpOnly: true });
        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: newUser,
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
};

const LoginUser = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(400).send({ message: "Invalid credentials" });
    }

    const token = user.generateAuthToken();
    res.cookie("token", token, { httpOnly: true });
    user.lastLogin = new Date();
    await user.save();
    await sendWelcomeBackMail(email, `${process.env.CLIENT_URL}/dashboard`);

    return res.status(200).json({
        message: "User logged in successfully",
        token,
        user,
    });
};

const VerifyUser = async (req: Request, res: Response): Promise<any> => {
    const { verificationCode } = req.body;
    if (!verificationCode) {
        return res
            .status(400)
            .send({ message: "Verification code is required" });
    }
    try {
        const user = await User.findOne({ verificationCode });
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        return res.status(201).json({ message: "you're verified now " });
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "An unknown error occurred"
        );
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

        res.status(200).json({
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
        res.status(200).json({ message: "Password reset successfully" });
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
        const user = await User.findById(req.user?._id).select(
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

export {
    RegisterUser,
    LoginUser,
    VerifyUser,
    ForgotPassword,
    ResetPassword,
    LogoutUser,
    GetUserProfile,
    changePassword,
};
