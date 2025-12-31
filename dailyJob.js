const cron = require('node-cron');
const { initDatabase, upsertProduct, updateProductScores } = require('./data/database');
const { scrapeMobiles } = require('./scraper/mobiles');
const { scrapeLaptops } = require('./scraper/laptops');
const { scrapeEarbuds } = require('./scraper/earbuds');
const { scrapeHeadphones } = require('./scraper/headphones');
const { scrapeAccessories } = require('./scraper/accessories');
const { scrapeAppliances } = require('./scraper/appliances');
const { generatePages } = require('./generator/generatePages');
const { generateSitemap, pingGoogle } = require('./seo/sitemap');

/**
 * Run all scrapers
 */
async function runScrapers() {
    console.log('\n========================================');
    console.log('Starting scrapers...');
    console.log('========================================\n');
    
    const scrapers = [
        { name: 'Mobiles', fn: scrapeMobiles },
        { name: 'Laptops', fn: scrapeLaptops },
        { name: 'Earbuds', fn: scrapeEarbuds },
        { name: 'Headphones', fn: scrapeHeadphones },
        { name: 'Accessories', fn: scrapeAccessories },
        { name: 'Appliances', fn: scrapeAppliances }
    ];
    
    let totalProducts = 0;
    
    for (const scraper of scrapers) {
        try {
            console.log(`Running ${scraper.name} scraper...`);
            const products = await scraper.fn();
            
            // Insert/update products in database
            for (const product of products) {
                await upsertProduct(product);
            }
            
            console.log(`✓ ${scraper.name}: ${products.length} products scraped and saved`);
            totalProducts += products.length;
        } catch (error) {
            console.error(`✗ Error scraping ${scraper.name}:`, error.message);
        }
    }
    
    console.log(`\nTotal products scraped: ${totalProducts}\n`);
    return totalProducts;
}

/**
 * Update all product scores
 */
async function recalculateScores() {
    console.log('========================================');
    console.log('Recalculating product scores...');
    console.log('========================================\n');
    
    try {
        const updatedCount = await updateProductScores();
        console.log(`✓ Scores updated for ${updatedCount} products\n`);
        return updatedCount;
    } catch (error) {
        console.error('✗ Error updating scores:', error.message);
        return 0;
    }
}

/**
 * Generate new pages
 */
async function generateNewPages(count = 5) {
    console.log('========================================');
    console.log(`Generating ${count} new pages...`);
    console.log('========================================\n');
    
    try {
        const pages = await generatePages(count);
        console.log(`✓ Generated ${pages.length} pages:`);
        pages.forEach(page => {
            console.log(`  - ${page.type}: ${page.path}`);
        });
        console.log('');
        return pages;
    } catch (error) {
        console.error('✗ Error generating pages:', error.message);
        return [];
    }
}

/**
 * Update sitemap and ping Google
 */
async function updateSitemap() {
    console.log('========================================');
    console.log('Updating sitemap...');
    console.log('========================================\n');
    
    try {
        await generateSitemap();
        console.log('✓ Sitemap updated successfully');
        
        // Ping Google (optional, may not work in development)
        await pingGoogle();
        console.log('');
    } catch (error) {
        console.error('✗ Error updating sitemap:', error.message);
    }
}

/**
 * Main daily job function
 */
async function runDailyJob() {
    const startTime = Date.now();
    
    console.log('\n');
    console.log('╔════════════════════════════════════════╗');
    console.log('║     ELECTRORANK DAILY JOB STARTED      ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`Started at: ${new Date().toLocaleString()}\n`);
    
    try {
        // Initialize database
        await initDatabase();
        
        // Step 1: Run scrapers
        const productsScraped = await runScrapers();
        
        // Step 2: Recalculate scores
        const scoresUpdated = await recalculateScores();
        
        // Step 3: Generate pages (4-5 pages daily)
        const pagesGenerated = await generateNewPages(5);
        
        // Step 4: Update sitemap and ping Google
        await updateSitemap();
        
        // Summary
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        console.log('========================================');
        console.log('DAILY JOB SUMMARY');
        console.log('========================================');
        console.log(`Products scraped: ${productsScraped}`);
        console.log(`Scores updated: ${scoresUpdated}`);
        console.log(`Pages generated: ${pagesGenerated.length}`);
        console.log(`Duration: ${duration} seconds`);
        console.log('========================================\n');
        
        console.log('╔════════════════════════════════════════╗');
        console.log('║    ELECTRORANK DAILY JOB COMPLETED     ║');
        console.log('╚════════════════════════════════════════╝');
        console.log(`Completed at: ${new Date().toLocaleString()}\n`);
        
    } catch (error) {
        console.error('\n✗ FATAL ERROR in daily job:', error);
        console.error(error.stack);
    }
}

/**
 * Schedule daily job
 * Runs every day at 2:00 AM
 */
function scheduleDailyJob() {
    console.log('Setting up daily job scheduler...');
    console.log('Job will run every day at 2:00 AM');
    
    // Run at 2:00 AM every day
    cron.schedule('0 2 * * *', () => {
        runDailyJob();
    });
    
    console.log('Scheduler activated!\n');
}

// If running as main script
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--now') || args.includes('-n')) {
        // Run immediately
        console.log('Running daily job immediately...\n');
        runDailyJob().then(() => {
            console.log('Job completed. Exiting...');
            process.exit(0);
        }).catch(err => {
            console.error('Job failed:', err);
            process.exit(1);
        });
    } else if (args.includes('--schedule') || args.includes('-s')) {
        // Schedule for daily execution
        scheduleDailyJob();
        
        // Keep process running
        console.log('Press Ctrl+C to stop the scheduler\n');
    } else {
        // Show help
        console.log('ElectroRank Daily Job');
        console.log('Usage:');
        console.log('  node dailyJob.js --now        Run job immediately');
        console.log('  node dailyJob.js --schedule   Schedule job to run daily at 2:00 AM');
        console.log('  node dailyJob.js --help       Show this help message');
    }
}

module.exports = {
    runDailyJob,
    scheduleDailyJob,
    runScrapers,
    recalculateScores,
    generateNewPages,
    updateSitemap
};
