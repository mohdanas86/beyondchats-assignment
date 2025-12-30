import { useState, useEffect } from 'react';
import Header from './components/Header';
import ArticleList from './components/ArticleList';
import { articleService } from './services/articleService';
import type { Article } from './types/Article';
import './App.css';

function App() {
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
      setArticles(fetchedArticles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <ArticleList
            articles={articles}
            loading={loading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
