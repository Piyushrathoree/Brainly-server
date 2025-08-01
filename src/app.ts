import express from "express";
import cors from "cors";
import AuthRouter, { router } from "./routes/user.route";
import cookieParser from "cookie-parser";
import contentRouter from "./routes/content.route";


//import for oauth
import session from 'express-session'
import passport from "passport";
import dotenv from 'dotenv'

import './controllers/googleAuth.controller'

dotenv.config()

const app = express();

app.use(cookieParser()); // Middleware to parse cookies
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded requests

const allowedOrigins = [
  "http://localhost:5173",
  "https://app-brainly-peach.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true // if you use cookies/sessions
}));

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());



// app.get("/", (_, res) => {
//     res.send(`<h2>Home</h2><a href="/oauth/google">Login with Google</a><br/><a href="/oauth/github">Login with GitHub</a>`);
// });
app.use("/oauth", router)

// middlewares and routes
app.use("/api/v1", AuthRouter);
app.use("/api/v1/content", contentRouter);


export default app; // Export the app instance for use in other modules
