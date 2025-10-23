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
  
  console.log(`Attempting to serve file: ${filePath}`);
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.log(`Error serving file ${filePath}:`, err.message);
      if (err.code === 'ENOENT') {
        // If file not found and it's not index.html, try serving index.html (SPA fallback)
        if (!filePath.endsWith('index.html')) {
          const indexPath = path.join(__dirname, 'public', 'index.html');
          console.log(`Fallback to index.html: ${indexPath}`);
          serveStaticFile(indexPath, res);
          return;
        }
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head><title>404 - Not Found</title></head>
          <body>
            <h1>404 - File Not Found</h1>
            <p>The requested file could not be found.</p>
            <p>Requested path: ${filePath}</p>
            <p>Working directory: ${__dirname}</p>
            <a href="/">Go to Home</a>
          </body>
          </html>
        `);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error: ' + err.message);
      }
    } else {
      console.log(`Successfully serving file: ${filePath}`);
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

  // Application info endpoint
  if (pathname === '/api' && method === 'GET') {
    sendJSON(res, 200, {
      name: 'EFS Module 2 Web Application',
      version: '1.0.0',
      type: 'web-application',
      environment: process.env.NODE_ENV || 'development',
      runtime: 'Node.js ' + process.version,
      platform: 'Azure App Service',
      endpoints: {
        health: '/health',
        status: '/api/status',
        info: '/api'
      }
    });
    return;
  }

  // API status endpoint
  if (pathname === '/api/status' && method === 'GET') {
    const publicPath = path.join(__dirname, 'public');
    const indexPath = path.join(publicPath, 'index.html');
    
    sendJSON(res, 200, {
      status: 'running',
      node_version: process.version,
      platform: process.platform,
      memory_usage: process.memoryUsage(),
      paths: {
        __dirname: __dirname,
        publicPath: publicPath,
        indexPath: indexPath,
        indexExists: fs.existsSync(indexPath)
      }
    });
    return;
  }

  // Root route - serve HTML page by default, JSON only for explicit API requests
  if (pathname === '/' && method === 'GET') {
    const acceptHeader = req.headers.accept || '';
    const userAgent = req.headers['user-agent'] || '';
    
    // Only serve JSON if explicitly requested via query parameter or specific API request
    if (parsedUrl.query.format === 'json' || pathname === '/api') {
      sendJSON(res, 200, {
        name: 'EFS Module 2 Web Application',
        version: '1.0.0',
        type: 'web-application',
        environment: process.env.NODE_ENV || 'development'
      });
    } else {
      // Always serve the HTML page for browser requests
      const filePath = path.join(__dirname, 'public', 'index.html');
      serveStaticFile(filePath, res);
    }
    return;
  }

  // Serve static files from public directory
  if (method === 'GET') {
    let filePath;
    
    // Handle static file requests
    if (pathname.startsWith('/public/')) {
      filePath = path.join(__dirname, pathname);
    } else if (pathname !== '/' && pathname.includes('.')) {
      // For direct file requests (css, js, images)
      filePath = path.join(__dirname, 'public', pathname);
    } else {
      // For all other routes, serve index.html (SPA behavior)
      filePath = path.join(__dirname, 'public', 'index.html');
    }
    
    // Security check - prevent directory traversal
    const publicDir = path.join(__dirname, 'public');
    if (!filePath.startsWith(__dirname)) {
      sendJSON(res, 403, { error: 'Forbidden' });
      return;
    }
    
    serveStaticFile(filePath, res);
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
  console.log(`Working directory: ${__dirname}`);
  console.log(`Public directory: ${path.join(__dirname, 'public')}`);
  
  // Check if index.html exists
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log(`✅ index.html found at: ${indexPath}`);
  } else {
    console.log(`❌ index.html NOT found at: ${indexPath}`);
    // List files in directory
    try {
      const files = fs.readdirSync(__dirname);
      console.log('Files in root directory:', files);
      if (fs.existsSync(path.join(__dirname, 'public'))) {
        const publicFiles = fs.readdirSync(path.join(__dirname, 'public'));
        console.log('Files in public directory:', publicFiles);
      }
    } catch (err) {
      console.log('Error listing files:', err.message);
    }
  }
  
  console.log(`Access the application at: http://localhost:${port}`);
});