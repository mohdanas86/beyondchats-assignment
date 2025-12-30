import mongoose from "mongoose";

/**
 * Article Schema
 * Defines the structure for article documents in MongoDB
 */
const articleSchema = new mongoose.Schema({
    title: String,
    content: String, // HTML preserved
    url: String, // unique
    publishedAt: String,
    version: {
        type: String,
        default: "original"
    },
    source: {
        type: String,
        default: "beyondchats"
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

/**
 * Article Model
 * Represents the Article collection in MongoDB
 */
const Article = mongoose.model('Article', articleSchema);

export default Article;