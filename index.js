const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium'
  });

  try {
    const page = await browser.newPage();
    await page.goto('https://example.com', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('Title:', await page.title());
    await page.screenshot({ path: 'screenshot.png' });

  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});