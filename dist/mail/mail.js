"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeBackMail = exports.sendForgotPasswordMail = exports.sendVerificationMail = void 0;
const resend_1 = require("resend");
const mailTemplate_1 = require("./mailTemplate");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
if (!process.env.RESEND_API_KEY) {
    throw new Error("api key not found");
}
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const sendVerificationMail = async (email, verificationCode) => {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Email verification",
            html: mailTemplate_1.verificationMail.replace("__CODE__", verificationCode),
        });
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
};
exports.sendVerificationMail = sendVerificationMail;
const sendForgotPasswordMail = async (email, resetLink) => {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Reset password request",
            html: mailTemplate_1.forgotPasswordMail.replace("__RESET_LINK__", resetLink),
        });
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
};
exports.sendForgotPasswordMail = sendForgotPasswordMail;
const sendWelcomeBackMail = async (email, dashboardLink) => {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Welcome back!",
            html: mailTemplate_1.welcomeBackMail.replace("__Dashboard_link__", dashboardLink),
        });
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
};
exports.sendWelcomeBackMail = sendWelcomeBackMail;
