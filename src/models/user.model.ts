import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { signJwt } from "../utils/jwt";

interface IUser {
    name: string;
    email: string;
    password: string;
    verificationCode?: string;
    verificationCodeExpires?: Date;
    resetPasswordToken?: string;
    resetPasswordTokenExpires?: Date;
    isVerified?: boolean;
    lastLogin?: Date;
    isPublic?: Boolean;
    generateAuthToken: () => string;
    comparePassword: (password: string) => Promise<boolean>;
    shareCode?: string;
}
const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        verificationCode: { type: String },
        verificationCodeExpires: { type: Date },
        resetPasswordToken: { type: String },
        resetPasswordTokenExpires: { type: Date },
        isVerified: { type: Boolean, default: false },
        lastLogin: { type: Date, default: Date.now },
        isPublic: { type: Boolean, default: false },
        shareCode: { type: String },
    },
    { timestamps: true }
);

userSchema.methods.generateAuthToken = function (): string {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    // 10 days
    return signJwt(
        { id: String(this._id) },
        process.env.JWT_SECRET,
        10 * 24 * 60 * 60
    );
};
userSchema.methods.comparePassword = async function (
    password: string
): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

export const User = model("User", userSchema);
