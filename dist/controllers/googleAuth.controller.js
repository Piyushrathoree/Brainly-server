"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.githubCallback = exports.googleCallback = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_github2_1 = require("passport-github2");
const dotenv_1 = __importDefault(require("dotenv"));
const oAuth_model_1 = require("../models/oAuth.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await oAuth_model_1.AuthUser.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
});
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.CALLBACK_URL}/oauth/google/callback`,
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        let user = await oAuth_model_1.AuthUser.findOne({ providerId: profile.id });
        if (!user) {
            user = await oAuth_model_1.AuthUser.create({
                provider: "google",
                providerId: profile.id,
                email: profile.emails?.[0]?.value,
                name: profile.displayName,
                avatar: profile.photos?.[0]?.value,
            });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
}));
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.CALLBACK_URL}/oauth/github/callback`,
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        let user = await oAuth_model_1.AuthUser.findOne({ providerId: profile.id });
        if (!user) {
            user = await oAuth_model_1.AuthUser.create({
                provider: "github",
                providerId: profile.id,
                email: profile.emails?.[0]?.value,
                name: profile.displayName || profile.username,
                avatar: profile.photos?.[0]?.value,
            });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
}));
const googleCallback = (req, res) => {
    const user = req.user;
    // Create a JWT token for the user
    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'your-jwt-secret', { expiresIn: '7d' });
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
};
exports.googleCallback = googleCallback;
const githubCallback = (req, res) => {
    const user = req.user;
    // Create a JWT token for the user
    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'your-jwt-secret', { expiresIn: '7d' });
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
};
exports.githubCallback = githubCallback;
const logout = (req, res) => {
    req.logout(err => {
        if (err)
            return res.status(500).send("Logout error.");
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`);
    });
};
exports.logout = logout;
