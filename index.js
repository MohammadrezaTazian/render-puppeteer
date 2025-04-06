const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/scrape', async (req, res) => {
  if (!req.body.url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process',
      '--no-zygote',
      '--disable-gpu'
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
  });

  try {
    const page = await browser.newPage();
    
    // بهینه‌سازی برای مصرف کمتر منابع
    await page.setRequestInterception(true);
    page.on('request', req => {
      if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(req.body.url, {
      waitUntil: 'domcontentloaded',
      timeout: 45000
    });

    // استخراج داده با مدیریت خطا
    const content = await page.content();
    const result = {
      title: await page.title(),
      content: content.substring(0, 1000) + (content.length > 1000 ? '...' : '')
    };

    res.json(result);

  } catch (error) {
    res.status(500).json({
      error: error.message,
      advice: 'Try again later or contact support'
    });
  } finally {
    await browser.close();
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server ready on port ${PORT}`);
});