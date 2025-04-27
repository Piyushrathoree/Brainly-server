"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationMail = void 0;
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
            subject: "Hello World",
            html: mailTemplate_1.verificationMail.replace("VERIFICATION_CODE", verificationCode),
        });
    }
    catch (error) {
        throw new Error("error while sending email");
    }
};
exports.sendVerificationMail = sendVerificationMail;
