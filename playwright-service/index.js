const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

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

    try {
        // Utilisation avec variables d'environnement
        const browser = await chromium.launch({
            headless: true,
        });
        const page = await browser.newPage();

        await page.goto(website, {
            timeout: 15000,
            waitUntil: 'domcontentloaded'
        });
        await page.waitForTimeout(2000);

        const photos = await page.evaluate(() => {
            const images = [];
            const selectors = [
                'img[src*="jpg"]', 'img[src*="jpeg"]', 'img[src*="png"]', 'img[src*="webp"]',
                'img[data-src]', 'div[style*="background-image"]'
            ];

            selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    let src = el.src || el.dataset.src;
                    if (!src && el.style.backgroundImage) {
                        const match = el.style.backgroundImage.match(/url\(["']?([^"'\)]+)["']?\)/);
                        if (match) src = match[1];
                    }
                    if (src && src.startsWith('http') && !src.includes('logo') && !src.includes('icon')) {
                        images.push(src);
                    }
                });
            });

            return [...new Set(images)].slice(0, 3);
        });

        await browser.close();

        res.json({
            photos: photos,
            source: 'playwright'
        });
    } catch (error) {
        console.error('Playwright error:', error.message);
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
