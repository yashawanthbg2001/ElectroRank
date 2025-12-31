const { calculateScore } = require('../ranking/score');
const { createAffiliateUrl } = require('./mobiles');

/**
 * Simulate scraping earbuds
 * @returns {Promise<Array>} Array of earbuds products
 */
async function scrapeEarbuds() {
    console.log('Scraping earbuds...');
    
    const mockProducts = [
        {
            productId: 'B0BSDKL9QY',
            name: 'Apple AirPods Pro 2nd Gen',
            category: 'earbuds',
            price: 26900,
            rating: 4.6,
            reviewCount: 9234,
            brand: 'Apple',
            specifications: {
                type: 'In-Ear',
                wireless: 'Yes',
                noiseCancellation: 'Active',
                battery: '30 hours with case',
                bluetooth: '5.3',
                waterResistance: 'IPX4'
            },
            imageUrl: 'https://example.com/airpods-pro-2.jpg'
        },
        {
            productId: 'B0C4ZKY5ND',
            name: 'Sony WF-1000XM5',
            category: 'earbuds',
            price: 24990,
            rating: 4.5,
            reviewCount: 6543,
            brand: 'Sony',
            specifications: {
                type: 'In-Ear',
                wireless: 'Yes',
                noiseCancellation: 'Active',
                battery: '24 hours with case',
                bluetooth: '5.3',
                waterResistance: 'IPX4'
            },
            imageUrl: 'https://example.com/sony-wf1000xm5.jpg'
        },
        {
            productId: 'B0BHZX2N8L',
            name: 'Samsung Galaxy Buds2 Pro',
            category: 'earbuds',
            price: 17990,
            rating: 4.4,
            reviewCount: 5432,
            brand: 'Samsung',
            specifications: {
                type: 'In-Ear',
                wireless: 'Yes',
                noiseCancellation: 'Active',
                battery: '29 hours with case',
                bluetooth: '5.3',
                waterResistance: 'IPX7'
            },
            imageUrl: 'https://example.com/galaxy-buds2-pro.jpg'
        },
        {
            productId: 'B0C9P1YZNS',
            name: 'OnePlus Buds Pro 2',
            category: 'earbuds',
            price: 11999,
            rating: 4.3,
            reviewCount: 8234,
            brand: 'OnePlus',
            specifications: {
                type: 'In-Ear',
                wireless: 'Yes',
                noiseCancellation: 'Active',
                battery: '39 hours with case',
                bluetooth: '5.3',
                waterResistance: 'IP55'
            },
            imageUrl: 'https://example.com/oneplus-buds-pro2.jpg'
        },
        {
            productId: 'B0B9LQQNPY',
            name: 'Nothing Ear (2)',
            category: 'earbuds',
            price: 8999,
            rating: 4.2,
            reviewCount: 12543,
            brand: 'Nothing',
            specifications: {
                type: 'In-Ear',
                wireless: 'Yes',
                noiseCancellation: 'Active',
                battery: '36 hours with case',
                bluetooth: '5.3',
                waterResistance: 'IP54'
            },
            imageUrl: 'https://example.com/nothing-ear-2.jpg'
        }
    ];

    return mockProducts.map(product => ({
        ...product,
        score: calculateScore(product.rating, product.reviewCount, product.price),
        affiliateUrl: createAffiliateUrl(product.productId)
    }));
}

module.exports = {
    scrapeEarbuds
};
