import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import articleRoutes from "./src/routers/articleRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/articles", articleRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
