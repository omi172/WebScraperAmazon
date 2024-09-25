const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set user-agent to avoid bot detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');

  // Array of Amazon search result page URLs for L4 categories
  const urls = ["https://www.amazon.in/s?rh=n%3A9530420031&fs=true&pf_rd_i=1374407031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=2363ebfc-bb7c-42bf-b7e4-8ed642479e59&pf_rd_r=6EFPC2XV72K28QP3CBNW&pf_rd_s=merchandised-search-4&ref=lp_9530420031_sar",
    "https://www.amazon.in/s?rh=n%3A1374429031&fs=true&pf_rd_i=1374407031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=2363ebfc-bb7c-42bf-b7e4-8ed642479e59&pf_rd_r=6EFPC2XV72K28QP3CBNW&pf_rd_s=merchandised-search-4&ref=lp_1374429031_sar",
    "https://www.amazon.in/s?i=beauty&rh=n%3A1355016031%2Cn%3A1374276031%2Cn%3A1374292031%2Cn%3A1374411031&dc&fs=true&ds=v1%3AZ1rSuPZEGuJeME5yXtnrmfDEZd1kCRAIsr8g91I7yVI&pf_rd_i=1374407031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=2363ebfc-bb7c-42bf-b7e4-8ed642479e59&pf_rd_r=6EFPC2XV72K28QP3CBNW&pf_rd_s=merchandised-search-4&qid=1720422283&rnid=1355016031&ref=sr_nr_n_3",
    "https://www.amazon.in/s?i=beauty&bbn=9530421031&rh=n%3A1355016031%2Cn%3A1374407031%2Cn%3A1374414031%2Cn%3A9530421031%2Cn%3A9530424031%2Cp_85%3A10440599031%2Cp_28%3A-spons&pf_rd_i=1374407031&pf_rd_i=1374414031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=2363ebfc-bb7c-42bf-b7e4-8ed642479e59&pf_rd_p=7a75614f-0d8d-4310-b650-6d2a98c99f43&pf_rd_r=6EFPC2XV72K28QP3CBNW&pf_rd_r=EW2JDNGESDX9E0RH2YDQ&pf_rd_s=merchandised-search-4&pf_rd_s=merchandised-search-4&ref=QANav11CTA_en_IN_4",
    "https://www.amazon.in/s?i=beauty&bbn=9530421031&rh=n%3A1355016031%2Cn%3A1374407031%2Cn%3A1374414031%2Cn%3A9530421031%2Cp_85%3A10440599031%2Cp_28%3A-spons&dc&ds=v1%3AyjBD%2BrECl6gDHgM870TLDn9G%2BziXzqDgrAGlZfvNSY8&pf_rd_i=1374407031&pf_rd_i=1374414031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=2363ebfc-bb7c-42bf-b7e4-8ed642479e59&pf_rd_p=7a75614f-0d8d-4310-b650-6d2a98c99f43&pf_rd_r=6EFPC2XV72K28QP3CBNW&pf_rd_r=EW2JDNGESDX9E0RH2YDQ&pf_rd_s=merchandised-search-4&pf_rd_s=merchandised-search-4&qid=1720422501&ref=sr_ex_n_1",
    "https://www.amazon.in/s?rh=n%3A9530425031&fs=true&pf_rd_i=1374407031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=2363ebfc-bb7c-42bf-b7e4-8ed642479e59&pf_rd_r=6EFPC2XV72K28QP3CBNW&pf_rd_s=merchandised-search-4&ref=lp_9530425031_sar"]  
  

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
  const csvHeaders = 'Product Name,Price,Rating,Review Text,Reviewer Name\n';
  const csvRows = productData.map(item => 
    `${item.productName || ''},${item.rating || ''},${item.reviewText || ''},${item.reviewerName || ''}`
  ).join('\n');

  const csvContent = csvHeaders + csvRows;

  // Write CSV to a file
  fs.writeFileSync('beauty_product_reviews_with_price.csv', csvContent, 'utf8');

  console.log('Data written to amazon_product_reviews_with_price.csv');

  // Close the browser
  await browser.close();
})();
