import puppeteer from "puppeteer";
import Article from "../models/articals.js";

/**
 * Base URL for BeyondChats website
 */
const BASE_URL = "https://beyondchats.com";

/**
 * Scrapes the 5 oldest blog articles from BeyondChats
 * Follows strict scraping flow: load blogs page -> find last page -> extract 5 oldest URLs -> scrape each article
 * @returns {Promise<void>}
 */
const scrapeOldArticles = async () => {
    let browser;
    try {
        console.log("Starting article scraping...");

        // Launch browser for dynamic content loading
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Set user agent to avoid blocking
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        // Step 1: Load the blogs listing page
        console.log("Step 1: Loading blogs listing page...");
        await page.goto(`${BASE_URL}/blogs`, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Wait for dynamic content to load
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Step 2: Identify pagination mechanism and navigate to LAST PAGE
        console.log("Step 2: Finding pagination and navigating to last page...");

        // Check for pagination and get the last page URL
        const lastPageUrl = await page.evaluate((baseUrl) => {
            // Look for pagination elements - try multiple selectors
            const paginationSelectors = [
                'a[href*="/blogs/page/"]',
                '.pagination a',
                '.page-numbers a',
                '.wp-pagenavi a',
                'nav a[href*="/page/"]',
                '.pagination-links a'
            ];

            let allLinks = [];
            for (let selector of paginationSelectors) {
                const links = document.querySelectorAll(selector);
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.includes('/blogs/page/')) {
                        allLinks.push({
                            href: href.startsWith('http') ? href : baseUrl + href,
                            text: link.textContent.trim()
                        });
                    }
                });
            }

            // Remove duplicates
            const uniqueLinks = allLinks.filter((link, index, self) =>
                index === self.findIndex(l => l.href === link.href)
            );

            // Sort by page number
            const pageLinks = uniqueLinks
                .map(link => {
                    const match = link.href.match(/\/page\/(\d+)/);
                    return match ? { ...link, pageNum: parseInt(match[1]) } : null;
                })
                .filter(link => link !== null)
                .sort((a, b) => b.pageNum - a.pageNum); // Sort descending (highest page first)

            console.log('Found pagination links:', pageLinks.map(l => `Page ${l.pageNum}: ${l.href}`).join(', '));

            if (pageLinks.length > 0) {
                // Get the highest page number (last page)
                const lastPage = pageLinks[0];
                console.log(`Last page detected: ${lastPage.pageNum} - ${lastPage.href}`);
                return lastPage.href;
            }

            // If no pagination found, stay on current page
            return window.location.href;
        }, BASE_URL);

        console.log(`Detected last page URL: ${lastPageUrl}`);

        // Navigate to last page if different from current
        if (lastPageUrl !== page.url()) {
            console.log(`Navigating to last page: ${lastPageUrl}`);
            await page.goto(lastPageUrl, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });
            await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
            console.log("No pagination found, using current page (oldest articles)");
        }

        // Step 3: Extract exactly 5 oldest articles data from last page(s)
        console.log("Step 3: Extracting 5 oldest articles data...");
        let articlesData = [];
        let currentPageUrl = lastPageUrl;
        let articlesNeeded = 5;

        while (articlesData.length < 5 && currentPageUrl) {
            console.log(`   Extracting from page: ${currentPageUrl}`);

            // Navigate to current page if not already there
            if (page.url() !== currentPageUrl) {
                await page.goto(currentPageUrl, {
                    waitUntil: 'networkidle2',
                    timeout: 30000
                });
                await new Promise(resolve => setTimeout(resolve, 3000));
            }

            // Extract article data directly from listing page
            const pageArticles = await page.evaluate((baseUrl, needed) => {
                const articles = [];

                // Find article entries on the page, excluding sidebar widgets
                const articleEntries = document.querySelectorAll('.entry, .post, article, .blog-post');

                // Filter out entries from sidebar and widget areas
                const validEntries = Array.from(articleEntries).filter(entry =>
                    !entry.closest('.elementor-widget-sidebar, .elementor-element-0082f59, .sidebar, .widget')
                );

                for (let entry of validEntries) {
                    if (articles.length >= needed) break;

                    // Extract title from h2.entry-title a or similar
                    const titleLink = entry.querySelector('h2.entry-title a, h2 a, .entry-title a, .post-title a');
                    if (!titleLink) continue;

                    const title = titleLink.textContent.trim();
                    const url = titleLink.getAttribute('href');
                    if (!url || !url.includes('/blogs/')) continue;

                    const fullUrl = url.startsWith('http') ? url : baseUrl + url;

                    // Extract content from excerpt or entry content on listing page
                    let content = '';
                    const contentSelectors = [
                        '.entry-summary',
                        '.post-excerpt',
                        '.excerpt',
                        '.entry-content p', // First paragraph of content
                        '.post-content p',
                        'p' // First paragraph in entry
                    ];

                    for (let selector of contentSelectors) {
                        const contentElement = entry.querySelector(selector);
                        if (contentElement && contentElement.textContent.trim().length > 50) {
                            content = contentElement.textContent.trim();
                            // Clean up whitespace
                            content = content.replace(/\s+/g, ' ').replace(/\n+/g, '\n').trim();
                            break;
                        }
                    }

                    // Extract published date if available
                    let publishedAt = new Date().toISOString();
                    const dateSelectors = ['time', '.published', '.date', '.entry-date', '.post-date'];
                    for (let selector of dateSelectors) {
                        const dateElement = entry.querySelector(selector);
                        if (dateElement) {
                            const datetime = dateElement.getAttribute('datetime') || dateElement.textContent.trim();
                            if (datetime) {
                                publishedAt = new Date(datetime).toISOString();
                                break;
                            }
                        }
                    }

                    if (title && content && fullUrl) {
                        articles.push({ title, content, url: fullUrl, publishedAt });
                    }
                }

                return articles;
            }, BASE_URL, articlesNeeded);

            // Add articles to our collection (take only what we need)
            const articlesToAdd = pageArticles.slice(-articlesNeeded); // Get oldest articles from this page
            articlesData = [...articlesToAdd, ...articlesData]; // Add to beginning since these are older

            console.log(`   Found ${pageArticles.length} articles on this page, added ${articlesToAdd.length} to collection`);

            // Update how many more we need
            articlesNeeded = 5 - articlesData.length;

            // If we still need more articles, go to previous page
            if (articlesNeeded > 0) {
                // Extract previous page URL from current page
                const prevPageUrl = await page.evaluate((baseUrl) => {
                    // Look for pagination elements
                    const paginationLinks = document.querySelectorAll('a[href*="/blogs/page/"], .pagination a, .page-numbers a');

                    if (paginationLinks.length > 0) {
                        // Find the previous page link (usually the one before current)
                        const currentUrl = window.location.href;
                        const currentPageMatch = currentUrl.match(/\/page\/(\d+)/);
                        if (currentPageMatch) {
                            const currentPageNum = parseInt(currentPageMatch[1]);
                            const prevPageNum = currentPageNum - 1;

                            // Look for link to previous page
                            for (let link of paginationLinks) {
                                const href = link.getAttribute('href');
                                if (href && href.includes(`/page/${prevPageNum}`)) {
                                    return href.startsWith('http') ? href : baseUrl + href;
                                }
                            }
                        }
                    }

                    return null; // No previous page found
                }, BASE_URL);

                currentPageUrl = prevPageUrl;
                console.log(`   Still need ${articlesNeeded} more articles, going to previous page: ${currentPageUrl}`);
            }
        }

        // Ensure we have exactly 5 articles (take the oldest 5)
        articlesData = articlesData.slice(0, 5);

        console.log(`Found ${articlesData.length} oldest articles to save:`);
        articlesData.forEach((article, index) => console.log(`  ${index + 1}. ${article.title} (${article.url})`));

        if (articlesData.length < 5) {
            console.log(`Only found ${articlesData.length} articles. The website might have fewer articles or structure changed.`);
            console.log("Please check the blogs page manually: https://beyondchats.com/blogs");
            return;
        }

        // Step 4: Save articles to database
        console.log("Step 4: Saving articles to database...");
        for (const articleData of articlesData) {
            try {
                const { title, content, url, publishedAt } = articleData;

                if (!title || !content) {
                    console.log(`Skipping article due to missing data: ${url}`);
                    console.log(`Title found: "${title}", Content length: ${content.length}`);
                    continue;
                }

                // Check if URL does not already exist
                const existingArticle = await Article.findOne({ url });
                if (existingArticle) {
                    console.log(`Article already exists: ${title}`);
                    continue;
                }

                // Store with required fields
                await Article.create({
                    title,
                    content,
                    url,
                    publishedAt,
                    version: "original",
                    source: "beyondchats"
                });

                console.log(`Successfully scraped and saved: ${title}`);

                // Respectful delay between saves
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                console.error(`Error saving article ${articleData.url}:`, error.message);
                continue;
            }
        }

        console.log("Article scraping completed successfully");

    } catch (error) {
        console.error("Error in scraping process:", error.message);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

export default scrapeOldArticles;