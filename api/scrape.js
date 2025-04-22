import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "URL obrigatória" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Exemplo: pegar todos os <h2>
    const data = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h2')).map(h2 => h2.innerText.trim());
    });

    await browser.close();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
