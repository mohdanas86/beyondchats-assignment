import type { Article, ApiResponse } from "../types/Article";

// API base URL - change this to your deployed backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ArticleService {
  async fetchArticles(): Promise<Article[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/articles`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error("Failed to fetch articles");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      throw error;
    }
  }

  async fetchArticle(id: string): Promise<Article> {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`);
      const data: ApiResponse = await response.json();

      if (data.success && data.data.length > 0) {
        return data.data[0];
      } else {
        throw new Error("Article not found");
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      throw error;
    }
  }
}

export const articleService = new ArticleService();
