const axios = require('axios');
const cheerio = require('cheerio');
const { calculateScore } = require('../ranking/score');

/**
 * Base scraper configuration
 */
const SCRAPER_CONFIG = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    timeout: 10000,
    affiliateTag: 'yourID' // Replace with actual affiliate tag
};

/**
 * Create affiliate URL for Amazon product
 * @param {string} productId - Amazon product ID (ASIN)
 * @returns {string} Affiliate URL
 */
function createAffiliateUrl(productId) {
    return `https://www.amazon.in/dp/${productId}?tag=${SCRAPER_CONFIG.affiliateTag}`;
}

/**
 * Simulate scraping mobile phones
 * In production, this would scrape real Amazon/Flipkart pages
 * For now, it returns mock data
 * @returns {Promise<Array>} Array of mobile phone products
 */
async function scrapeMobiles() {
    console.log('Scraping mobile phones...');
    
    // Mock data - In production, replace with actual scraping logic
    const mockProducts = [
        {
            productId: 'B0BDJC6VX5',
            name: 'Samsung Galaxy S23 5G',
            category: 'mobiles',
            price: 74999,
            rating: 4.5,
            reviewCount: 8234,
            brand: 'Samsung',
            specifications: {
                ram: '8GB',
                storage: '256GB',
                processor: 'Snapdragon 8 Gen 2',
                display: '6.1 inch AMOLED',
                camera: '50MP Triple',
                battery: '3900mAh'
            },
            imageUrl: 'https://example.com/samsung-s23.jpg'
        },
        {
            productId: 'B0BDJ1NRMQ',
            name: 'iPhone 14',
            category: 'mobiles',
            price: 69900,
            rating: 4.6,
            reviewCount: 12543,
            brand: 'Apple',
            specifications: {
                ram: '6GB',
                storage: '128GB',
                processor: 'A15 Bionic',
                display: '6.1 inch Super Retina XDR',
                camera: '12MP Dual',
                battery: '3279mAh'
            },
            imageUrl: 'https://example.com/iphone-14.jpg'
        },
        {
            productId: 'B0C632LDVX',
            name: 'OnePlus 11 5G',
            category: 'mobiles',
            price: 56999,
            rating: 4.4,
            reviewCount: 6721,
            brand: 'OnePlus',
            specifications: {
                ram: '8GB',
                storage: '128GB',
                processor: 'Snapdragon 8 Gen 2',
                display: '6.7 inch AMOLED',
                camera: '50MP Triple',
                battery: '5000mAh'
            },
            imageUrl: 'https://example.com/oneplus-11.jpg'
        },
        {
            productId: 'B0C5TZVFKQ',
            name: 'Google Pixel 7a',
            category: 'mobiles',
            price: 43999,
            rating: 4.3,
            reviewCount: 4532,
            brand: 'Google',
            specifications: {
                ram: '8GB',
                storage: '128GB',
                processor: 'Google Tensor G2',
                display: '6.1 inch OLED',
                camera: '64MP Dual',
                battery: '4385mAh'
            },
            imageUrl: 'https://example.com/pixel-7a.jpg'
        },
        {
            productId: 'B0BZR8NZWK',
            name: 'Xiaomi 13 Pro',
            category: 'mobiles',
            price: 79999,
            rating: 4.5,
            reviewCount: 5234,
            brand: 'Xiaomi',
            specifications: {
                ram: '12GB',
                storage: '256GB',
                processor: 'Snapdragon 8 Gen 2',
                display: '6.73 inch AMOLED',
                camera: '50MP Triple Leica',
                battery: '4820mAh'
            },
            imageUrl: 'https://example.com/xiaomi-13-pro.jpg'
        }
    ];

    // Calculate scores and add affiliate URLs
    return mockProducts.map(product => ({
        ...product,
        score: calculateScore(product.rating, product.reviewCount, product.price),
        affiliateUrl: createAffiliateUrl(product.productId)
    }));
}

module.exports = {
    scrapeMobiles,
    createAffiliateUrl,
    SCRAPER_CONFIG
};
