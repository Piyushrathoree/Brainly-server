import { Request, Response } from "express";

const RegisterUser = async (req:Request, res:Response) => {
    res.status(201).send({ message: "User registered successfully" });
}

const LoginUser = async (req:Request, res:Response) => {
    res.status(200).send({ message: "User logged in successfully" });
}

const VerifyUser = async (req:Request, res:Response) => {
    res.status(200).send({ message: "User verified successfully" });
}

const ForgotPassword = async (req:Request, res:Response) => {
    res.status(200).send({ message: "Password reset link sent successfully" });
}

const ResetPassword = async (req:Request, res:Response) => {
    res.status(200).send({ message: "Password reset successfully" });
}

const LogoutUser = async (req:Request, res:Response) => {
    res.status(200).send({ message: "User logged out successfully" });
}
const GetUserProfile = async (req:Request, res:Response) => {
    res.status(200).send({ message: "User profile fetched successfully" });
}

export {
    RegisterUser,
    LoginUser,
    VerifyUser,
    ForgotPassword,
    ResetPassword,
    LogoutUser,
    GetUserProfile
}