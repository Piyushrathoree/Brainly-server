import { Resend } from "resend";
import { forgotPasswordMail, verificationMail, welcomeBackMail } from "./mailTemplate";
import { config } from "dotenv";
config();


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



import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "Gmail", // or 'hotmail', etc., if you're not using Gmail
    auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
    },
});
export async function sendRegisterMail(email: string, verificationCode: string) {
    try {
        const mail = {
            from: process.env.EMAIL_USER!,
            to: email,
            subject: `verification email from brainly`,
            html: verificationMail.replace("__CODE__", verificationCode),
        };
        const data = await transporter.sendMail(mail)

        return data
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

export async function sendForgotPasswordMail(email: string, resetLink: string) {
    try {
        const mail = {
            from: process.env.EMAIL_USER!,
            to: email,
            subject: `Reset Password link`,
            html: forgotPasswordMail.replace("__RESET_LINK__", resetLink),
        };
        const data = await transporter.sendMail(mail)
        

        return data
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

export const sendWelcomeBackMail = async (email: string, dashboardLink: string) => {
    try {
        const mail = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome back!",
            html: welcomeBackMail.replace("__Dashboard_link__", dashboardLink),
        }
       
        const data = await transporter.sendMail(mail)
        
        return data
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}
