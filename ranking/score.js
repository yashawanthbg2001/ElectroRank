/**
 * Calculate product score based on the formula:
 * score = (rating * 2) + (reviewCount / 1000) - (price / 10000)
 * 
 * @param {number} rating - Product rating (0-5)
 * @param {number} reviewCount - Number of reviews
 * @param {number} price - Product price
 * @returns {number} Calculated score
 */
function calculateScore(rating, reviewCount, price) {
    const ratingScore = (rating || 0) * 2;
    const reviewScore = (reviewCount || 0) / 1000;
    const priceScore = (price || 0) / 10000;
    
    const score = ratingScore + reviewScore - priceScore;
    
    // Round to 2 decimal places
    return Math.round(score * 100) / 100;
}

/**
 * Rank products by score
 * @param {Array} products - Array of product objects
 * @returns {Array} Sorted array of products by score (descending)
 */
function rankProducts(products) {
    return products.sort((a, b) => b.score - a.score);
}

/**
 * Get top N products from a list
 * @param {Array} products - Array of product objects
 * @param {number} n - Number of top products to return
 * @returns {Array} Top N products
 */
function getTopNProducts(products, n = 10) {
    const ranked = rankProducts([...products]);
    return ranked.slice(0, n);
}

/**
 * Compare two products
 * @param {Object} product1 - First product
 * @param {Object} product2 - Second product
 * @returns {Object} Comparison result
 */
function compareProducts(product1, product2) {
    return {
        product1: {
            name: product1.name,
            score: product1.score,
            rating: product1.rating,
            reviewCount: product1.reviewCount,
            price: product1.price
        },
        product2: {
            name: product2.name,
            score: product2.score,
            rating: product2.rating,
            reviewCount: product2.reviewCount,
            price: product2.price
        },
        winner: product1.score > product2.score ? product1.name : product2.name,
        scoreDifference: Math.abs(product1.score - product2.score).toFixed(2),
        priceDifference: Math.abs(product1.price - product2.price).toFixed(2)
    };
}

module.exports = {
    calculateScore,
    rankProducts,
    getTopNProducts,
    compareProducts
};
