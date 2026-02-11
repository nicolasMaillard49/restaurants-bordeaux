const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

// Browser persistant pour eviter de relancer Chromium a chaque requete
let browser = null;

async function getBrowser() {
    if (!browser || !browser.isConnected()) {
        browser = await chromium.launch({
            headless: true,
        });
    }
    return browser;
}

app.post('/scrape-photos', async (req, res) => {
    const { website } = req.body;

    if (!website || website === null) {
        return res.json({
            photos: [],
            source: 'no_website'
        });
    }

    // Skip scraping if website URL contains 'instagram'
    if (website.toLowerCase().includes('instagram')) {
        return res.json({
            photos: [],
            source: 'instagram_skipped'
        });
    }

    let page = null;
    try {
        const b = await getBrowser();
        page = await b.newPage();

        await page.goto(website, {
            timeout: 30000,
            waitUntil: 'domcontentloaded'
        });
        await page.waitForTimeout(2000);

        const photos = await page.evaluate(() => {
            const images = [];
            const baseUrl = window.location.origin;

            // Convertit une URL relative en absolue
            function toAbsolute(url) {
                if (!url) return null;
                url = url.trim();
                if (url.startsWith('http')) return url;
                if (url.startsWith('//')) return 'https:' + url;
                if (url.startsWith('/')) return baseUrl + url;
                // URL relative (ex: "img/photo.jpg")
                const pagePath = window.location.pathname;
                const dir = pagePath.substring(0, pagePath.lastIndexOf('/') + 1);
                return baseUrl + dir + url;
            }

            // Filtre les URLs non pertinentes
            function isValidPhoto(url) {
                if (!url) return false;
                const lower = url.toLowerCase();
                const excluded = ['logo', 'icon', 'favicon', 'arrow', 'sprite', 'pixel', 'tracking', 'analytics', 'badge', '.svg', '1x1', 'spacer'];
                if (excluded.some(ex => lower.includes(ex))) return false;
                const validExt = ['.jpg', '.jpeg', '.png', '.webp'];
                if (!validExt.some(ext => lower.includes(ext))) return false;
                return true;
            }

            // 1. Images classiques (src, data-src, data-original)
            const imgSelectors = [
                'img[src*="jpg"]', 'img[src*="jpeg"]', 'img[src*="png"]', 'img[src*="webp"]',
                'img[data-src]', 'img[data-original]', 'img[data-lazy-src]'
            ];
            imgSelectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    const src = toAbsolute(el.src || el.dataset.src || el.dataset.original || el.dataset.lazySrc);
                    if (isValidPhoto(src)) images.push(src);
                });
            });

            // 2. Background images en CSS
            document.querySelectorAll('div[style*="background-image"], section[style*="background-image"]').forEach(el => {
                const match = el.style.backgroundImage.match(/url\(["']?([^"'\)]+)["']?\)/);
                if (match) {
                    const src = toAbsolute(match[1]);
                    if (isValidPhoto(src)) images.push(src);
                }
            });

            // 3. Liens <a> pointant vers des images (ex: lightbox Flickr)
            document.querySelectorAll('a[href*=".jpg"], a[href*=".jpeg"], a[href*=".png"], a[href*=".webp"]').forEach(el => {
                const src = toAbsolute(el.href);
                if (isValidPhoto(src)) images.push(src);
            });

            // 4. Meta og:image en fallback
            if (images.length === 0) {
                const ogImage = document.querySelector('meta[property="og:image"]');
                if (ogImage) {
                    const src = toAbsolute(ogImage.getAttribute('content'));
                    if (src) images.push(src);
                }
                const twitterImage = document.querySelector('meta[name="twitter:image:src"], meta[name="twitter:image"]');
                if (twitterImage) {
                    const src = toAbsolute(twitterImage.getAttribute('content'));
                    if (src) images.push(src);
                }
            }

            return [...new Set(images)].slice(0, 5);
        });

        await page.close();

        res.json({
            photos: photos,
            source: 'playwright'
        });
    } catch (error) {
        console.error(`Playwright error for ${website}: ${error.message}`);
        if (page) {
            await page.close().catch(() => {});
        }
        res.json({
            photos: [],
            source: 'playwright_error',
            error: error.message
        });
    }
});

app.post('/scrape-reservation', async (req, res) => {
    const { website } = req.body;

    if (!website) {
        return res.json({ reservation_url: null });
    }

    const KEYWORDS = ['reserv', 'réserv', 'reserver', 'book', 'booking', 'table', 'resa'];

    const matchesKeyword = (url) => {
        const lower = (url || '').toLowerCase();
        return KEYWORDS.some(kw => lower.includes(kw));
    };

    let page = null;
    try {
        // 1. Try sitemap.xml first (fast, no browser needed)
        const sitemapUrl = new URL('/sitemap.xml', website).href;
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);
            const resp = await fetch(sitemapUrl, { signal: controller.signal });
            clearTimeout(timeout);
            if (resp.ok) {
                const xml = await resp.text();
                const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/gi)].map(m => m[1]);
                const match = urls.find(matchesKeyword);
                if (match) {
                    return res.json({ reservation_url: match });
                }
            }
        } catch (_) {
            // Sitemap not available, continue to page scan
        }

        // 2. Scan homepage links
        const b = await getBrowser();
        page = await b.newPage();

        await page.goto(website, {
            timeout: 10000,
            waitUntil: 'domcontentloaded'
        });
        await page.waitForTimeout(1500);

        const reservationUrl = await page.evaluate((keywords) => {
            const links = Array.from(document.querySelectorAll('a[href]'));
            for (const link of links) {
                const href = link.href || '';
                const text = (link.textContent || '').toLowerCase();
                const lower = href.toLowerCase();
                const matches = keywords.some(kw => lower.includes(kw) || text.includes(kw));
                if (matches && href.startsWith('http')) {
                    return href;
                }
            }
            return null;
        }, KEYWORDS);

        await page.close();

        res.json({ reservation_url: reservationUrl });
    } catch (error) {
        console.error(`Reservation scrape error for ${website}: ${error.message}`);
        if (page) {
            await page.close().catch(() => {});
        }
        res.json({ reservation_url: null });
    }
});

// Scrape articles from bougerabordeaux.com
app.post('/scrape-articles-bordeaux', async (req, res) => {
    const { limit = 10 } = req.body;

    let page = null;
    try {
        const b = await getBrowser();
        page = await b.newPage();

        await page.goto('https://www.bougerabordeaux.com/bordeaux/food/restaurants/', {
            timeout: 30000,
            waitUntil: 'domcontentloaded'
        });
        await page.waitForTimeout(2000);

        const rawArticles = await page.evaluate((maxArticles) => {
            const articles = [];
            // WordPress structure: look for article links with images
            const allLinks = Array.from(document.querySelectorAll('a[href*="/food/"], a[href*="/actu/"]'));
            const seen = new Set();
            const titleLinks = [];

            // Find links that contain article titles (not "Lire la suite", not images-only)
            for (const link of allLinks) {
                const href = link.href;
                if (!href || seen.has(href)) continue;
                // Skip non-article URLs
                if (href.includes('/category/') || href.includes('/tag/') || href.includes('/page/')) continue;
                // Must be a real article URL (has a slug after the category)
                const pathParts = new URL(href).pathname.split('/').filter(Boolean);
                if (pathParts.length < 3) continue;
                // Skip category/navigation pages (short slugs without hyphens = not real articles)
                const slug = pathParts[pathParts.length - 1];
                if (!slug.includes('-')) continue;

                const text = (link.textContent || '').trim();
                // Skip very short texts (icons, "Lire la suite", etc.)
                if (text.length < 15 || text.includes('Lire la suite')) continue;

                seen.add(href);
                titleLinks.push({ href, title: text, element: link });
            }

            for (const { href, title, element } of titleLinks.slice(0, maxArticles)) {
                // Try to find associated image nearby
                let image = null;
                // Look for sibling or parent container with an image linking to the same URL
                const parent = element.closest('div') || element.parentElement;
                if (parent) {
                    const parentContainer = parent.parentElement;
                    if (parentContainer) {
                        const img = parentContainer.querySelector('img');
                        if (img) {
                            image = img.src || img.dataset.src || img.dataset.lazySrc || null;
                        }
                    }
                }

                // Look for excerpt text nearby
                let excerpt = '';
                if (parent) {
                    const parentContainer = parent.parentElement;
                    if (parentContainer) {
                        const paragraphs = parentContainer.querySelectorAll('p');
                        for (const p of paragraphs) {
                            const pText = p.textContent.trim();
                            if (pText.length > 30 && !pText.includes('Lire la suite')) {
                                excerpt = pText;
                                break;
                            }
                        }
                    }
                }

                // Look for date text nearby
                let dateText = '';
                if (parent) {
                    const parentContainer = parent.parentElement;
                    if (parentContainer) {
                        const spans = parentContainer.querySelectorAll('span, time, .date, .entry-date');
                        for (const span of spans) {
                            const sText = span.textContent.trim();
                            if (sText.match(/il y a|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|\d{1,2}\/\d{1,2}/i)) {
                                dateText = sText;
                                break;
                            }
                        }
                    }
                }

                articles.push({
                    title,
                    url: href,
                    excerpt,
                    dateText,
                    image
                });
            }

            return articles;
        }, Math.min(limit, 20));

        await page.close();

        // Post-processing
        const now = new Date();
        const articles = rawArticles.map(article => {
            // Generate ID from URL slug
            const urlParts = new URL(article.url).pathname.split('/').filter(Boolean);
            const slug = urlParts[urlParts.length - 1] || '';
            const id = slug;

            // Parse relative date
            let publishedDate = null;
            if (article.dateText) {
                const relMatch = article.dateText.match(/il y a (\d+)\s*(jour|jours|semaine|semaines|mois|heure|heures|minute|minutes)/i);
                if (relMatch) {
                    const amount = parseInt(relMatch[1]);
                    const unit = relMatch[2].toLowerCase();
                    const date = new Date(now);
                    if (unit.startsWith('jour')) date.setDate(date.getDate() - amount);
                    else if (unit.startsWith('semaine')) date.setDate(date.getDate() - amount * 7);
                    else if (unit.startsWith('mois')) date.setMonth(date.getMonth() - amount);
                    else if (unit.startsWith('heure')) date.setHours(date.getHours() - amount);
                    else if (unit.startsWith('minute')) date.setMinutes(date.getMinutes() - amount);
                    publishedDate = date.toISOString();
                } else {
                    // Try absolute date parsing (e.g. "5 janvier 2026")
                    const months = { janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5, juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11 };
                    const absMatch = article.dateText.match(/(\d{1,2})\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})/i);
                    if (absMatch) {
                        publishedDate = new Date(parseInt(absMatch[3]), months[absMatch[2].toLowerCase()], parseInt(absMatch[1])).toISOString();
                    }
                }
            }

            // Categorize based on title keywords
            const titleLower = article.title.toLowerCase();
            let category = 'actualité';
            if (/ouvre|ouverture|débarque|nouveau|nouvelle|s'installe|lance|arrive/.test(titleLower)) category = 'ouverture';
            else if (/ferme|fermeture|fermé/.test(titleLower)) category = 'fermeture';
            else if (/top|meilleur|classement|brille|palmarès/.test(titleLower)) category = 'classement';

            // Extract restaurant names from title
            const restaurantNames = [];
            // Pattern: "Nom :" or "Nom ," at start or after specific words
            const colonMatch = article.title.match(/^([A-ZÀ-Ü][a-zà-ü''\-]+(?:\s+[A-ZÀ-Ü][a-zà-ü''\-]+)*)\s*:/);
            if (colonMatch) restaurantNames.push(colonMatch[1]);
            // Pattern: known formats like "chez X", "Le/La X"
            const namedMatch = article.title.match(/(?:avec|chez|de)\s+((?:Le |La |L'|Les )?[A-ZÀ-Ü][a-zà-ü''\-]+(?:\s+[A-ZÀ-Ü][a-zà-ü''\-]+)*)/g);
            if (namedMatch) {
                namedMatch.forEach(m => {
                    const name = m.replace(/^(?:avec|chez|de)\s+/i, '').trim();
                    if (name.length > 2 && !restaurantNames.includes(name)) restaurantNames.push(name);
                });
            }

            return {
                id,
                title: article.title,
                url: article.url,
                excerpt: article.excerpt || null,
                image: article.image ? article.image.replace(/-\d+x\d+(\.\w+)$/, '$1') : null,
                publishedDate,
                category,
                restaurantNames: restaurantNames.slice(0, 3),
                scrapedAt: now.toISOString()
            };
        });

        res.json({
            totalArticles: articles.length,
            processedAt: now.toISOString(),
            source: 'bougerabordeaux.com',
            articles
        });
    } catch (error) {
        console.error(`Articles scrape error: ${error.message}`);
        if (page) {
            await page.close().catch(() => {});
        }
        res.json({
            totalArticles: 0,
            processedAt: new Date().toISOString(),
            source: 'bougerabordeaux.com',
            articles: [],
            error: error.message
        });
    }
});

// Scrape page HTML content for text extraction
app.post('/scrape-content', async (req, res) => {
    const { website } = req.body;

    if (!website) {
        return res.json({ html: '', source: 'no_website' });
    }

    if (website.toLowerCase().includes('instagram')) {
        return res.json({ html: '', source: 'instagram_skipped' });
    }

    let page = null;
    try {
        const b = await getBrowser();
        page = await b.newPage();

        await page.goto(website, {
            timeout: 15000,
            waitUntil: 'domcontentloaded'
        });
        await page.waitForTimeout(1500);

        const html = await page.content();
        await page.close();

        res.json({ html, source: 'playwright' });
    } catch (error) {
        console.error(`Content scrape error for ${website}: ${error.message}`);
        if (page) {
            await page.close().catch(() => {});
        }
        res.json({ html: '', source: 'playwright_error', error: error.message });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`🎭 Playwright service running on port ${PORT}`);
});

// Fermeture propre du browser a l'arret
process.on('SIGTERM', async () => {
    if (browser) await browser.close();
    process.exit(0);
});
process.on('SIGINT', async () => {
    if (browser) await browser.close();
    process.exit(0);
});
