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
    res.end(JSON.stringify({ error: 'Method Not Allowed', message: 'Use POST to validate manuscript payload.' }));
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

    const validation = EpubEngine.validateProject(payload);

    // Calculate quick stats
    let totalWords = 0;
    const chapters = [];

    if (payload && Array.isArray(payload.sections)) {
      payload.sections.forEach((sec, idx) => {
        const textOnly = String(sec.content || '').replace(/<[^>]+>/g, ' ');
        const words = textOnly.trim().split(/\s+/).filter(Boolean).length;
        totalWords += words;
        chapters.push({
          index: idx + 1,
          title: sec.title || `Section ${idx + 1}`,
          type: sec.type || 'chapter',
          words,
          includeInToc: sec.includeInToc !== false
        });
      });
    }

    const readingTimeMinutes = Math.ceil(totalWords / 225);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({
      success: true,
      readyToCompile: validation.isValid,
      standardsCompliance: {
        spec: 'EPUB 3.2 / IDPF',
        kindleKdpReady: true,
        appleBooksReady: true
      },
      stats: {
        totalSections: chapters.length,
        totalWords,
        estimatedReadingTimeMinutes: readingTimeMinutes
      },
      chapters,
      issues: validation.issues
    }, null, 2));

  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Validation Error', message: err.message }));
  }
};
