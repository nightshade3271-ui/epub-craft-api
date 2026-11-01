const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const compileHandler = require('./api/compile.js');
const validateHandler = require('./api/validate.js');
const sampleHandler = require('./api/sample.js');
const themesHandler = require('./api/themes.js');
const sandboxHandler = require('./api/sandbox.js');
const indexHandler = require('./api/index.js');

const PORT = process.env.PORT || 3007;

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  req.query = Object.fromEntries(reqUrl.searchParams.entries());
  const pathname = reqUrl.pathname;

  // Buffer incoming JSON body for POST
  if (req.method === 'POST') {
    let bodyStr = '';
    req.on('data', chunk => {
      bodyStr += chunk;
    });
    await new Promise(resolve => req.on('end', resolve));
    try {
      req.body = bodyStr ? JSON.parse(bodyStr) : {};
    } catch (e) {
      req.body = bodyStr;
    }
  }

  // Routing
  if (pathname === '/v1/epub/compile' || pathname === '/api/compile') {
    return compileHandler(req, res);
  }
  if (pathname === '/v1/epub/validate' || pathname === '/api/validate') {
    return validateHandler(req, res);
  }
  if (pathname === '/v1/epub/sample.epub' || pathname === '/v1/epub/sample' || pathname === '/api/sample') {
    return sampleHandler(req, res);
  }
  if (pathname === '/v1/epub/themes' || pathname === '/api/themes') {
    return themesHandler(req, res);
  }
  if (pathname === '/api/sandbox') {
    return sandboxHandler(req, res);
  }
  if (pathname === '/v1/status' || pathname === '/api/status') {
    return indexHandler(req, res);
  }

  // Static files in public/
  let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found', path: pathname }));
});

server.listen(PORT, () => {
  console.log(`🚀 EpubCraft API Server running at http://localhost:${PORT}`);
});
