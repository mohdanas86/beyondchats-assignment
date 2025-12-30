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
            return <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">AI Enhanced</span>;
        }
        return <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">Original</span>;
    };

    // Function to remove images and SVGs from HTML content
    const stripImages = (htmlContent: string) => {
        return htmlContent.replace(/<img[^>]*>/gi, '').replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '');
    };

    return (
        <article className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{article.title}</h2>
                {getVersionBadge(article.version)}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 text-sm text-gray-600">
                <span className="mb-2 sm:mb-0">
                    Published: {formatDate(article.publishedAt)}
                </span>
                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                >
                    Read on BeyondChats →
                </a>
            </div>

            <div className="prose prose-gray max-w-none">
                {article.version === 'original' ? (
                    // Render HTML content for original articles (without images)
                    <div
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: stripImages(article.content) }}
                    />
                ) : (
                    // Render markdown content for enhanced articles
                    <ReactMarkdown
                        components={{
                            h1: ({ children }) => <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">{children}</h3>,
                            h2: ({ children }) => <h3 className="text-lg font-semibold text-gray-900 mt-5 mb-3">{children}</h3>,
                            h3: ({ children }) => <h4 className="text-base font-semibold text-gray-900 mt-4 mb-2">{children}</h4>,
                            h4: ({ children }) => <h5 className="text-sm font-semibold text-gray-900 mt-3 mb-2">{children}</h5>,
                            p: ({ children }) => <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-4 text-gray-700">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-4 text-gray-700">{children}</ol>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">{children}</blockquote>,
                            strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                            em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                            a: ({ href, children }) => (
                                <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
                                    {children}
                                </a>
                            ),
                        }}
                    >
                        {article.content}
                    </ReactMarkdown>
                )}
            </div>

            {article.version === 'updated' && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <small className="text-sm text-gray-500 flex items-center">
                        <span className="mr-2">✨</span>
                        This article has been enhanced with AI for better readability and formatting
                    </small>
                </div>
            )}
        </article>
    );
};

export default ArticleCard;