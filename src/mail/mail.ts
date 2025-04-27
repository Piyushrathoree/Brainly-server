import { Resend } from "resend";
import { verificationMail } from "./mailTemplate";
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
            subject: "Hello World",
            html: verificationMail.replace(
                "VERIFICATION_CODE",
                verificationCode
            ),
        });
    } catch (error) {
        throw new Error("error while sending email");
    }
};
