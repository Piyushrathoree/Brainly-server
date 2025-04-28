import express from "express";
import cors from "cors";
import AuthRouter from "./routes/user.route";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser()); // Middleware to parse cookies
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded requests
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).send({ message: "Welcome to the Brainly API" });
});


// middlewares and routes
app.use('/api/v1',AuthRouter)


export default app; // Export the app instance for use in other modules
    