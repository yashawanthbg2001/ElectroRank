const { calculateScore } = require('../ranking/score');
const { createAffiliateUrl } = require('./mobiles');

/**
 * Simulate scraping appliances
 * @returns {Promise<Array>} Array of appliances products
 */
async function scrapeAppliances() {
    console.log('Scraping appliances...');
    
    const mockProducts = [
        {
            productId: 'B0BKLMN6P7',
            name: 'Dyson V15 Detect Absolute',
            category: 'appliances',
            price: 58900,
            rating: 4.6,
            reviewCount: 3421,
            brand: 'Dyson',
            specifications: {
                type: 'Vacuum Cleaner',
                cordless: 'Yes',
                runtime: '60 minutes',
                suction: '230 AW',
                weight: '3.1 kg',
                features: 'Laser detection, LCD screen'
            },
            imageUrl: 'https://example.com/dyson-v15.jpg'
        },
        {
            productId: 'B0C9KLMN7Q',
            name: 'Philips Air Purifier AC2887',
            category: 'appliances',
            price: 27999,
            rating: 4.5,
            reviewCount: 8234,
            brand: 'Philips',
            specifications: {
                type: 'Air Purifier',
                coverage: '636 sq ft',
                cadr: '333 m³/h',
                filters: 'HEPA + Carbon',
                features: 'Smart sensors, App control',
                noise: '20.5 dB'
            },
            imageUrl: 'https://example.com/philips-ac2887.jpg'
        },
        {
            productId: 'B0BHKLM8N9',
            name: 'iRobot Roomba i7+',
            category: 'appliances',
            price: 67990,
            rating: 4.4,
            reviewCount: 4532,
            brand: 'iRobot',
            specifications: {
                type: 'Robot Vacuum',
                autoEmpty: 'Yes',
                mapping: 'Smart Mapping',
                battery: '75 minutes',
                features: 'WiFi, Alexa compatible',
                dustbin: 'Auto-disposal'
            },
            imageUrl: 'https://example.com/roomba-i7.jpg'
        },
        {
            productId: 'B0C6KLMN8P',
            name: 'Kent Grand Plus RO Water Purifier',
            category: 'appliances',
            price: 18999,
            rating: 4.3,
            reviewCount: 15234,
            brand: 'Kent',
            specifications: {
                type: 'Water Purifier',
                technology: 'RO + UV + UF + TDS',
                capacity: '8 Liters',
                purification: '20 liters/hour',
                warranty: '1 year',
                installation: 'Wall-mounted'
            },
            imageUrl: 'https://example.com/kent-grand.jpg'
        },
        {
            productId: 'B0BJKLMN9R',
            name: 'Morphy Richards OFR 9 Oil Heater',
            category: 'appliances',
            price: 7499,
            rating: 4.2,
            reviewCount: 12543,
            brand: 'Morphy Richards',
            specifications: {
                type: 'Room Heater',
                power: '2400W',
                fins: '9 fins',
                coverage: 'Medium rooms',
                features: '3 heat settings, Thermostat',
                safety: 'Overheat protection'
            },
            imageUrl: 'https://example.com/morphy-heater.jpg'
        }
    ];

    return mockProducts.map(product => ({
        ...product,
        score: calculateScore(product.rating, product.reviewCount, product.price),
        affiliateUrl: createAffiliateUrl(product.productId)
    }));
}

module.exports = {
    scrapeAppliances
};
