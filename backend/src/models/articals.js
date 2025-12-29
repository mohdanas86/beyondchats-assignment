import mongoose from "mongoose";

/**
 * Article Schema
 * Defines the structure for article documents in MongoDB
 */
const articleSchema = new mongoose.Schema({
    /**
     * Title of the article
     * @type {String}
     */
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    /**
     * Content of the article (HTML)
     * @type {String}
     */
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    /**
     * URL of the original article
     * @type {String}
     */
    url: {
        type: String,
        required: [true, 'URL is required'],
        unique: true
    },
    /**
     * Publication date (ISO string)
     * @type {String}
     */
    publishedAt: {
        type: String,
        required: [true, 'Published date is required']
    },
    /**
     * Version of the article
     * @type {String}
     */
    version: {
        type: String,
        default: 'original',
        enum: ['original', 'updated']
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