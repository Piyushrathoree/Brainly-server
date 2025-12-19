import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error(
                "MONGODB_URI is not set. Create a .env file (copy from .env.example) and set MONGODB_URI."
            );
            process.exit(1);
        }
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
