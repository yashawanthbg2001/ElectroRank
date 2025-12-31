# ElectroRank

An automated comparison and recommendation website for electronics gadgets. ElectroRank scrapes product data, ranks products using a scoring algorithm, and generates SEO-optimized pages with affiliate links.

## Features

- **Multi-Category Support**: Mobiles, Laptops, Earbuds, Headphones, Accessories, and Appliances
- **Automated Scraping**: Daily scraping of product data from multiple sources
- **Smart Ranking Algorithm**: Products ranked by: `score = (rating × 2) + (reviewCount / 1000) - (price / 10000)`
- **SEO Optimized**: Meta tags, schema markup, internal linking, and sitemap generation
- **Automated Page Generation**: Daily generation of 4-5 new pages (category, product, and comparison pages)
- **Affiliate Integration**: Automatic Amazon affiliate link generation
- **Database Storage**: SQLite database for efficient product data management

## Project Structure

```
/electrorank
 ├─ scraper/              # Product scrapers for different categories
 │   ├─ mobiles.js
 │   ├─ laptops.js
 │   ├─ earbuds.js
 │   ├─ headphones.js
 │   ├─ accessories.js
 │   └─ appliances.js
 │
 ├─ data/                 # Database and database utilities
 │   ├─ database.js       # Database operations
 │   └─ products.db       # SQLite database (auto-generated)
 │
 ├─ ranking/              # Ranking algorithm
 │   └─ score.js          # Score calculation and product ranking
 │
 ├─ generator/            # Page generation
 │   └─ generatePages.js  # HTML page generator
 │
 ├─ templates/            # HTML templates
 │   ├─ category.html     # Category page template
 │   ├─ comparison.html   # Product comparison template
 │   └─ product.html      # Individual product template
 │
 ├─ seo/                  # SEO files
 │   ├─ sitemap.xml       # Auto-generated sitemap
 │   ├─ sitemap.js        # Sitemap generator
 │   └─ robots.txt        # Robots.txt file
 │
 ├─ pages/                # Generated HTML pages (auto-generated)
 │
 ├─ dailyJob.js           # Daily automation script
 ├─ server.js             # Express server
 └─ package.json          # Dependencies
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yashawanthbg2001/ElectroRank.git
cd ElectroRank
```

2. Install dependencies:
```bash
npm install
```

3. Configure affiliate tag (optional):
Edit `scraper/mobiles.js` and update the `affiliateTag` in `SCRAPER_CONFIG`:
```javascript
affiliateTag: 'your-amazon-affiliate-tag'
```

## Usage

### Quick Demo

Run a quick demonstration of the system:
```bash
npm run demo
```

This will show you:
- System statistics
- Top ranked products
- Available features
- Generated pages count
- Available routes

### Running the Server

Start the Express server:
```bash
npm start
```

The server will be available at `http://localhost:3000`

### Running the Daily Job

The daily job handles:
- Scraping product data
- Updating the database
- Recalculating product scores
- Generating new pages
- Updating sitemap
- Pinging Google

**Run immediately:**
```bash
node dailyJob.js --now
# or
npm run daily-job
```

**Schedule for daily execution (2:00 AM):**
```bash
node dailyJob.js --schedule
# or
npm run schedule
```

## API Endpoints

### Web Pages
- `GET /` - Home page
- `GET /category/:category` - Category page (e.g., `/category/mobiles`)
- `GET /product/:productId` - Product detail page
- `GET /compare/:id1-vs-:id2` - Product comparison page

### SEO
- `GET /sitemap.xml` - XML sitemap
- `GET /robots.txt` - Robots.txt file

### API (Optional - for debugging)
- `GET /api/categories` - List all categories
- `GET /api/products/:category` - Get products by category
- `GET /api/product/:productId` - Get product by ID

## Ranking Algorithm

Products are ranked using the following formula:

```
score = (rating × 2) + (reviewCount / 1000) - (price / 10000)
```

**Components:**
- **Rating Score** (rating × 2): Higher ratings contribute more to the score
- **Review Score** (reviewCount / 1000): More reviews increase confidence
- **Price Penalty** (price / 10000): Lower prices result in higher scores

**Example:**
- Product: Rating 4.5, 10,000 reviews, ₹50,000
- Score: (4.5 × 2) + (10000 / 1000) - (50000 / 10000) = 9 + 10 - 5 = **14.0**

## Database Schema

### Products Table
- `id`: Primary key (auto-increment)
- `productId`: Unique product identifier (ASIN)
- `name`: Product name
- `category`: Product category
- `price`: Product price
- `rating`: User rating (0-5)
- `reviewCount`: Number of reviews
- `score`: Calculated ElectroRank score
- `brand`: Product brand
- `specifications`: JSON string of specifications
- `imageUrl`: Product image URL
- `affiliateUrl`: Amazon affiliate link
- `lastUpdated`: Last update timestamp
- `createdAt`: Creation timestamp

### Pages Generated Table
- `id`: Primary key
- `pageType`: Type of page (category/product/comparison)
- `pagePath`: Path to generated page
- `title`: Page title
- `generatedAt`: Generation timestamp

## SEO Features

1. **Meta Tags**: Title, description, keywords for each page
2. **Open Graph**: Social media sharing optimization
3. **Schema Markup**: Product and rating schema for rich snippets
4. **Internal Linking**: Automatic cross-linking between pages
5. **Sitemap**: Auto-generated XML sitemap
6. **Robots.txt**: Search engine crawling guidelines
7. **Affiliate Disclosure**: Transparent affiliate relationship disclosure

## Customization

### Adding New Categories

1. Create a new scraper in `scraper/`:
```javascript
// scraper/smartwatches.js
const { calculateScore } = require('../ranking/score');
const { createAffiliateUrl } = require('./mobiles');

async function scrapeSmartWatches() {
    // Your scraping logic here
    const products = [/* ... */];
    return products.map(product => ({
        ...product,
        score: calculateScore(product.rating, product.reviewCount, product.price),
        affiliateUrl: createAffiliateUrl(product.productId)
    }));
}

module.exports = { scrapeSmartWatches };
```

2. Add the scraper to `dailyJob.js`:
```javascript
const { scrapeSmartWatches } = require('./scraper/smartwatches');

const scrapers = [
    // ... existing scrapers
    { name: 'Smart Watches', fn: scrapeSmartWatches }
];
```

3. Update navigation in templates to include the new category.

### Modifying the Ranking Algorithm

Edit `ranking/score.js`:
```javascript
function calculateScore(rating, reviewCount, price) {
    // Custom formula
    const score = (rating * 3) + (reviewCount / 500) - (price / 5000);
    return Math.round(score * 100) / 100;
}
```

Don't forget to update product scores:
```bash
node dailyJob.js --now
```

## Development

### Testing Scrapers
```javascript
const { scrapeMobiles } = require('./scraper/mobiles');
scrapeMobiles().then(products => console.log(products));
```

### Testing Page Generation
```javascript
const { generatePages } = require('./generator/generatePages');
generatePages(5).then(pages => console.log('Generated:', pages));
```

### Database Operations
```javascript
const { getProductsByCategory } = require('./data/database');
getProductsByCategory('mobiles', 10).then(products => console.log(products));
```

## Deployment

### Production Considerations

1. **Environment Variables**: Use `.env` file for configuration
2. **Affiliate Tag**: Update with your actual Amazon affiliate ID
3. **Scraping**: Implement real scraping logic (currently uses mock data)
4. **Cron Jobs**: Use system cron or process manager (PM2) for daily jobs
5. **Database**: Consider PostgreSQL or MySQL for production
6. **Caching**: Implement Redis for better performance
7. **CDN**: Use CDN for static assets

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start server.js --name electrorank-server

# Schedule daily job
pm2 start dailyJob.js --name electrorank-job --cron "0 2 * * *"
```

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Disclaimer

This project uses Amazon affiliate links. We may earn a commission from qualifying purchases. Product data is for informational purposes only. Always verify specifications and prices on the merchant's website before making a purchase.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [Your Contact Information]

---

**Built with ❤️ for smart shoppers**
