import React from 'react';
import type { Article } from '../types/Article';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
    articles: Article[];
    loading: boolean;
    error: string | null;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, loading, error }) => {
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading articles...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="retry-button"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="empty-container">
                <div className="empty-icon">📝</div>
                <h3>No articles found</h3>
                <p>Articles will appear here once they're scraped and processed.</p>
            </div>
        );
    }

    // Group articles by title to show original and updated versions together
    const groupedArticles = articles.reduce((groups, article) => {
        const key = article.title;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(article);
        return groups;
    }, {} as Record<string, Article[]>);

    return (
        <div className="article-list">
            {Object.entries(groupedArticles).map(([title, articleGroup]) => (
                <div key={title} className="article-group">
                    {articleGroup.map((article) => (
                        <ArticleCard key={article._id} article={article} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ArticleList;