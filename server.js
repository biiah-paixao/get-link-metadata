/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');

const app = express();
const port = 4000;

app.use(cors()); // Adicione essa linha para habilitar o CORS

app.get('/metadata', async (req, res) => {
  const { url } = req.query;

  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    const title = await $('title').text();
    const description = $('meta[name="description"]').attr('content');

    const favicon = () => {
      const faviconHref = $('link[rel~="icon"]').attr('href');
      const ultimoCaractere = url.charAt(url.length - 1);
      if (!faviconHref?.startsWith('/')) return faviconHref;

      if (ultimoCaractere == '/') {
        return url.substring(0, url.length - 1) + faviconHref;
      } else {
        return url + faviconHref;
      }
    };

    const image = $('meta[property="og:image"]').attr('content');

    const metadata = {
      title: title || '', // Set default value as empty string
      description: description || '', // Set default value as empty string
      favicon: favicon() || '', // Set default value as empty string
      image: image || '', // Set default value as empty string
      url,
    };

    res.json(metadata);
  } catch (error) {
    // console.error('Erro ao buscar os metadados:', error);
    res.json({ url, error: 'Erro ao buscar os metadados' });
  }
});

app.listen(port, () => {
  console.log(`Servidor proxy escutando na porta ${port}`);
});
