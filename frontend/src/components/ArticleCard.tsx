import React from 'react';
import ReactMarkdown from 'react-markdown';
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

            <div className="article-content">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h3 className="markdown-h1">{children}</h3>,
                        h2: ({ children }) => <h3 className="markdown-h2">{children}</h3>,
                        h3: ({ children }) => <h4 className="markdown-h3">{children}</h4>,
                        h4: ({ children }) => <h5 className="markdown-h4">{children}</h5>,
                        p: ({ children }) => <p className="markdown-p">{children}</p>,
                        ul: ({ children }) => <ul className="markdown-ul">{children}</ul>,
                        ol: ({ children }) => <ol className="markdown-ol">{children}</ol>,
                        li: ({ children }) => <li className="markdown-li">{children}</li>,
                        blockquote: ({ children }) => <blockquote className="markdown-blockquote">{children}</blockquote>,
                        strong: ({ children }) => <strong className="markdown-strong">{children}</strong>,
                        em: ({ children }) => <em className="markdown-em">{children}</em>,
                        a: ({ href, children }) => (
                            <a href={href} className="markdown-link" target="_blank" rel="noopener noreferrer">
                                {children}
                            </a>
                        ),
                    }}
                >
                    {article.content}
                </ReactMarkdown>
            </div>

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