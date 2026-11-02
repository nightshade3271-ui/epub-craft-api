const EpubEngine = require('../lib/epubEngine.js');
const sampleBook = require('../lib/sampleBook.js');
const validateRapidApiSecret = require('../lib/auth.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-RapidAPI-Key, X-RapidAPI-Host, X-RapidAPI-Proxy-Secret');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (!validateRapidApiSecret(req)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Unauthorized access',
      message: 'This endpoint must be accessed through RapidAPI Marketplace.',
      marketplace: 'https://rapidapi.com'
    }));
    return;
  }

  try {
    const result = await EpubEngine.compile(sampleBook);

    if (req.query && req.query.format === 'json') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({
        success: true,
        filename: result.filename,
        sizeBytes: result.sizeBytes,
        base64: result.buffer.toString('base64'),
        validation: result.validation
      }, null, 2));
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/epub+zip');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.setHeader('Content-Length', result.buffer.length);
    res.end(result.buffer);

  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Sample Generation Failed', message: err.message }));
  }
};

