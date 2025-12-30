import React from 'react';
import type { Article } from '../types/Article';

interface ArticleCardProps {
    article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getVersionBadge = (version?: string) => {
        if (version === 'updated') {
            return <span className="version-badge updated">AI Enhanced</span>;
        }
        return <span className="version-badge original">Original</span>;
    };

    return (
        <article className="article-card">
            <div className="article-header">
                <h2 className="article-title">{article.title}</h2>
                {getVersionBadge(article.version)}
            </div>

            <div className="article-meta">
                <span className="article-date">
                    Published: {formatDate(article.publishedAt)}
                </span>
                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-link"
                >
                    Read on BeyondChats →
                </a>
            </div>

            <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {article.version === 'updated' && (
                <div className="article-footer">
                    <small className="enhancement-note">
                        ✨ This article has been enhanced with AI for better readability and formatting
                    </small>
                </div>
            )}
        </article>
    );
};

export default ArticleCard;