import { Resend } from "resend";
import { forgotPasswordMail, verificationMail, welcomeBackMail } from "./mailTemplate";
import { config } from "dotenv";
config();

if (!process.env.RESEND_API_KEY) {
    throw new Error("api key not found");
}
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationMail = async (
    email: string,
    verificationCode: string
) => {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Email verification",
            html: verificationMail.replace("__CODE__", verificationCode),
        });
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
};

export const sendForgotPasswordMail = async (
    email: string,
    resetLink: string
) => {
    
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Reset password request",
            html: forgotPasswordMail.replace("__RESET_LINK__", resetLink),
        });
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
};

export const sendWelcomeBackMail = async (email: string , dashboardLink :string) => {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Welcome back!",
            html: welcomeBackMail.replace("__Dashboard_link__", dashboardLink),
        });
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}