const { calculateScore } = require('../ranking/score');
const { createAffiliateUrl } = require('./mobiles');

/**
 * Simulate scraping laptops
 * @returns {Promise<Array>} Array of laptop products
 */
async function scrapeLaptops() {
    console.log('Scraping laptops...');
    
    const mockProducts = [
        {
            productId: 'B0B7XB8KNL',
            name: 'Apple MacBook Air M2',
            category: 'laptops',
            price: 114900,
            rating: 4.7,
            reviewCount: 3421,
            brand: 'Apple',
            specifications: {
                processor: 'Apple M2',
                ram: '8GB',
                storage: '256GB SSD',
                display: '13.6 inch Liquid Retina',
                graphics: 'Integrated',
                os: 'macOS'
            },
            imageUrl: 'https://example.com/macbook-air-m2.jpg'
        },
        {
            productId: 'B0BSHF69LN',
            name: 'Dell XPS 13',
            category: 'laptops',
            price: 124990,
            rating: 4.5,
            reviewCount: 2134,
            brand: 'Dell',
            specifications: {
                processor: 'Intel Core i7-1360P',
                ram: '16GB',
                storage: '512GB SSD',
                display: '13.4 inch FHD+',
                graphics: 'Intel Iris Xe',
                os: 'Windows 11'
            },
            imageUrl: 'https://example.com/dell-xps-13.jpg'
        },
        {
            productId: 'B0BKQYB8L8',
            name: 'HP Pavilion 15',
            category: 'laptops',
            price: 52990,
            rating: 4.2,
            reviewCount: 8932,
            brand: 'HP',
            specifications: {
                processor: 'Intel Core i5-1235U',
                ram: '8GB',
                storage: '512GB SSD',
                display: '15.6 inch FHD',
                graphics: 'Intel UHD',
                os: 'Windows 11'
            },
            imageUrl: 'https://example.com/hp-pavilion-15.jpg'
        },
        {
            productId: 'B0BW5LQKRN',
            name: 'Lenovo ThinkPad E14',
            category: 'laptops',
            price: 65990,
            rating: 4.4,
            reviewCount: 5621,
            brand: 'Lenovo',
            specifications: {
                processor: 'AMD Ryzen 5 5500U',
                ram: '16GB',
                storage: '512GB SSD',
                display: '14 inch FHD',
                graphics: 'AMD Radeon',
                os: 'Windows 11'
            },
            imageUrl: 'https://example.com/lenovo-thinkpad-e14.jpg'
        },
        {
            productId: 'B0C4P4M2NX',
            name: 'ASUS TUF Gaming A15',
            category: 'laptops',
            price: 74990,
            rating: 4.3,
            reviewCount: 7234,
            brand: 'ASUS',
            specifications: {
                processor: 'AMD Ryzen 7 5800H',
                ram: '16GB',
                storage: '512GB SSD',
                display: '15.6 inch FHD 144Hz',
                graphics: 'NVIDIA RTX 3050',
                os: 'Windows 11'
            },
            imageUrl: 'https://example.com/asus-tuf-a15.jpg'
        }
    ];

    return mockProducts.map(product => ({
        ...product,
        score: calculateScore(product.rating, product.reviewCount, product.price),
        affiliateUrl: createAffiliateUrl(product.productId)
    }));
}

module.exports = {
    scrapeLaptops
};
