const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

const port = process.env.PORT || 3000;

// MIME types for static files
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

// Security headers
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval'"
};

// Helper function to serve static files
function serveStaticFile(filePath, res) {
  const extname = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error');
      }
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        ...securityHeaders
      });
      res.end(content);
    }
  });
}

// Helper function to send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...securityHeaders
  });
  res.end(JSON.stringify(data, null, 2));
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // Health check endpoint for Azure
  if (pathname === '/health' && method === 'GET') {
    sendJSON(res, 200, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
    return;
  }

  // API status endpoint
  if (pathname === '/api/status' && method === 'GET') {
    sendJSON(res, 200, {
      status: 'running',
      node_version: process.version,
      platform: process.platform,
      memory_usage: process.memoryUsage()
    });
    return;
  }

  // Root route - serve API info or redirect to static file
  if (pathname === '/' && method === 'GET') {
    const acceptHeader = req.headers.accept || '';
    
    if (acceptHeader.includes('application/json')) {
      sendJSON(res, 200, {
        message: 'Welcome to EFS Module 2 Development API',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      });
    } else {
      // Serve index.html
      const filePath = path.join(__dirname, 'public', 'index.html');
      serveStaticFile(filePath, res);
    }
    return;
  }

  // Serve static files from public directory
  if (method === 'GET') {
    const filePath = path.join(__dirname, 'public', pathname);
    
    // Security check - prevent directory traversal
    if (!filePath.startsWith(path.join(__dirname, 'public'))) {
      sendJSON(res, 403, { error: 'Forbidden' });
      return;
    }
    
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        sendJSON(res, 404, {
          error: 'Route not found',
          path: pathname
        });
      } else {
        serveStaticFile(filePath, res);
      }
    });
    return;
  }

  // Handle other methods
  sendJSON(res, 405, { error: 'Method not allowed' });
});

// Error handling
server.on('error', (err) => {
  console.error('Server error:', err);
});

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Node version: ${process.version}`);
  console.log(`Access the application at: http://localhost:${port}`);
});