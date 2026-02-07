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
