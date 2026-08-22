const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = path.join(__dirname, 'public');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url);

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      // File exists, serve it
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end('Server Error');
          return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      });
    } else {
      // File doesn't exist, serve index.html (SPA fallback)
      fs.readFile(path.join(ROOT, 'index.html'), (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end('Server Error');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8');
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
  console.log('Routes to test:');
  console.log('  - http://localhost:3000/');
  console.log('  - http://localhost:3000/about');
  console.log('  - http://localhost:3000/coin/bitcoin');
  console.log('  - http://localhost:3000/chart');
});
