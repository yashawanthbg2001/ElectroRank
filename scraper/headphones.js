const { calculateScore } = require('../ranking/score');
const { createAffiliateUrl } = require('./mobiles');

/**
 * Simulate scraping headphones
 * @returns {Promise<Array>} Array of headphones products
 */
async function scrapeHeadphones() {
    console.log('Scraping headphones...');
    
    const mockProducts = [
        {
            productId: 'B0BXMQJN7R',
            name: 'Sony WH-1000XM5',
            category: 'headphones',
            price: 29990,
            rating: 4.6,
            reviewCount: 8432,
            brand: 'Sony',
            specifications: {
                type: 'Over-Ear',
                wireless: 'Yes',
                noiseCancellation: 'Active',
                battery: '30 hours',
                bluetooth: '5.2',
                foldable: 'Yes'
            },
            imageUrl: 'https://example.com/sony-wh1000xm5.jpg'
        },
        {
            productId: 'B0BHZX8K7L',
            name: 'Bose QuietComfort 45',
            category: 'headphones',
            price: 32900,
            rating: 4.5,
            reviewCount: 6234,
            brand: 'Bose',
            specifications: {
                type: 'Over-Ear',
                wireless: 'Yes',
                noiseCancellation: 'Active',
                battery: '24 hours',
                bluetooth: '5.1',
                foldable: 'Yes'
            },
            imageUrl: 'https://example.com/bose-qc45.jpg'
        },
        {
            productId: 'B0C5J9PXK2',
            name: 'Apple AirPods Max',
            category: 'headphones',
            price: 59900,
            rating: 4.4,
            reviewCount: 3421,
            brand: 'Apple',
            specifications: {
                type: 'Over-Ear',
                wireless: 'Yes',
                noiseCancellation: 'Active',
                battery: '20 hours',
                bluetooth: '5.0',
                foldable: 'No'
            },
            imageUrl: 'https://example.com/airpods-max.jpg'
        },
        {
            productId: 'B0BWQNW4L9',
            name: 'JBL Tune 760NC',
            category: 'headphones',
            price: 7999,
            rating: 4.2,
            reviewCount: 15234,
            brand: 'JBL',
            specifications: {
                type: 'Over-Ear',
                wireless: 'Yes',
                noiseCancellation: 'Active',
                battery: '35 hours',
                bluetooth: '5.0',
                foldable: 'Yes'
            },
            imageUrl: 'https://example.com/jbl-760nc.jpg'
        },
        {
            productId: 'B0C6HJKLMN',
            name: 'Sennheiser Momentum 4',
            category: 'headphones',
            price: 34990,
            rating: 4.5,
            reviewCount: 4532,
            brand: 'Sennheiser',
            specifications: {
                type: 'Over-Ear',
                wireless: 'Yes',
                noiseCancellation: 'Active',
                battery: '60 hours',
                bluetooth: '5.2',
                foldable: 'Yes'
            },
            imageUrl: 'https://example.com/sennheiser-momentum4.jpg'
        }
    ];

    return mockProducts.map(product => ({
        ...product,
        score: calculateScore(product.rating, product.reviewCount, product.price),
        affiliateUrl: createAffiliateUrl(product.productId)
    }));
}

module.exports = {
    scrapeHeadphones
};
