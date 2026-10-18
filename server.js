const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function loadCoffeeData() {
  const source = fs.readFileSync(path.join(ROOT, 'data', 'data.js'), 'utf8');
  const json = source.replace(/^\s*window\.COFFEE_DATA\s*=\s*/, '').replace(/;\s*$/, '');
  return JSON.parse(json);
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  if (request.method !== 'GET') {
    response.writeHead(405, { Allow: 'GET' }).end('Method not allowed');
    return;
  }

  if (url.pathname === '/api/data') {
    try {
      const data = JSON.stringify(loadCoffeeData());
      response.writeHead(200, {
        'Content-Type': MIME_TYPES['.json'],
        'Cache-Control': 'no-store',
      }).end(data);
    } catch (error) {
      console.error('Could not load coffee data:', error.message);
      response.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
        .end(JSON.stringify({ error: 'Could not load coffee data' }));
    }
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    response.writeHead(400).end('Invalid URL');
    return;
  }

  if (pathname === '/') pathname = '/index.html';
  const filePath = path.resolve(ROOT, `.${pathname}`);
  if (filePath !== ROOT && !filePath.startsWith(`${ROOT}${path.sep}`)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
      return;
    }

    response.writeHead(200, {
      'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Content-Length': stats.size,
      'X-Content-Type-Options': 'nosniff',
    });
    fs.createReadStream(filePath).pipe(response);
  });
});

function listenOnAvailablePort(port) {
  const onError = error => {
    server.removeListener('listening', onListening);
    if (error.code === 'EADDRINUSE' && port < PORT + 20) {
      console.warn(`Port ${port} is busy; trying ${port + 1}...`);
      listenOnAvailablePort(port + 1);
      return;
    }
    throw error;
  };
  const onListening = () => {
    server.removeListener('error', onError);
    console.log(`Coffee Guide is running at http://localhost:${port}`);
  };
  server.once('error', onError);
  server.once('listening', onListening);
  server.listen(port, '127.0.0.1');
}

listenOnAvailablePort(PORT);
