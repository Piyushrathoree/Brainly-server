import { Request, Response } from "express";
import { User } from "../models/user.model";
import { generateVerificationCode } from "../utils/utils";
import bcrypt from "bcryptjs";
import { sendVerificationMail } from "../mail/mail";
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
    const user = await User.findOne({ verificationCode });
    if (!user) {
        return res.status(400).send({ message: "User not found" });
    }
    user.isVerified = true;
    await user.save();

    return res.status(201).json({ message: "you're verified now " });
};

const ForgotPassword = async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send({ message: "User not found" });
    }
    // await sendResetPasswordEmail(email)
};

const ResetPassword = async (req: Request, res: Response): Promise<any> => {
    res.status(200).send({ message: "Password reset successfully" });
};

const LogoutUser = async (req: Request, res: Response): Promise<any> => {
    res.status(200).send({ message: "User logged out successfully" });
};
const GetUserProfile = async (req: Request, res: Response): Promise<any> => {
    res.status(200).send({ message: "User profile fetched successfully" });
};

export {
    RegisterUser,
    LoginUser,
    VerifyUser,
    ForgotPassword,
    ResetPassword,
    LogoutUser,
    GetUserProfile,
};
