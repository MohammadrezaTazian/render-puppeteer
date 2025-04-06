const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

app.post('/scrape', async (req, res) => {
  const { url } = req.body;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--lang=fa-IR'
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium'
  });

  try {
    const page = await browser.newPage();
    
    // تنظیمات شبیه‌سازی مرورگر
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'accept-language': 'fa-IR,fa;q=0.9'
    });

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    const data = {
      title: await page.title(),
      content: await page.content().slice(0, 1000) + '...'
    };

    res.json({ success: true, data });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message
    });
  } finally {
    await browser.close();
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});