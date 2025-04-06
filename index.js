const express = require('express');
const puppeteer = require('puppeteer');
const compression = require('compression');

const app = express();
app.use(express.json());
app.use(compression()); // فشرده‌سازی پاسخ

app.post('/scrape', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--enable-features=NetworkService',
        '--js-flags="--max-old-space-size=512"'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
    });

    const page = await browser.newPage();
    
    // بهینه‌سازی برای صفحات بزرگ
    await page.setCacheEnabled(false);
    await page.setJavaScriptEnabled(true);
    
    // تنظیمات پیشرفته برای Cloudflare
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
    });

    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 90000
    });

    const content = await page.content();
    const result = {
      title: await page.title(),
      content: content,
      length: content.length,
      status: 200
    };

    await browser.close();
    res.json(result);

  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 500
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});