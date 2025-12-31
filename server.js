const express = require('express');
const path = require('path');
const fs = require('fs');
const {
    initDatabase,
    getProductsByCategory,
    getProductById,
    getTopProducts,
    getAllCategories
} = require('./data/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initDatabase().then(() => {
    console.log('Database initialized successfully');
}).catch(err => {
    console.error('Failed to initialize database:', err);
});

// Serve static files from pages directory
app.use(express.static(path.join(__dirname, 'pages')));

// Serve SEO files
app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'seo', 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
    const sitemapPath = path.join(__dirname, 'seo', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
        res.sendFile(sitemapPath);
    } else {
        res.status(404).send('Sitemap not generated yet');
    }
});

// Home page route
app.get('/', async (req, res) => {
    try {
        const htmlPath = path.join(__dirname, 'pages', 'home.html');
        
        // If home page doesn't exist, create a simple one
        if (!fs.existsSync(htmlPath)) {
            const categories = await getAllCategories();
            const topProducts = await getTopProducts(10);
            
            let homeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ElectroRank - Best Electronics Comparison & Reviews</title>
    <meta name="description" content="Find the best electronics based on ratings, reviews, and price. Compare mobiles, laptops, earbuds, headphones, and more.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        header { background: #2c3e50; color: white; padding: 40px 0; margin-bottom: 30px; text-align: center; }
        header h1 { font-size: 3em; margin-bottom: 10px; }
        header p { font-size: 1.2em; }
        .hero { background: white; padding: 40px; border-radius: 8px; margin-bottom: 40px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .hero h2 { color: #2c3e50; margin-bottom: 20px; }
        .categories { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .category-card { background: white; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1); transition: transform 0.3s; }
        .category-card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .category-card h3 { color: #2c3e50; margin-bottom: 15px; }
        .category-card a { display: inline-block; background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
        .category-card a:hover { background: #2980b9; }
        .top-products { background: white; padding: 30px; border-radius: 8px; margin-bottom: 40px; }
        .top-products h2 { color: #2c3e50; margin-bottom: 20px; }
        .product-list { list-style: none; }
        .product-list li { padding: 15px; border-bottom: 1px solid #ecf0f1; }
        .product-list li a { color: #3498db; text-decoration: none; font-weight: bold; }
        .product-list li a:hover { text-decoration: underline; }
        footer { background: #2c3e50; color: white; text-align: center; padding: 20px 0; margin-top: 50px; }
    </style>
</head>
<body>
    <header>
        <h1>⚡ ElectroRank</h1>
        <p>Find the Best Electronics Based on Real Data</p>
    </header>
    
    <div class="container">
        <div class="hero">
            <h2>Welcome to ElectroRank</h2>
            <p>We analyze thousands of products across multiple categories to help you make informed purchase decisions. Our ranking algorithm considers ratings, reviews, and pricing to provide objective recommendations.</p>
        </div>
        
        <h2 style="margin-bottom: 20px; color: #2c3e50;">Browse Categories</h2>
        <div class="categories">
            ${categories.map(cat => `
                <div class="category-card">
                    <h3>${cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>
                    <p>Compare and find the best ${cat}</p>
                    <a href="/category/${cat}">Explore ${cat.charAt(0).toUpperCase() + cat.slice(1)}</a>
                </div>
            `).join('')}
        </div>
        
        ${topProducts.length > 0 ? `
        <div class="top-products">
            <h2>Top Rated Products</h2>
            <ul class="product-list">
                ${topProducts.map(product => `
                    <li>
                        <a href="/product/${product.productId}">${product.name}</a>
                        <span style="color: #27ae60; margin-left: 10px;">Score: ${product.score}</span>
                        <span style="color: #666; margin-left: 10px;">₹${product.price.toLocaleString()}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
        ` : ''}
    </div>
    
    <footer>
        <p>&copy; 2024 ElectroRank. All rights reserved. | <a href="/sitemap.xml" style="color: white;">Sitemap</a> | <a href="/robots.txt" style="color: white;">Robots</a></p>
        <p>Affiliate Disclosure: We earn commissions from qualifying purchases through Amazon affiliate links.</p>
    </footer>
</body>
</html>
            `;
            
            res.send(homeHtml);
        } else {
            res.sendFile(htmlPath);
        }
    } catch (error) {
        console.error('Error serving home page:', error);
        res.status(500).send('Error loading home page');
    }
});

// Category pages
app.get('/category/:category', (req, res) => {
    const categoryPage = path.join(__dirname, 'pages', 'category', `${req.params.category}.html`);
    
    if (fs.existsSync(categoryPage)) {
        res.sendFile(categoryPage);
    } else {
        res.status(404).send('Category page not found. Please run the daily job to generate pages.');
    }
});

// Product pages
app.get('/product/:productId', (req, res) => {
    const productPage = path.join(__dirname, 'pages', 'product', `${req.params.productId}.html`);
    
    if (fs.existsSync(productPage)) {
        res.sendFile(productPage);
    } else {
        res.status(404).send('Product page not found. Please run the daily job to generate pages.');
    }
});

// Comparison pages
app.get('/compare/:ids', (req, res) => {
    const comparisonPage = path.join(__dirname, 'pages', 'compare', `${req.params.ids}.html`);
    
    if (fs.existsSync(comparisonPage)) {
        res.sendFile(comparisonPage);
    } else {
        res.status(404).send('Comparison page not found. Please run the daily job to generate pages.');
    }
});

// API endpoints (optional - for debugging/monitoring)
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.json({ categories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/products/:category', async (req, res) => {
    try {
        const products = await getProductsByCategory(req.params.category, 20);
        res.json({ products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/product/:productId', async (req, res) => {
    try {
        const product = await getProductById(req.params.productId);
        if (product) {
            res.json({ product });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`ElectroRank server running on http://localhost:${PORT}`);
    console.log(`Available routes:`);
    console.log(`  - Home: http://localhost:${PORT}/`);
    console.log(`  - Categories: http://localhost:${PORT}/category/:category`);
    console.log(`  - Products: http://localhost:${PORT}/product/:productId`);
    console.log(`  - Comparisons: http://localhost:${PORT}/compare/:id1-vs-:id2`);
    console.log(`  - Sitemap: http://localhost:${PORT}/sitemap.xml`);
    console.log(`  - Robots: http://localhost:${PORT}/robots.txt`);
});

module.exports = app;
