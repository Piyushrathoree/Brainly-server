import express from "express";
import { config } from "dotenv";
import { cors } from "cors";
import { connectDB } from "./config/db.js";
import { connect } from "mongoose";
config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

