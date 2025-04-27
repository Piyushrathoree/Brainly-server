import express from "express";
import cors from "cors";


const app = express();


app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded requests
app.use(cors());



// middlewares and routes



export default app; // Export the app instance for use in other modules
