module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({
    service: 'EpubCraft API',
    status: 'operational',
    version: '1.0.0',
    description: 'Headless EPUB 3 & Amazon KDP Compliant Document Compiler API',
    supportedStandards: [
      'EPUB 3.2 (IDPF / W3C)',
      'EPUB 2.0 Fallback (NCX Spine for Legacy Readers)',
      'Amazon Kindle Direct Publishing (KDP) Specification',
      'Apple Books Standard'
    ],
    endpoints: {
      compile: 'POST /v1/epub/compile',
      validate: 'POST /v1/epub/validate',
      sample: 'GET /v1/epub/sample.epub',
      themes: 'GET /v1/epub/themes',
      sandbox: 'POST /api/sandbox'
    },
    documentation: 'https://epub-craft-api.vercel.app',
    marketplace: 'https://rapidapi.com'
  }, null, 2));
};

