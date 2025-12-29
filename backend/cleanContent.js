import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as cheerio from 'cheerio';
import Article from './src/models/articals.js';

dotenv.config();

const cleanContent = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find all articles
        const articles = await Article.find({});
        console.log(`Found ${articles.length} articles to clean`);

        for (const article of articles) {
            if (article.content && article.content.includes('<')) {
                // Clean HTML content to plain text using cheerio
                const $ = cheerio.load(article.content);
                const cleanText = $.text();
                const cleanedContent = cleanText.replace(/\s+/g, ' ').replace(/\n+/g, '\n').trim();

                // Update the article
                await Article.findByIdAndUpdate(article._id, { content: cleanedContent });
                console.log(`Cleaned content for: ${article.title}`);
            }
        }

        console.log('Content cleaning completed');
        process.exit(0);
    } catch (error) {
        console.error('Error cleaning content:', error);
        process.exit(1);
    }
};

cleanContent();