import { useState, useEffect } from 'react';
import Header from '../components/Header';
import ArticleList from '../components/ArticleList';
import { articleService } from '../services/articleService';
import type { Article } from '../types/Article';

const OriginalArticles = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedArticles = await articleService.fetchArticles();
            // Filter only original articles
            const originalArticles = fetchedArticles.filter(article => article.version === 'original');
            setArticles(originalArticles);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load articles');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pt-20">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Original Articles</h1>
                        <p className="text-gray-600">Raw scraped content from BeyondChats blog</p>
                    </div>
                    <ArticleList
                        articles={articles}
                        loading={loading}
                        error={error}
                    />
                </div>
            </main>
        </div>
    );
};

export default OriginalArticles;