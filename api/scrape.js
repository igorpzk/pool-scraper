import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "URL obrigatória" });

  let browser = null;

  try {
    const executablePath = await chromium.executablePath || '/usr/bin/chromium-browser';
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h2')).map(el => el.innerText.trim());
    });

    res.status(200).json(data);
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
}
