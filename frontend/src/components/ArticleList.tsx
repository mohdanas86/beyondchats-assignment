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
            <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading articles...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">Articles will appear here once they're scraped and processed.</p>
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
        <div className="max-w-4xl mx-auto px-4 py-8">
            {Object.entries(groupedArticles).map(([title, articleGroup]) => (
                <div key={title} className="mb-8">
                    {articleGroup.map((article) => (
                        <ArticleCard key={article._id} article={article} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ArticleList;