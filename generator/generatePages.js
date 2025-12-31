const fs = require('fs');
const path = require('path');
const {
    getProductsByCategory,
    getTopProducts,
    getProductById,
    getAllCategories,
    logGeneratedPage
} = require('../data/database');

const PAGES_DIR = path.join(__dirname, '../pages');
const TEMPLATES_DIR = path.join(__dirname, '../templates');

// Ensure pages directory exists
if (!fs.existsSync(PAGES_DIR)) {
    fs.mkdirSync(PAGES_DIR, { recursive: true });
}

/**
 * Load HTML template
 */
function loadTemplate(templateName) {
    const templatePath = path.join(TEMPLATES_DIR, templateName);
    return fs.readFileSync(templatePath, 'utf8');
}

/**
 * Save HTML page
 */
function savePage(relativePath, content) {
    const fullPath = path.join(PAGES_DIR, relativePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, content, 'utf8');
    return relativePath;
}

/**
 * Generate category page
 */
async function generateCategoryPage(category) {
    console.log(`Generating category page for: ${category}`);
    
    const products = await getProductsByCategory(category, 20);
    const template = loadTemplate('category.html');
    
    // Generate product cards HTML
    const productsHtml = products.map(product => `
        <div class="product-card">
            <h3><a href="/product/${product.productId}" style="color: #2c3e50; text-decoration: none;">${product.name}</a></h3>
            <div class="product-score">Score: ${product.score}</div>
            <div class="product-rating">⭐ ${product.rating}/5 (${product.reviewCount.toLocaleString()} reviews)</div>
            <div class="product-price">₹${product.price.toLocaleString()}</div>
            <ul class="product-specs">
                ${Object.entries(product.specifications).slice(0, 4).map(([key, value]) => 
                    `<li><strong>${key}:</strong> ${value}</li>`
                ).join('')}
            </ul>
            <a href="${product.affiliateUrl}" class="cta-button" target="_blank" rel="nofollow">View on Amazon</a>
        </div>
    `).join('');
    
    // Get all categories for internal links
    const allCategories = await getAllCategories();
    const internalLinks = allCategories
        .filter(cat => cat !== category)
        .map(cat => `<li><a href="/category/${cat}">Best ${cat.charAt(0).toUpperCase() + cat.slice(1)}</a></li>`)
        .join('');
    
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    const title = `Best ${categoryName} in India 2024 - Ranked by ElectroRank`;
    const description = `Compare and find the best ${category} based on ratings, reviews, and price. Top ${products.length} ${category} ranked by our algorithm.`;
    
    const html = template
        .replace(/{{TITLE}}/g, title)
        .replace(/{{DESCRIPTION}}/g, description)
        .replace(/{{KEYWORDS}}/g, `${category}, best ${category}, buy ${category}, ${category} reviews, ${category} comparison`)
        .replace(/{{CATEGORY_NAME}}/g, categoryName)
        .replace(/{{HEADING}}/g, `Best ${categoryName} in India 2024`)
        .replace(/{{INTRO_TEXT}}/g, `We've analyzed ${products.length} ${category} based on ratings, reviews, and pricing to help you make the best purchase decision. Our ElectroRank score combines multiple factors to rank products objectively.`)
        .replace(/{{PRODUCTS}}/g, productsHtml)
        .replace(/{{INTERNAL_LINKS}}/g, internalLinks)
        .replace(/{{URL}}/g, `https://electrorank.com/category/${category}`);
    
    const pagePath = savePage(`category/${category}.html`, html);
    await logGeneratedPage('category', pagePath, title);
    
    return pagePath;
}

/**
 * Generate comparison page
 */
async function generateComparisonPage(productId1, productId2) {
    console.log(`Generating comparison page for: ${productId1} vs ${productId2}`);
    
    const product1 = await getProductById(productId1);
    const product2 = await getProductById(productId2);
    
    if (!product1 || !product2) {
        console.error('One or both products not found');
        return null;
    }
    
    const template = loadTemplate('comparison.html');
    
    // Generate comparison table
    const comparisonTable = `
        <table>
            <thead>
                <tr>
                    <th>Feature</th>
                    <th>${product1.name}</th>
                    <th>${product2.name}</th>
                </tr>
            </thead>
            <tbody>
                <tr class="${product1.score > product2.score ? 'winner' : ''}">
                    <td><strong>ElectroRank Score</strong></td>
                    <td>${product1.score}</td>
                    <td>${product2.score}</td>
                </tr>
                <tr>
                    <td><strong>Rating</strong></td>
                    <td>⭐ ${product1.rating}/5</td>
                    <td>⭐ ${product2.rating}/5</td>
                </tr>
                <tr>
                    <td><strong>Reviews</strong></td>
                    <td>${product1.reviewCount.toLocaleString()}</td>
                    <td>${product2.reviewCount.toLocaleString()}</td>
                </tr>
                <tr class="${product1.price < product2.price ? 'winner' : ''}">
                    <td><strong>Price</strong></td>
                    <td>₹${product1.price.toLocaleString()}</td>
                    <td>₹${product2.price.toLocaleString()}</td>
                </tr>
                <tr>
                    <td><strong>Brand</strong></td>
                    <td>${product1.brand}</td>
                    <td>${product2.brand}</td>
                </tr>
            </tbody>
        </table>
    `;
    
    // Generate detailed product sections
    const productsDetail = `
        <div class="product-section">
            <h2>${product1.name}</h2>
            <div class="score-badge">Score: ${product1.score}</div>
            <div class="price">₹${product1.price.toLocaleString()}</div>
            <ul class="specs-list">
                ${Object.entries(product1.specifications).map(([key, value]) => 
                    `<li><strong>${key}:</strong> ${value}</li>`
                ).join('')}
            </ul>
            <a href="${product1.affiliateUrl}" class="cta-button" target="_blank" rel="nofollow">View on Amazon</a>
        </div>
        
        <div class="product-section">
            <h2>${product2.name}</h2>
            <div class="score-badge">Score: ${product2.score}</div>
            <div class="price">₹${product2.price.toLocaleString()}</div>
            <ul class="specs-list">
                ${Object.entries(product2.specifications).map(([key, value]) => 
                    `<li><strong>${key}:</strong> ${value}</li>`
                ).join('')}
            </ul>
            <a href="${product2.affiliateUrl}" class="cta-button" target="_blank" rel="nofollow">View on Amazon</a>
        </div>
    `;
    
    const winner = product1.score > product2.score ? product1 : product2;
    const verdict = `
        <p>Based on our comprehensive analysis, <strong>${winner.name}</strong> scores higher with an ElectroRank score of ${winner.score}.</p>
        <p>However, your choice should depend on your specific needs and budget. 
        ${product1.price < product2.price ? `The ${product1.name} offers better value for money at ₹${product1.price.toLocaleString()}.` : ''}
        ${product1.rating > product2.rating ? `The ${product1.name} has higher user ratings.` : ''}
        </p>
    `;
    
    const allCategories = await getAllCategories();
    const internalLinks = allCategories
        .map(cat => `<li><a href="/category/${cat}">View all ${cat}</a></li>`)
        .join('');
    
    const title = `${product1.name} vs ${product2.name} - Detailed Comparison 2024`;
    const description = `Compare ${product1.name} and ${product2.name}. See specs, prices, ratings, and our verdict to help you choose the right product.`;
    
    const html = template
        .replace(/{{TITLE}}/g, title)
        .replace(/{{DESCRIPTION}}/g, description)
        .replace(/{{KEYWORDS}}/g, `${product1.name}, ${product2.name}, comparison, vs, which is better`)
        .replace(/{{HEADING}}/g, `${product1.name} vs ${product2.name}`)
        .replace(/{{INTRO_TEXT}}/g, `Detailed comparison between ${product1.name} and ${product2.name}. We've analyzed specifications, pricing, user ratings, and reviews to help you make an informed decision.`)
        .replace(/{{COMPARISON_TABLE}}/g, comparisonTable)
        .replace(/{{PRODUCTS_DETAIL}}/g, productsDetail)
        .replace(/{{VERDICT}}/g, verdict)
        .replace(/{{INTERNAL_LINKS}}/g, internalLinks)
        .replace(/{{URL}}/g, `https://electrorank.com/compare/${productId1}-vs-${productId2}`);
    
    const pagePath = savePage(`compare/${productId1}-vs-${productId2}.html`, html);
    await logGeneratedPage('comparison', pagePath, title);
    
    return pagePath;
}

/**
 * Generate individual product page
 */
async function generateProductPage(productId) {
    console.log(`Generating product page for: ${productId}`);
    
    const product = await getProductById(productId);
    
    if (!product) {
        console.error('Product not found');
        return null;
    }
    
    const template = loadTemplate('product.html');
    
    // Generate specifications HTML
    const specificationsHtml = Object.entries(product.specifications)
        .map(([key, value]) => `
            <div class="spec-item">
                <div class="spec-label">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
                <div class="spec-value">${value}</div>
            </div>
        `).join('');
    
    // Generate pros and cons based on product data
    const pros = `
        <ul>
            <li>High ElectroRank score of ${product.score}</li>
            <li>Rated ${product.rating}/5 by ${product.reviewCount.toLocaleString()} users</li>
            ${product.rating >= 4.5 ? '<li>Excellent user ratings</li>' : ''}
            ${product.reviewCount >= 10000 ? '<li>Highly popular with extensive reviews</li>' : ''}
        </ul>
    `;
    
    const cons = `
        <ul>
            ${product.rating < 4.0 ? '<li>Below average user ratings</li>' : ''}
            ${product.reviewCount < 1000 ? '<li>Limited user reviews available</li>' : ''}
            <li>Price may vary; check current offers on Amazon</li>
        </ul>
    `;
    
    const description = `
        <p>The <strong>${product.name}</strong> by ${product.brand} is a premium ${product.category.slice(0, -1)} 
        that has earned an ElectroRank score of ${product.score}, making it one of the top choices in its category.</p>
        <p>With ${product.reviewCount.toLocaleString()} user reviews and an average rating of ${product.rating}/5, 
        this product has proven its worth in the market. Priced at ₹${product.price.toLocaleString()}, it offers 
        excellent value for your investment.</p>
        <p>Our ranking algorithm considers multiple factors including user ratings, review volume, and pricing 
        to provide you with an objective assessment.</p>
    `;
    
    // Get related products from same category
    const relatedProducts = await getProductsByCategory(product.category, 5);
    const internalLinks = relatedProducts
        .filter(p => p.productId !== product.productId)
        .slice(0, 4)
        .map(p => `<li><a href="/product/${p.productId}">${p.name}</a></li>`)
        .join('');
    
    const categoryName = product.category.charAt(0).toUpperCase() + product.category.slice(1);
    const title = `${product.name} Review - Price, Specs & Rating | ElectroRank`;
    const metaDescription = `${product.name} detailed review. ElectroRank Score: ${product.score}. Price: ₹${product.price.toLocaleString()}. Rating: ${product.rating}/5. Compare specs and buy from Amazon.`;
    
    const html = template
        .replace(/{{TITLE}}/g, title)
        .replace(/{{DESCRIPTION}}/g, metaDescription)
        .replace(/{{KEYWORDS}}/g, `${product.name}, ${product.brand}, ${product.category}, review, price, specifications`)
        .replace(/{{PRODUCT_NAME}}/g, product.name)
        .replace(/{{CATEGORY}}/g, product.category)
        .replace(/{{CATEGORY_NAME}}/g, categoryName)
        .replace(/{{BRAND}}/g, product.brand)
        .replace(/{{PRICE}}/g, product.price.toLocaleString())
        .replace(/{{RATING}}/g, product.rating)
        .replace(/{{REVIEW_COUNT}}/g, product.reviewCount.toLocaleString())
        .replace(/{{SCORE}}/g, product.score)
        .replace(/{{IMAGE_URL}}/g, product.imageUrl || '')
        .replace(/{{AFFILIATE_URL}}/g, product.affiliateUrl)
        .replace(/{{SPECIFICATIONS}}/g, specificationsHtml)
        .replace(/{{DESCRIPTION_CONTENT}}/g, description)
        .replace(/{{PROS}}/g, pros)
        .replace(/{{CONS}}/g, cons)
        .replace(/{{INTERNAL_LINKS}}/g, internalLinks);
    
    const pagePath = savePage(`product/${productId}.html`, html);
    await logGeneratedPage('product', pagePath, title);
    
    return pagePath;
}

/**
 * Generate multiple pages
 * First ensures all category pages exist, then generates product/comparison pages
 */
async function generatePages(count = 5) {
    console.log(`Starting page generation (up to ${count} new product/comparison pages)...`);
    
    const generatedPages = [];
    const categories = await getAllCategories();
    
    if (categories.length === 0) {
        console.log('No categories found. Please run scrapers first.');
        return generatedPages;
    }
    
    // ALWAYS generate/update all category pages (not counted in daily limit)
    console.log(`Generating category pages for all ${categories.length} categories...`);
    for (const category of categories) {
        const pagePath = await generateCategoryPage(category);
        generatedPages.push({ type: 'category', path: pagePath });
    }
    
    let productPagesGenerated = 0;
    
    // Generate product pages (counted in daily limit)
    const topProducts = await getTopProducts(count);
    
    for (const product of topProducts) {
        if (productPagesGenerated >= count) break;
        
        const pagePath = await generateProductPage(product.productId);
        if (pagePath) {
            generatedPages.push({ type: 'product', path: pagePath });
            productPagesGenerated++;
        }
    }
    
    // Generate comparison pages if there's room (counted in daily limit)
    if (productPagesGenerated < count && categories.length > 0) {
        const products = await getProductsByCategory(categories[0], 4);
        
        if (products.length >= 2) {
            const pagePath = await generateComparisonPage(products[0].productId, products[1].productId);
            if (pagePath) {
                generatedPages.push({ type: 'comparison', path: pagePath });
                productPagesGenerated++;
            }
        }
    }
    
    console.log(`Generated ${generatedPages.length} pages successfully (${categories.length} category + ${productPagesGenerated} product/comparison)`);
    return generatedPages;
}

module.exports = {
    generateCategoryPage,
    generateComparisonPage,
    generateProductPage,
    generatePages
};
