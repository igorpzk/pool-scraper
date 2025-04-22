import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/scrape', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("URL obrigatória");

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h2')).map(el => el.innerText.trim());
    });

    await browser.close();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Scraper está rodando! Use /scrape?url=https://...')
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
