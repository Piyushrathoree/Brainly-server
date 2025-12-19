import app from "./app";
import { config } from "dotenv";
import connectDB from "./db/db";
config();

connectDB()
    .then(() => {
        const port = Number(process.env.PORT) || 5000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Error connecting to MongoDB:", error);
    });
