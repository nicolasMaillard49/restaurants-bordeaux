/**
 * Code Playwright pour extraire description et images d'un site de restaurant
 * À utiliser dans un nœud "Code" de n8n après avoir récupéré l'URL du site
 */

const { chromium } = require('playwright');

async function extractRestaurantInfo(url) {
  if (!url || url === 'null' || !url.startsWith('http')) {
    return {
      description: '',
      images: []
    };
  }
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Extraire la description
    const description = await page.evaluate(() => {
      // Chercher dans les méta tags
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) return metaDesc.getAttribute('content');
      
      // Chercher dans les paragraphes
      const paragraphs = Array.from(document.querySelectorAll('p'));
      const longParagraphs = paragraphs
        .map(p => p.textContent.trim())
        .filter(text => text.length > 100);
      
      if (longParagraphs.length > 0) {
        return longParagraphs.slice(0, 3).join(' ');
      }
      
      return '';
    });
    
    // Extraire les images
    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs
        .map(img => img.src)
        .filter(src => {
          // Filtrer les images pertinentes
          return src &&
                 src.startsWith('http') &&
                 !src.includes('logo') &&
                 !src.includes('icon') &&
                 !src.includes('sprite');
        })
        .slice(0, 5); // Max 5 images
    });
    
    await browser.close();
    
    return {
      description: description || '',
      images: images || []
    };
    
  } catch (error) {
    await browser.close();
    console.error('Error extracting restaurant info:', error);
    return {
      description: '',
      images: []
    };
  }
}

// Pour n8n, utiliser avec l'URL du restaurant :
// const info = await extractRestaurantInfo($json.website);
// return [{ json: { ...input.json, ...info } }];

module.exports = { extractRestaurantInfo };
