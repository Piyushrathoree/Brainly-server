import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import { AuthUser } from "../models/oAuth.model";
import { signJwt } from "../utils/jwt";
dotenv.config();

passport.serializeUser((user, done) => {
    done(null, (user as any)._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await AuthUser.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

if (
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.CALLBACK_URL
) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${process.env.CALLBACK_URL}/oauth/google/callback`,
            },
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    let user = await AuthUser.findOne({
                        providerId: profile.id,
                    });
                    if (!user) {
                        user = await AuthUser.create({
                            provider: "google",
                            providerId: profile.id,
                            email: profile.emails?.[0]?.value,
                            name: profile.displayName,
                            avatar: profile.photos?.[0]?.value,
                        });
                    }
                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );
} else {
    console.warn(
        "[oauth] Google OAuth not configured; missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET/CALLBACK_URL"
    );
}

if (
    process.env.GITHUB_CLIENT_ID &&
    process.env.GITHUB_CLIENT_SECRET &&
    process.env.CALLBACK_URL
) {
    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: `${process.env.CALLBACK_URL}/oauth/github/callback`,
            },
            async (
                _accessToken: string,
                _refreshToken: string,
                profile: any,
                done: any
            ) => {
                try {
                    let user = await AuthUser.findOne({
                        providerId: profile.id,
                    });
                    if (!user) {
                        user = await AuthUser.create({
                            provider: "github",
                            providerId: profile.id,
                            email: profile.emails?.[0]?.value,
                            name: profile.displayName || profile.username,
                            avatar: profile.photos?.[0]?.value,
                        });
                    }
                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );
} else {
    console.warn(
        "[oauth] GitHub OAuth not configured; missing GITHUB_CLIENT_ID/GITHUB_CLIENT_SECRET/CALLBACK_URL"
    );
}

import { Request, Response } from "express";

export const googleCallback = (req: Request, res: Response) => {
    const user = req.user as any;

    const secret = process.env.JWT_SECRET || "dev-jwt-secret";
    const token = signJwt(
        { id: String(user._id), email: user.email },
        secret,
        7 * 24 * 60 * 60
    );

    // Redirect to frontend with token
    res.redirect(
        `${
            process.env.FRONTEND_URL || "http://localhost:5173"
        }/auth/callback?token=${token}`
    );
};

export const githubCallback = (req: Request, res: Response) => {
    const user = req.user as any;

    const secret = process.env.JWT_SECRET || "dev-jwt-secret";
    const token = signJwt(
        { id: String(user._id), email: user.email },
        secret,
        7 * 24 * 60 * 60
    );

    // Redirect to frontend with token
    res.redirect(
        `${
            process.env.FRONTEND_URL || "http://localhost:5173"
        }/auth/callback?token=${token}`
    );
};

export const logout = (req: Request, res: Response) => {
    req.logout((err) => {
        if (err) return res.status(500).send("Logout error.");
        res.redirect(
            `${process.env.FRONTEND_URL || "http://localhost:5173"}/login`
        );
    });
};
