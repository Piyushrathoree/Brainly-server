"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserProfile = exports.LogoutUser = exports.ResetPassword = exports.ForgotPassword = exports.VerifyUser = exports.LoginUser = exports.RegisterUser = void 0;
const user_model_1 = require("../models/user.model");
const utils_1 = require("../utils/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mail_1 = require("../mail/mail");
const RegisterUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
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
        (0, mail_1.sendVerificationMail)(email, verificationCode);
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
        res.cookie("token", token, { httpOnly: true });
        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: newUser,
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
    res.cookie("token", token, { httpOnly: true });
    user.lastLogin = new Date();
    await user.save();
    return res.status(200).json({
        message: "User logged in successfully",
        token,
        user,
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
    const user = await user_model_1.User.findOne({ verificationCode });
    if (!user) {
        return res.status(400).send({ message: "User not found" });
    }
    user.isVerified = true;
    await user.save();
    return res.status(201).json({ message: "you're verified now " });
};
exports.VerifyUser = VerifyUser;
const ForgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send({ message: "All fields are required" });
    }
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        return res.status(400).send({ message: "User not found" });
    }
    // await sendResetPasswordEmail(email)
};
exports.ForgotPassword = ForgotPassword;
const ResetPassword = async (req, res) => {
    res.status(200).send({ message: "Password reset successfully" });
};
exports.ResetPassword = ResetPassword;
const LogoutUser = async (req, res) => {
    res.status(200).send({ message: "User logged out successfully" });
};
exports.LogoutUser = LogoutUser;
const GetUserProfile = async (req, res) => {
    res.status(200).send({ message: "User profile fetched successfully" });
};
exports.GetUserProfile = GetUserProfile;
