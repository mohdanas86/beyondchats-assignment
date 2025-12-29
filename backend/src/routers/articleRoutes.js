import express from "express";
import {
    getArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle
} from "../controllers/articleController.js";

const router = express.Router();

/**
 * @route GET /api/articles
 * @desc Get all articles
 * @access Public
 */
router.get("/", getArticles);

/**
 * @route GET /api/articles/:id
 * @desc Get single article by ID
 * @access Public
 */
router.get("/:id", getArticle);

/**
 * @route POST /api/articles
 * @desc Create a new article
 * @access Public
 */
router.post("/", createArticle);

/**
 * @route PUT /api/articles/:id
 * @desc Update an article by ID
 * @access Public
 */
router.put("/:id", updateArticle);

/**
 * @route DELETE /api/articles/:id
 * @desc Delete an article by ID
 * @access Public
 */
router.delete("/:id", deleteArticle);

export default router;
