#!/usr/bin/env node

/**
 * ElectroRank Demo Script
 * This script demonstrates the full functionality of the ElectroRank system
 */

const { initDatabase, getTopProducts, getAllCategories } = require('./data/database');
const { generatePages } = require('./generator/generatePages');
const { runDailyJob } = require('./dailyJob');

async function demo() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║          ELECTRORANK SYSTEM DEMONSTRATION                  ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Initialize database
    await initDatabase();
    
    // Get system stats
    const categories = await getAllCategories();
    const topProducts = await getTopProducts(3);
    
    console.log('📊 SYSTEM STATISTICS\n');
    console.log(`   Total Categories: ${categories.length}`);
    console.log(`   Categories: ${categories.join(', ')}\n`);
    
    console.log('🏆 TOP 3 PRODUCTS BY ELECTRORANK SCORE\n');
    topProducts.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name}`);
        console.log(`      Category: ${product.category}`);
        console.log(`      Score: ${product.score}`);
        console.log(`      Rating: ${product.rating}/5 (${product.reviewCount.toLocaleString()} reviews)`);
        console.log(`      Price: ₹${product.price.toLocaleString()}`);
        console.log(`      Buy: ${product.affiliateUrl}\n`);
    });
    
    console.log('✨ KEY FEATURES\n');
    console.log('   ✓ Automated daily scraping of product data');
    console.log('   ✓ Smart ranking algorithm based on ratings, reviews, and price');
    console.log('   ✓ SEO-optimized page generation (category, product, comparison)');
    console.log('   ✓ Amazon affiliate link integration');
    console.log('   ✓ Automatic sitemap generation and Google ping');
    console.log('   ✓ SQLite database for efficient data storage\n');
    
    console.log('🚀 AVAILABLE COMMANDS\n');
    console.log('   Start Server:      npm start');
    console.log('   Run Daily Job:     node dailyJob.js --now');
    console.log('   Schedule Job:      node dailyJob.js --schedule\n');
    
    console.log('📁 GENERATED FILES\n');
    const fs = require('fs');
    const path = require('path');
    
    try {
        const categoryCount = fs.readdirSync(path.join(__dirname, 'pages/category')).length;
        const productCount = fs.readdirSync(path.join(__dirname, 'pages/product')).length;
        const compareCount = fs.readdirSync(path.join(__dirname, 'pages/compare')).length;
        
        console.log(`   Category Pages: ${categoryCount}`);
        console.log(`   Product Pages: ${productCount}`);
        console.log(`   Comparison Pages: ${compareCount}\n`);
    } catch (error) {
        console.log('   (Pages not generated yet - run daily job first)\n');
    }
    
    console.log('🌐 WEBSITE ROUTES\n');
    console.log('   Home:          http://localhost:3000/');
    console.log('   Categories:    http://localhost:3000/category/:category');
    console.log('   Products:      http://localhost:3000/product/:productId');
    console.log('   Comparisons:   http://localhost:3000/compare/:id1-vs-:id2');
    console.log('   Sitemap:       http://localhost:3000/sitemap.xml\n');
    
    console.log('📖 For more information, see README.md\n');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
}

// Run demo
if (require.main === module) {
    demo().catch(err => {
        console.error('Demo error:', err);
        process.exit(1);
    });
}

module.exports = { demo };
