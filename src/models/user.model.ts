import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const userSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        verificationToken: { type: String },
        verificationTokenExpires: { type: Date },
        resetPasswordToken: { type: String },
        resetPasswordTokenExpires: { type: Date },
        isVerified: { type: Boolean, default: false },
        lastLogin: { type: Date, default: Date.now },
    },
    { timestamps: true }
);
userSchema.methods.generateAuthToken = function ():string {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    return token;
};
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

export const User = model("User", userSchema);
