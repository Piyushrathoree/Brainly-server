import app from "./app"
import { config } from "dotenv"
import connectDB from "./db/db";
config()



connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error:Error) => {
        console.error("Error connecting to MongoDB:", error);
    });
