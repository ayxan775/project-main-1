// Simple server script to serve the static Next.js export
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4000;
const DIST_FOLDER = path.join(__dirname, 'out');

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.url}`);
  
  // Handle root URL
  let filePath = req.url === '/' 
    ? path.join(DIST_FOLDER, 'index.html')
    : path.join(DIST_FOLDER, req.url);
  
  // Remove query parameters
  filePath = filePath.split('?')[0];
  
  // Extract file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  
  // Set default content type to text/html
  let contentType = MIME_TYPES[extname] || 'text/html';
  
  // Handle routing for SPA (client-side routing)
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If file doesn't exist, try serving index.html (for SPA routes)
      if (extname === '') {
        // For routes like /about, /products, etc.
        const htmlFilePath = path.join(DIST_FOLDER, req.url, 'index.html');
        fs.access(htmlFilePath, fs.constants.F_OK, (err) => {
          if (err) {
            // If the HTML file doesn't exist either, serve the 404 page
            fs.readFile(path.join(DIST_FOLDER, '404.html'), (err, content) => {
              if (err) {
                res.writeHead(500);
                res.end('Error loading 404 page');
                return;
              }
              
              res.writeHead(404, { 'Content-Type': 'text/html' });
              res.end(content, 'utf-8');
            });
            return;
          }
          
          // Serve the HTML file for the route
          fs.readFile(htmlFilePath, (err, content) => {
            if (err) {
              res.writeHead(500);
              res.end(`Error loading ${htmlFilePath}`);
              return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          });
        });
        return;
      }
      
      // If it's not a route, serve the 404 page
      fs.readFile(path.join(DIST_FOLDER, '404.html'), (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading 404 page');
          return;
        }
        
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8');
      });
      return;
    }
    
    // Read and serve the file
    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'EISDIR') {
          // If it's a directory, try to serve index.html
          fs.readFile(path.join(filePath, 'index.html'), (err, content) => {
            if (err) {
              res.writeHead(500);
              res.end(`Error loading index.html from ${filePath}`);
              return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          });
          return;
        }
        
        res.writeHead(500);
        res.end(`Error loading ${filePath}`);
        return;
      }
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Serving static files from: ${DIST_FOLDER}`);
}); 