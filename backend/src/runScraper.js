import scrapeBeyondChats from "./scraper/scrapeBeyondChats.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

/**
 * Main function to run the scraper
 */
const runScraper = async () => {
    try {
        console.log("Initializing scraper...");
        await scrapeBeyondChats();
        console.log("Scraper execution completed");
        process.exit(0);
    } catch (error) {
        console.error("Scraper execution failed:", error);
        process.exit(1);
    }
};

// Run the scraper
runScraper();
