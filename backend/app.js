import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import articleRoutes from "./src/routers/articleRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database first
connectDB();

// Basic middleware setup
app.use(cors());
app.use(express.json());

// Set up routes
app.use("/api/articles", articleRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
