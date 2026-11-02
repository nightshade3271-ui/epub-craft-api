const EpubEngine = require('../lib/epubEngine.js');
const validateRapidApiSecret = require('../lib/auth.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-RapidAPI-Key, X-RapidAPI-Host, X-RapidAPI-Proxy-Secret');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed', message: 'Use POST with JSON book manuscript payload.' }));
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
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid JSON', message: 'Could not parse JSON body.' }));
        return;
      }
    }

    if (!payload || typeof payload !== 'object') {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Invalid Body', message: 'Payload must be a JSON object containing title and sections.' }));
      return;
    }

    const options = {
      theme: payload.theme,
      paragraphStyle: payload.paragraphStyle,
      coverPreset: payload.coverPreset,
      customCss: payload.customCss
    };

    const result = await EpubEngine.compile(payload, options);

    const wantsJson = (req.query && (req.query.format === 'base64' || req.query.format === 'json')) ||
                      (payload.format === 'base64' || payload.format === 'json') ||
                      (req.headers['accept'] && req.headers['accept'].includes('application/json'));

    if (wantsJson) {
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

    // Default binary download
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/epub+zip');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.setHeader('Content-Length', result.buffer.length);
    res.end(result.buffer);

  } catch (err) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'EPUB Compilation Failed',
      message: err.message,
      issues: err.issues || []
    }));
  }
};

