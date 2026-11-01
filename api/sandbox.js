const EpubEngine = require('../lib/epubEngine.js');
const sampleBook = require('../lib/sampleBook.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    let payload = req.method === 'POST' ? req.body : sampleBook;

    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        payload = sampleBook;
      }
    }

    if (!payload || typeof payload !== 'object') {
      payload = sampleBook;
    }

    // Free sandbox safety limits
    if (Array.isArray(payload.sections) && payload.sections.length > 10) {
      payload.sections = payload.sections.slice(0, 10);
    }

    const options = {
      theme: payload.theme || 'theme-bookerly',
      paragraphStyle: payload.paragraphStyle || 'style-indented',
      coverPreset: payload.coverPreset || 'obsidian_gold',
      customCss: payload.customCss
    };

    const result = await EpubEngine.compile(payload, options);

    const wantsBinary = req.query && req.query.download === 'true';

    if (wantsBinary) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/epub+zip');
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.setHeader('Content-Length', result.buffer.length);
      res.end(result.buffer);
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({
      success: true,
      sandbox: true,
      notice: 'Compiled via free developer sandbox. For production limits and commercial volume, subscribe on RapidAPI.',
      filename: result.filename,
      sizeBytes: result.sizeBytes,
      base64: result.buffer.toString('base64'),
      validation: result.validation
    }, null, 2));

  } catch (err) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Sandbox Compilation Failed',
      message: err.message,
      issues: err.issues || []
    }));
  }
};
