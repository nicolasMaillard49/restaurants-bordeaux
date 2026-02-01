/**
 * Code Playwright pour scraper Google Maps
 * À utiliser dans un nœud "Code" de n8n
 * 
 * Ce code recherche les restaurants sur Google Maps et extrait les informations
 */

const { chromium } = require('playwright');

async function scrapeGoogleMaps() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    // Aller sur Google Maps
    await page.goto('https://www.google.com/maps', { waitUntil: 'networkidle' });
    
    // Rechercher "meilleurs restaurants Bordeaux"
    const searchBox = await page.waitForSelector('input[name="q"]');
    await searchBox.fill('meilleurs restaurants Bordeaux');
    await searchBox.press('Enter');
    
    // Attendre les résultats
    await page.waitForTimeout(3000);
    
    // Extraire les restaurants
    const restaurants = await page.evaluate(() => {
      const results = [];
      const items = document.querySelectorAll('div[role="article"]');
      
      items.forEach((item, index) => {
        if (index >= 30) return; // Limiter à 30 résultats
        
        try {
          const nameElement = item.querySelector('div.fontHeadlineSmall');
          const ratingElement = item.querySelector('span[role="img"]');
          const addressElement = item.querySelector('div.fontBodyMedium');
          
          const name = nameElement?.textContent?.trim() || '';
          const ratingText = ratingElement?.getAttribute('aria-label') || '';
          const rating = parseFloat(ratingText.match(/[\d.]+/)?.[0] || '0');
          const address = addressElement?.textContent?.trim() || '';
          
          if (name && address) {
            results.push({
              name,
              rating: rating || null,
              address,
              source: 'google_maps'
            });
          }
        } catch (e) {
          console.error('Error extracting restaurant:', e);
        }
      });
      
      return results;
    });
    
    await browser.close();
    return restaurants;
    
  } catch (error) {
    await browser.close();
    throw error;
  }
}

// Pour n8n, utiliser :
// const restaurants = await scrapeGoogleMaps();
// return restaurants.map(r => ({ json: r }));

module.exports = { scrapeGoogleMaps };
