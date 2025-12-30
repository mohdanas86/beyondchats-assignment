import puppeteer from "puppeteer";
import Article from "../models/articals.js";

// Base URL for BeyondChats website
const BASE_URL = "https://beyondchats.com";

// This function scrapes the 5 oldest blog articles from BeyondChats
// It's a bit tricky because we need to find the last page first, then get the oldest articles
const scrapeOldArticles = async () => {
    let browser;
    try {
        console.log("Starting article scraping...");

        // Launch browser - need this for dynamic content
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Set user agent so they don't block us
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        // Step 1: Load the blogs listing page
        console.log("Step 1: Loading blogs listing page...");
        await page.goto(`${BASE_URL}/blogs`, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Wait for dynamic content to load - important!
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Step 2: Find pagination and go to LAST PAGE to get oldest articles
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

        // Step 3: Extract exactly 5 oldest article URLs from last page(s)
        console.log("Step 3: Extracting 5 oldest article URLs...");
        let articleLinks = [];
        let currentPageUrl = lastPageUrl;
        let articlesNeeded = 5;

        while (articleLinks.length < 5 && currentPageUrl) {
            console.log(`   Extracting from page: ${currentPageUrl}`);

            // Navigate to current page if not already there
            if (page.url() !== currentPageUrl) {
                await page.goto(currentPageUrl, {
                    waitUntil: 'networkidle2',
                    timeout: 30000
                });
                await new Promise(resolve => setTimeout(resolve, 3000));
            }

            // Extract article URLs from current page
            const pageLinks = await page.evaluate((baseUrl, needed) => {
                const links = [];

                // Find article entries and extract their URLs
                const articleEntries = document.querySelectorAll('.entry, .post, article, .blog-post');

                // Filter out entries from sidebar and widget areas
                const validEntries = Array.from(articleEntries).filter(entry =>
                    !entry.closest('.elementor-widget-sidebar, .elementor-element-0082f59, .sidebar, .widget')
                );

                for (let entry of validEntries) {
                    if (links.length >= needed) break;

                    // Extract URL from title link
                    const titleLink = entry.querySelector('h2.entry-title a, h2 a, .entry-title a, .post-title a');
                    if (titleLink) {
                        const href = titleLink.getAttribute('href');
                        if (href && href.includes('/blogs/') &&
                            !href.includes('/tag/') &&
                            !href.includes('/page/') &&
                            !href.includes('#') &&
                            href !== '/blogs/' &&
                            href !== `${baseUrl}/blogs/` &&
                            href.split('/').filter(segment => segment.length > 0).length >= 4) {

                            const fullUrl = href.startsWith('http') ? href : baseUrl + href;
                            if (!links.includes(fullUrl)) {
                                links.push(fullUrl);
                            }
                        }
                    }
                }

                return links;
            }, BASE_URL, articlesNeeded);

            // Add links to our collection (take only what we need)
            const linksToAdd = pageLinks.slice(-articlesNeeded); // Get oldest articles from this page
            articleLinks = [...linksToAdd, ...articleLinks]; // Add to beginning since these are older

            console.log(`   Found ${pageLinks.length} articles on this page, added ${linksToAdd.length} to collection`);

            // Update how many more we need
            articlesNeeded = 5 - articleLinks.length;

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
        articleLinks = articleLinks.slice(0, 5);

        console.log(`Found ${articleLinks.length} oldest article URLs to scrape:`);
        articleLinks.forEach((link, index) => console.log(`  ${index + 1}. ${link}`));

        if (articleLinks.length < 5) {
            console.log(`Only found ${articleLinks.length} article URLs. The website might have fewer articles or structure changed.`);
            console.log("Please check the blogs page manually: https://beyondchats.com/blogs");
            return;
        }

        // Step 4: Visit each article page individually and extract full content
        console.log("Step 4: Scraping individual articles for full content...");
        for (const link of articleLinks) {
            try {
                console.log(`Scraping article: ${link}`);

                // Use puppeteer for individual articles
                const articlePage = await browser.newPage();
                await articlePage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

                await articlePage.goto(link, {
                    waitUntil: 'networkidle2',
                    timeout: 30000
                });

                // Extract structured data from full article page
                const articleData = await articlePage.evaluate(() => {
                    // Extract title
                    const titleSelectors = [
                        'h1',
                        '.article-title',
                        '.post-title',
                        '.blog-title',
                        '.elementor-heading-title.elementor-size-default',
                        'h1.entry-title'
                    ];
                    let title = '';
                    for (let selector of titleSelectors) {
                        const element = document.querySelector(selector);
                        if (element && element.textContent.trim()) {
                            title = element.textContent.trim();
                            break;
                        }
                    }

                    // Extract full content (main article body only) - preserve some HTML structure
                    const contentSelectors = [
                        '.entry-content',  // WordPress standard
                        '.post-content',   // Common post content
                        '.article-content', // Article content
                        '.blog-content',   // Blog content
                        'article .content', // Content within article tags
                        '.entry-card .content', // Content within entry cards
                        '[class*="entry-card"] .content', // Content within entry-card elements
                        // Avoid sidebar and widget areas
                        'article:not(.elementor-widget)',
                        '.post:not(.elementor-widget-sidebar):not(.elementor-element-0082f59)',
                        '.entry:not(.elementor-widget-sidebar):not(.elementor-element-0082f59)'
                    ];
                    let content = '';
                    for (let selector of contentSelectors) {
                        const element = document.querySelector(selector);
                        if (element && element.textContent.trim().length > 100) {
                            // Get HTML content and clean it up
                            let htmlContent = element.innerHTML;

                            // Remove unwanted elements
                            htmlContent = htmlContent.replace(/<script[^>]*>.*?<\/script>/gi, '');
                            htmlContent = htmlContent.replace(/<style[^>]*>.*?<\/style>/gi, '');
                            htmlContent = htmlContent.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');
                            htmlContent = htmlContent.replace(/<form[^>]*>.*?<\/form>/gi, '');

                            // Convert common elements to clean HTML
                            htmlContent = htmlContent.replace(/<h1[^>]*>/gi, '<h2>').replace(/<\/h1>/gi, '</h2>');
                            htmlContent = htmlContent.replace(/<strong>/gi, '<b>').replace(/<\/strong>/gi, '</b>');

                            // If HTML content is good, use it; otherwise fall back to text
                            if (htmlContent.includes('<p>') || htmlContent.includes('<h')) {
                                content = htmlContent;
                            } else {
                                // Fallback to text content with basic formatting
                                content = element.textContent
                                    .trim()
                                    .replace(/\n\s*\n/g, '\n\n') // Preserve paragraph breaks
                                    .replace(/\s+/g, ' '); // Clean extra spaces
                            }
                            break;
                        }
                    }

                    // Extract publishedAt if available
                    let publishedAt = new Date().toISOString(); // Default to current date
                    const dateSelectors = ['time', '.published', '.date', '[datetime]', '.entry-date', '.post-date'];
                    for (let selector of dateSelectors) {
                        const element = document.querySelector(selector);
                        if (element) {
                            const datetime = element.getAttribute('datetime') || element.textContent.trim();
                            if (datetime) {
                                publishedAt = new Date(datetime).toISOString();
                                break;
                            }
                        }
                    }

                    return { title, content, publishedAt };
                });

                await articlePage.close();

                const { title, content, publishedAt } = articleData;

                if (!title || !content) {
                    console.log(`Skipping article due to missing data: ${link}`);
                    console.log(`Title found: "${title}", Content length: ${content.length}`);
                    continue;
                }

                // Step 5: Store in database only if URL does not already exist
                const existingArticle = await Article.findOne({ url: link });
                if (existingArticle) {
                    console.log(`Article already exists: ${title}`);
                    continue;
                }

                // Store with required fields
                await Article.create({
                    title,
                    content,
                    url: link,
                    publishedAt,
                    version: "original",
                    source: "beyondchats"
                });

                console.log(`Successfully scraped and saved: ${title}`);

                // Respectful delay between requests
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                console.error(`Error scraping article ${link}:`, error.message);
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