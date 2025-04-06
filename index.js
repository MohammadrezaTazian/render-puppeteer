const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cors = require('cors');

puppeteer.use(StealthPlugin());
const app = express();

// Middlewareهای ضروری
app.use(cors());
app.use(express.json());

// Endpoint اصلی
app.post('/scrape', async (req, res) => {
  const { url } = req.body;
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--lang=fa-IR'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // شبیه‌سازی مرورگر انسانی
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'accept-language': 'fa-IR,fa;q=0.9'
    });

    // رفتن به صفحه با تایم‌اوت طولانی
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 120000
    });

    // استخراج داده
    const data = {
      title: await page.title(),
      content: await page.content()
    };

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await browser.close();
  }
});

// تنظیمات پورت با بایند 0.0.0.0
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});