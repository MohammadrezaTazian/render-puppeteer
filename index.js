const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.goto('https://example.com');
  console.log('Title:', await page.title());
  
  await browser.close();
}

run();