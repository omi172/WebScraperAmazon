const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set user-agent to avoid bot detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');

  // Array of Amazon search result page URLs for L4 categories
  const urls = [
    "https://www.amazon.in/s?i=kitchen&rh=n%3A976442031&dc&fs=true&page=2&qid=1727020659&ref=sr_pg_1",
       "https://www.amazon.in/s?i=kitchen&rh=n%3A976442031&dc&fs=true&page=2&qid=1727020659&ref=sr_pg_2",
       "https://www.amazon.in/s?i=kitchen&rh=n%3A976442031&dc&fs=true&page=2&qid=1727020659&ref=sr_pg_3",
       "https://www.amazon.in/s?i=kitchen&rh=n%3A976442031&dc&fs=true&page=2&qid=1727020659&ref=sr_pg_4",
       "https://www.amazon.in/s?i=kitchen&rh=n%3A976442031&dc&fs=true&page=2&qid=1727020659&ref=sr_pg_5",
       "https://www.amazon.in/s?i=kitchen&rh=n%3A976442031&dc&fs=true&page=2&qid=1727020659&ref=sr_pg_6",
       "https://www.amazon.in/s?i=kitchen&rh=n%3A976442031&dc&fs=true&page=2&qid=1727020659&ref=sr_pg_7",
       "https://www.amazon.in/s?i=kitchen&rh=n%3A976442031&dc&fs=true&page=2&qid=1727020659&ref=sr_pg_8",
       "https://www.amazon.in/s?i=kitchen&rh=n%3A976442031&dc&fs=true&page=2&qid=1727020659&ref=sr_pg_9",
       "https://www.amazon.in/s?i=kitchen&rh=n%3A976442031&dc&fs=true&page=2&qid=1727020659&ref=sr_pg_10",
       "https://www.amazon.in/s?i=kitchen&rh=n%3A976442031&dc&fs=true&page=2&qid=1727020659&ref=sr_pg_11",
       "https://www.amazon.in/s?i=kitchen&rh=n%3A976442031&dc&fs=true&page=2&qid=1727020659&ref=sr_pg_12",
       "https://www.amazon.in/s?i=kitchen&rh=n%3A976442031&dc&fs=true&page=2&qid=1727020659&ref=sr_pg_13",
       "https://www.amazon.in/s?i=kitchen&rh=n%3A976442031&dc&fs=true&page=2&qid=1727020659&ref=sr_pg_14",
       "https://www.amazon.in/s?i=kitchen&rh=n%3A976442031&dc&fs=true&page=2&qid=1727020659&ref=sr_pg_15"
  ];

  const productData = [];

  // Loop through each search result page
  for (let i = 0; i < urls.length; i++) {
    await page.goto(urls[i], { waitUntil: 'networkidle2' });

    // Wait for search result products to load
    await page.waitForSelector('.s-search-results');

    // Scrape product URLs from the search result page
    const productUrls = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.s-main-slot a.a-link-normal.a-text-normal'));
      return links.map(link => link.href).slice(0, 230); // Get top 230 product URLs
    });

    // Navigate to each product page and scrape details
    for (let productUrl of productUrls) {
      await page.goto(productUrl, { waitUntil: 'networkidle2' });

      // Scrape the product name and price
      const productDetails = await page.evaluate(() => {
        const productTitle = document.querySelector('#productTitle') ? document.querySelector('#productTitle').innerText.trim() : null;
        const productPrice = document.querySelector('.a-price .a-offscreen') ? document.querySelector('.a-price .a-offscreen').innerText.trim() : 'Price not available';
        return { productTitle, productPrice };
      });

      // Wait for reviews section to load
      try {
        await page.waitForSelector('#cm-cr-dp-review-list', { timeout: 5000 });
      } catch (error) {
        console.log(`No reviews found for ${productDetails.productTitle}`);
        continue;
      }

      // Scrape reviews, ratings, and reviewer names
      const reviews = await page.evaluate(() => {
        const reviewElements = document.querySelectorAll('.review');
        const scrapedReviews = [];

        reviewElements.forEach((reviewElement) => {
          const rating = reviewElement.querySelector('.review-rating') ? reviewElement.querySelector('.review-rating').innerText : null;
          const reviewText = reviewElement.querySelector('.review-text') ? reviewElement.querySelector('.review-text').innerText : null;
          const reviewerName = reviewElement.querySelector('.a-profile-name') ? reviewElement.querySelector('.a-profile-name').innerText : null;

          scrapedReviews.push({
            rating,
            reviewText,
            reviewerName,
          });
        });

        return scrapedReviews;
      });

      // Push the scraped data (including product name, price, and reviews) into productData array
      reviews.forEach(review => {
        productData.push({
          productName: productDetails.productTitle,
          ...review
        });
      });
    }
  }

  // Output the scraped data
  const csvHeaders = 'Product Name,Rating,Review Text,Reviewer Name\n';
  const csvRows = productData.map(item => 
    `${item.productName || ''},${item.rating || ''},${item.reviewText || ''},${item.reviewerName || ''}`
  ).join('\n');

  const csvContent = csvHeaders + csvRows;

  // Write CSV to a file
  fs.writeFileSync('HomeAndKitchen_product_reviews2.csv', csvContent, 'utf8');

  console.log('Data written to amazon_product_reviews_with_price.csv');

  // Close the browser
  await browser.close();
})();



