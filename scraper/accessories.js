const { calculateScore } = require('../ranking/score');
const { createAffiliateUrl } = require('./mobiles');

/**
 * Simulate scraping accessories
 * @returns {Promise<Array>} Array of accessories products
 */
async function scrapeAccessories() {
    console.log('Scraping accessories...');
    
    const mockProducts = [
        {
            productId: 'B0BJKL3M4N',
            name: 'Anker PowerCore 20000mAh',
            category: 'accessories',
            price: 3999,
            rating: 4.5,
            reviewCount: 23456,
            brand: 'Anker',
            specifications: {
                type: 'Power Bank',
                capacity: '20000mAh',
                ports: '2x USB-A, 1x USB-C',
                fastCharging: 'Yes',
                weight: '356g'
            },
            imageUrl: 'https://example.com/anker-powercore.jpg'
        },
        {
            productId: 'B0C7KL8M9N',
            name: 'Samsung 45W Fast Charger',
            category: 'accessories',
            price: 2499,
            rating: 4.4,
            reviewCount: 18234,
            brand: 'Samsung',
            specifications: {
                type: 'Wall Charger',
                power: '45W',
                ports: '1x USB-C',
                cable: 'Included',
                fastCharging: 'Super Fast Charging 2.0'
            },
            imageUrl: 'https://example.com/samsung-charger.jpg'
        },
        {
            productId: 'B0BHKL9M2N',
            name: 'SanDisk Ultra 128GB microSD',
            category: 'accessories',
            price: 899,
            rating: 4.3,
            reviewCount: 34567,
            brand: 'SanDisk',
            specifications: {
                type: 'Memory Card',
                capacity: '128GB',
                speed: 'Up to 120MB/s',
                class: 'Class 10, U1, A1',
                compatibility: 'Android devices'
            },
            imageUrl: 'https://example.com/sandisk-ultra.jpg'
        },
        {
            productId: 'B0C8KLMN3P',
            name: 'Belkin BoostCharge 3-in-1 Wireless Charger',
            category: 'accessories',
            price: 12999,
            rating: 4.5,
            reviewCount: 6234,
            brand: 'Belkin',
            specifications: {
                type: 'Wireless Charger',
                devices: 'Phone, Watch, Earbuds',
                power: '15W',
                compatibility: 'Qi-enabled devices',
                led: 'Yes'
            },
            imageUrl: 'https://example.com/belkin-3in1.jpg'
        },
        {
            productId: 'B0BJKLM4N5',
            name: 'Apple USB-C to Lightning Cable',
            category: 'accessories',
            price: 1900,
            rating: 4.6,
            reviewCount: 45678,
            brand: 'Apple',
            specifications: {
                type: 'Cable',
                length: '1m',
                connectors: 'USB-C to Lightning',
                fastCharging: 'Yes',
                mfi: 'Certified'
            },
            imageUrl: 'https://example.com/apple-cable.jpg'
        }
    ];

    return mockProducts.map(product => ({
        ...product,
        score: calculateScore(product.rating, product.reviewCount, product.price),
        affiliateUrl: createAffiliateUrl(product.productId)
    }));
}

module.exports = {
    scrapeAccessories
};
