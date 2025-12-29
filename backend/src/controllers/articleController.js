import Article from "../models/articals.js";

/**
 * @desc Get all articles
 * @route GET /api/articles
 * @access Public
 */
export const getArticles = async (req, res) => {
    try {
        const articles = await Article.find();
        res.status(200).json({
            success: true,
            count: articles.length,
            data: articles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

/**
 * @desc Get single article by ID
 * @route GET /api/articles/:id
 * @access Public
 */
export const getArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }
        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

/**
 * @desc Create a new article
 * @route POST /api/articles
 * @access Public
 */
export const createArticle = async (req, res) => {
    try {
        const article = await Article.create(req.body);
        res.status(201).json({
            success: true,
            data: article
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Bad Request",
            error: error.message
        });
    }
};

/**
 * @desc Update an article by ID
 * @route PUT /api/articles/:id
 * @access Public
 */
export const updateArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }
        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Bad Request",
            error: error.message
        });
    }
};

/**
 * @desc Delete an article by ID
 * @route DELETE /api/articles/:id
 * @access Public
 */
export const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Article deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};
