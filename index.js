const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/", (req, res) => {
  res.send("👋 Puppeteer API is running. Use /screenshot?url=https://example.com");
});

app.get("/screenshot", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("❌ Please provide a URL: /screenshot?url=https://example.com");

  try {
    const browser = await puppeteer.launch({
      headless: "new", // important for newer versions
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });
    const screenshot = await page.screenshot({ encoding: "base64", fullPage: true });
    await browser.close();

    res.set("Content-Type", "image/png");
    res.send(Buffer.from(screenshot, "base64"));
  } catch (err) {
    console.error("Error taking screenshot:", err);
    res.status(500).send("⚠️ Error taking screenshot");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Puppeteer API running on port ${PORT}`);
});
