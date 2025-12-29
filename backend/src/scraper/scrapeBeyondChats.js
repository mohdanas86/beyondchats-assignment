import puppeteer from "puppeteer";
import Article from "../models/articals.js";

/**
 * Base URL for BeyondChats website
 */
const BASE_URL = "https://beyondchats.com";

/**
 * Scrapes articles from BeyondChats website
 * Fetches the blogs page, extracts article links, and scrapes individual articles
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

        // Go to blogs page instead of homepage
        console.log("Navigating to blogs page...");
        await page.goto(`${BASE_URL}/blogs`, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Wait a bit for dynamic content to load
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Extract article links - try multiple selectors
        const articleLinks = await page.evaluate(() => {
            const links = [];

            // Based on debug analysis, look for article links in the blogs section
            const linkElements = document.querySelectorAll('a[href*="/blogs/"]');

            for (let el of linkElements) {
                const href = el.getAttribute('href');

                // Filter for actual blog post URLs (not tags, not homepage)
                if (href &&
                    href.includes('/blogs/') &&
                    !href.includes('/tag/') &&
                    !href.includes('#') &&
                    href !== 'https://beyondchats.com/blogs/' &&
                    href.split('/').length >= 5 && // Ensure it's a specific post URL
                    links.length < 5) {

                    // Convert relative URLs to absolute
                    const fullUrl = href.startsWith('http') ? href : `https://beyondchats.com${href}`;
                    if (!links.includes(fullUrl)) {
                        links.push(fullUrl);
                    }
                }
            }

            return links;
        });

        console.log(`Found ${articleLinks.length} articles to scrape`);

        if (articleLinks.length === 0) {
            console.log("No articles found. The website structure might have changed.");
            console.log("Please check the blogs page manually: https://beyondchats.com/blogs");
            console.log("Inspect the page and look for the actual selectors used for blog links.");
            return;
        }

        // Scrape each article
        for (const link of articleLinks) {
            try {
                console.log(`Scraping article: ${link}`);

                // Use puppeteer for individual articles too
                const articlePage = await browser.newPage();
                await articlePage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

                await articlePage.goto(link, {
                    waitUntil: 'networkidle2',
                    timeout: 30000
                });

                // Extract article data
                const articleData = await articlePage.evaluate(() => {
                    // Try to find title
                    const titleSelectors = ['h1', '.article-title', '.post-title', '.blog-title'];
                    let title = '';
                    for (let selector of titleSelectors) {
                        const element = document.querySelector(selector);
                        if (element && element.textContent.trim()) {
                            title = element.textContent.trim();
                            break;
                        }
                    }

                    // If no title found, try document title
                    if (!title) {
                        title = document.title.replace(' - BeyondChats', '').trim();
                    }

                    // Try to find content
                    const contentSelectors = [
                        '.blog-content',
                        '.article-content',
                        '.post-content',
                        '.entry-content',
                        'article',
                        '.content',
                        '[class*="content"]'
                    ];
                    let content = '';
                    for (let selector of contentSelectors) {
                        const element = document.querySelector(selector);
                        if (element && element.textContent.trim().length > 100) {
                            content = element.innerHTML;
                            break;
                        }
                    }

                    return { title, content };
                });

                await articlePage.close();

                const { title, content } = articleData;

                if (!title || !content) {
                    console.log(`Skipping article due to missing data: ${link}`);
                    console.log(`Title found: "${title}", Content length: ${content.length}`);
                    continue;
                }

                // Check if article already exists
                const existingArticle = await Article.findOne({ url: link });
                if (existingArticle) {
                    console.log(`Article already exists: ${title}`);
                    continue;
                }

                // Save to database
                await Article.create({
                    title,
                    content,
                    url: link,
                    publishedAt: new Date().toISOString()
                });

                console.log(`Successfully scraped and saved: ${title}`);

                // Add delay to be respectful to the server
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