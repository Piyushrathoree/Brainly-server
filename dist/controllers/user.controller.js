"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleShare = exports.changePassword = exports.GetUserProfile = exports.LogoutUser = exports.ResetPassword = exports.ForgotPassword = exports.VerifyUser = exports.LoginUser = exports.RegisterUser = void 0;
const user_model_1 = require("../models/user.model");
const utils_1 = require("../utils/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mail_1 = require("../mail/mail");
const crypto_1 = __importDefault(require("crypto"));
const RegisterUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(name, email, password);
        if (!name || !email || !password) {
            return res.status(400).send({ message: "All fields are required" });
        }
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: "User already exists" });
        }
        const verificationCode = (0, utils_1.generateVerificationCode)();
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
        const data = await (0, mail_1.sendRegisterMail)(email, verificationCode);
        if (data == null) {
            return res.status(402).json({ message: "sending email failed" });
        }
        const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
        const newUser = new user_model_1.User({
            name,
            email,
            password: hashedPassword,
            verificationCode,
            verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        });
        await newUser.save();
        const token = newUser.generateAuthToken();
        const userData = await user_model_1.User.findById(newUser._id).select('-password -verificationCode');
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
        });
        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: userData,
        });
    }
    catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
};
exports.RegisterUser = RegisterUser;
const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: "All fields are required" });
    }
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        return res.status(400).send({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(400).send({ message: "Invalid credentials" });
    }
    const token = user.generateAuthToken();
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    });
    user.lastLogin = new Date();
    user.isPublic = false;
    await user.save();
    await (0, mail_1.sendWelcomeBackMail)(email, `${process.env.CLIENT_URL}/dashboard`);
    const userData = await user_model_1.User.findById(user._id).select("-password -verificationCode -verificationCodeExpires -resetPasswordToken -resetPasswordTokenExpires");
    return res.status(200).json({
        message: "User logged in successfully",
        token,
        user: userData,
    });
};
exports.LoginUser = LoginUser;
const VerifyUser = async (req, res) => {
    const { verificationCode } = req.body;
    if (!verificationCode) {
        return res
            .status(400)
            .send({ message: "Verification code is required" });
    }
    try {
        const user = await user_model_1.User.findOne({ verificationCode });
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();
        return res.status(201).json({ message: "you're verified now " });
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
    }
};
exports.VerifyUser = VerifyUser;
const ForgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send({ message: "All fields are required" });
    }
    try {
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }
        const resetPasswordToken = crypto_1.default.randomBytes(20).toString("hex");
        const resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000;
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordTokenExpires = new Date(resetPasswordTokenExpires);
        await user.save();
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`;
        await (0, mail_1.sendForgotPasswordMail)(email, resetLink);
        return res.status(200).json({
            success: true,
            message: "password reset link has been sent to your email",
            resetPasswordToken,
        });
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
    }
};
exports.ForgotPassword = ForgotPassword;
const ResetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    if (!token || !password) {
        return res.status(404).json({ message: "something is missing " });
    }
    try {
        const user = await user_model_1.User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid or expired token" });
        }
        const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpires = undefined;
        await user.save();
        return res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
};
exports.ResetPassword = ResetPassword;
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).send({ message: "All fields are required" });
    }
    try {
        const user = await user_model_1.User.findById(req.user?._id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).send({ message: "Invalid credentials" });
        }
        user.password = bcryptjs_1.default.hashSync(newPassword, 10);
        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
    }
    catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
};
exports.changePassword = changePassword;
const LogoutUser = async (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
};
exports.LogoutUser = LogoutUser;
const GetUserProfile = async (req, res) => {
    try {
        const user = await user_model_1.User.findById(req.user?.id).select("-password -verificationCode -verificationCodeExpires -resetPasswordToken -resetPasswordTokenExpires");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
};
exports.GetUserProfile = GetUserProfile;
const toggleShare = async (req, res) => {
    const id = req.user?.id;
    if (!id) {
        return res.status(401).json({ message: "unauthorized" });
    }
    try {
        const user = await user_model_1.User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "user not found " });
        }
        user.isPublic = !user.isPublic;
        console.log(user.isPublic);
        await user.save();
        return res.status(201).json({
            message: "your profile is now changed",
            publicURL: `https://app-brainly-peach.vercel.app/share/${id}`
        });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
};
exports.toggleShare = toggleShare;
