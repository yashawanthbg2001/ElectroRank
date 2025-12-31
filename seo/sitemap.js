const fs = require('fs');
const path = require('path');
const { getAllCategories, getRecentGeneratedPages } = require('../data/database');

/**
 * Generate sitemap.xml
 */
async function generateSitemap() {
    console.log('Generating sitemap...');
    
    const baseUrl = 'https://electrorank.com';
    const currentDate = new Date().toISOString().split('T')[0];
    
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add homepage
    sitemap += `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>\n`;
    
    // Add category pages
    const categories = await getAllCategories();
    for (const category of categories) {
        sitemap += `  <url>
    <loc>${baseUrl}/category/${category}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>\n`;
    }
    
    // Add generated pages
    const recentPages = await getRecentGeneratedPages(100);
    for (const page of recentPages) {
        const pagePath = page.pagePath.replace(/\\/g, '/').replace('.html', '');
        const priority = page.pageType === 'product' ? '0.8' : '0.7';
        const changefreq = page.pageType === 'category' ? 'daily' : 'weekly';
        
        sitemap += `  <url>
    <loc>${baseUrl}/${pagePath}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>\n`;
    }
    
    sitemap += '</urlset>';
    
    const sitemapPath = path.join(__dirname, '../seo/sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    
    console.log('Sitemap generated successfully');
    return sitemapPath;
}

/**
 * Ping Google about sitemap update
 */
async function pingGoogle() {
    const axios = require('axios');
    const sitemapUrl = encodeURIComponent('https://electrorank.com/sitemap.xml');
    const pingUrl = `https://www.google.com/ping?sitemap=${sitemapUrl}`;
    
    try {
        console.log('Pinging Google about sitemap update...');
        await axios.get(pingUrl);
        console.log('Successfully pinged Google');
    } catch (error) {
        console.error('Error pinging Google:', error.message);
    }
}

module.exports = {
    generateSitemap,
    pingGoogle
};
