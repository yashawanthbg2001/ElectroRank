const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'products.db');
const db = new sqlite3.Database(dbPath);

// Initialize database schema
function initDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Create products table
            db.run(`
                CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    productId TEXT UNIQUE NOT NULL,
                    name TEXT NOT NULL,
                    category TEXT NOT NULL,
                    price REAL NOT NULL,
                    rating REAL DEFAULT 0,
                    reviewCount INTEGER DEFAULT 0,
                    score REAL DEFAULT 0,
                    brand TEXT,
                    specifications TEXT,
                    imageUrl TEXT,
                    affiliateUrl TEXT,
                    lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating products table:', err);
                    reject(err);
                } else {
                    console.log('Products table created or already exists');
                }
            });

            // Create index on category for faster queries
            db.run(`
                CREATE INDEX IF NOT EXISTS idx_category ON products(category)
            `);

            // Create index on score for ranking queries
            db.run(`
                CREATE INDEX IF NOT EXISTS idx_score ON products(score DESC)
            `);

            // Create pages_generated table to track generated pages
            db.run(`
                CREATE TABLE IF NOT EXISTS pages_generated (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    pageType TEXT NOT NULL,
                    pagePath TEXT NOT NULL,
                    title TEXT,
                    generatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating pages_generated table:', err);
                    reject(err);
                } else {
                    console.log('Pages_generated table created or already exists');
                    resolve();
                }
            });
        });
    });
}

// Insert or update product
function upsertProduct(product) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO products (productId, name, category, price, rating, reviewCount, score, brand, specifications, imageUrl, affiliateUrl, lastUpdated)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(productId) 
            DO UPDATE SET 
                name = excluded.name,
                price = excluded.price,
                rating = excluded.rating,
                reviewCount = excluded.reviewCount,
                score = excluded.score,
                brand = excluded.brand,
                specifications = excluded.specifications,
                imageUrl = excluded.imageUrl,
                affiliateUrl = excluded.affiliateUrl,
                lastUpdated = CURRENT_TIMESTAMP
        `;

        db.run(sql, [
            product.productId,
            product.name,
            product.category,
            product.price,
            product.rating || 0,
            product.reviewCount || 0,
            product.score || 0,
            product.brand || '',
            JSON.stringify(product.specifications || {}),
            product.imageUrl || '',
            product.affiliateUrl || ''
        ], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

// Get products by category
function getProductsByCategory(category, limit = 50) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM products 
            WHERE category = ? 
            ORDER BY score DESC 
            LIMIT ?
        `;

        db.all(sql, [category, limit], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.map(row => ({
                    ...row,
                    specifications: JSON.parse(row.specifications || '{}')
                })));
            }
        });
    });
}

// Get top products across all categories
function getTopProducts(limit = 20) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM products 
            ORDER BY score DESC 
            LIMIT ?
        `;

        db.all(sql, [limit], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.map(row => ({
                    ...row,
                    specifications: JSON.parse(row.specifications || '{}')
                })));
            }
        });
    });
}

// Get product by ID
function getProductById(productId) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM products WHERE productId = ?`;

        db.get(sql, [productId], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                resolve({
                    ...row,
                    specifications: JSON.parse(row.specifications || '{}')
                });
            } else {
                resolve(null);
            }
        });
    });
}

// Get all categories
function getAllCategories() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT DISTINCT category FROM products`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.map(row => row.category));
            }
        });
    });
}

// Update product scores
function updateProductScores() {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE products 
            SET score = (rating * 2) + (reviewCount / 1000.0) - (price / 10000.0)
        `;

        db.run(sql, [], function(err) {
            if (err) {
                reject(err);
            } else {
                console.log(`Updated scores for ${this.changes} products`);
                resolve(this.changes);
            }
        });
    });
}

// Log generated page
function logGeneratedPage(pageType, pagePath, title) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO pages_generated (pageType, pagePath, title)
            VALUES (?, ?, ?)
        `;

        db.run(sql, [pageType, pagePath, title], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

// Get recent generated pages
function getRecentGeneratedPages(limit = 10) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM pages_generated 
            ORDER BY generatedAt DESC 
            LIMIT ?
        `;

        db.all(sql, [limit], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

module.exports = {
    db,
    initDatabase,
    upsertProduct,
    getProductsByCategory,
    getTopProducts,
    getProductById,
    getAllCategories,
    updateProductScores,
    logGeneratedPage,
    getRecentGeneratedPages
};
