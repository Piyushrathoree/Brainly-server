"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeBackMail = void 0;
exports.sendRegisterMail = sendRegisterMail;
exports.sendForgotPasswordMail = sendForgotPasswordMail;
const mailTemplate_1 = require("./mailTemplate");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// const resend = new Resend(process.env.RESEND_API_KEY);
// export const sendVerificationMail = async (
//     email: string,
//     verificationCode: string
// ) => {
//     try {
//         const data = await resend.emails.send({
//             from: "onboarding@resend.dev",
//             to: email,
//             subject: "Email verification",
//             html: verificationMail.replace("__CODE__", verificationCode),
//         });
//         return data
//     } catch (error) {
//         throw new Error(error instanceof Error ? error.message : String(error));
//     }
// };
// export const sendForgotPasswordMail = async (
//     email: string,
//     resetLink: string
// ) => {
//     try {
//         const data = await resend.emails.send({
//             from: "onboarding@resend.dev",
//             to: email,
//             subject: "Reset password request",
//             html: forgotPasswordMail.replace("__RESET_LINK__", resetLink),
//         });
//         return data
//     } catch (error) {
//         throw new Error(error instanceof Error ? error.message : String(error));
//     }
// };
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "Gmail", // or 'hotmail', etc., if you're not using Gmail
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
async function sendRegisterMail(email, verificationCode) {
    try {
        const mail = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `verification email from brainly`,
            html: mailTemplate_1.verificationMail.replace("__CODE__", verificationCode),
        };
        const data = await transporter.sendMail(mail);
        return data;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}
async function sendForgotPasswordMail(email, resetLink) {
    try {
        const mail = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Reset Password link`,
            html: mailTemplate_1.forgotPasswordMail.replace("__RESET_LINK__", resetLink),
        };
        const data = await transporter.sendMail(mail);
        return data;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}
const sendWelcomeBackMail = async (email, dashboardLink) => {
    try {
        const mail = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome back!",
            html: mailTemplate_1.welcomeBackMail.replace("__Dashboard_link__", dashboardLink),
        };
        const data = await transporter.sendMail(mail);
        return data;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
};
exports.sendWelcomeBackMail = sendWelcomeBackMail;
