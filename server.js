const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:", "data:"]
    }
  }
}));

// CORS middleware
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  // Serve the EFS Module 2 homepage
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Authentication routes (Azure AD integration)
app.get('/signin', (req, res) => {
  // Redirect to Azure AD login
  res.redirect('/.auth/login/aad');
});

app.get('/create-account', (req, res) => {
  // Redirect to Azure AD login (same as sign in for Azure AD)
  res.redirect('/.auth/login/aad');
});

app.get('/signout', (req, res) => {
  // Redirect to Azure AD logout
  res.redirect('/.auth/logout');
});

// Profile page route
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Health check endpoint for Azure
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    message: 'Welcome to EFS Module 2 Development Server',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    node_version: process.version,
    platform: process.platform,
    memory_usage: process.memoryUsage()
  });
});

// Application info endpoint
app.get('/api', (req, res) => {
  res.json({
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
});

// API endpoint to check authentication status
app.get('/api/auth/status', (req, res) => {
  try {
    console.log('Auth status check - Headers received:');
    console.log('x-ms-client-principal:', req.headers['x-ms-client-principal'] ? 'Present' : 'Not present');
    console.log('x-ms-client-principal-idp:', req.headers['x-ms-client-principal-idp']);
    console.log('x-ms-client-principal-name:', req.headers['x-ms-client-principal-name']);
    
    const clientPrincipal = req.headers['x-ms-client-principal'];
    const clientPrincipalIdp = req.headers['x-ms-client-principal-idp'];
    const clientPrincipalName = req.headers['x-ms-client-principal-name'];
    
    if (clientPrincipal) {
      const decoded = Buffer.from(clientPrincipal, 'base64').toString('ascii');
      const userInfo = JSON.parse(decoded);
      
      console.log('Decoded user info:', userInfo);
      
      const response = {
        authenticated: true,
        user: {
          id: userInfo.userId || userInfo.sid,
          name: userInfo.userDetails || clientPrincipalName,
          email: userInfo.claims?.find(c => c.typ === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress')?.val,
          provider: clientPrincipalIdp || 'aad'
        }
      };
      
      console.log('Sending authenticated response:', response);
      res.json(response);
    } else {
      console.log('No authentication headers found, sending unauthenticated response');
      res.json({
        authenticated: false,
        user: null
      });
    }
  } catch (error) {
    console.error('Auth status error:', error);
    res.status(500).json({ 
      error: 'Failed to check authentication status',
      authenticated: false 
    });
  }
});

// Database health check
app.get('/api/database/health', async (req, res) => {
  try {
    // Placeholder for database health check
    res.json({
      success: true,
      message: 'Database configuration loaded',
      configured: !!process.env.DATABASE_SERVER,
      server: process.env.DATABASE_SERVER ? 'configured' : 'not configured',
      database: process.env.DATABASE_NAME ? 'configured' : 'not configured'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database health check failed',
      error: error.message
    });
  }
});

// User profile endpoint (placeholder for Azure AD integration)
app.get('/api/user/profile', (req, res) => {
  // In a real implementation, this would get user info from Azure AD
  res.json({
    authenticated: false,
    message: 'User authentication not configured',
    user: null
  });
});

// System information endpoint
app.get('/api/system/info', (req, res) => {
  res.json({
    name: process.env.APP_NAME || 'EFS Module 2 Development Portal',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
    uptime: Math.floor(process.uptime()),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
    features: {
      authentication: 'Azure AD (configured)',
      database: 'SQL Server (configured)',
      session: 'Express Session',
      security: 'Helmet + CORS'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler - SPA fallback
app.use('*', (req, res) => {
  // For API routes, return JSON 404
  if (req.originalUrl.startsWith('/api/')) {
    res.status(404).json({
      error: 'API route not found',
      path: req.originalUrl
    });
  } else {
    // For all other routes, serve the main HTML page (SPA behavior)
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// Start server
app.listen(port, () => {
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
  }
  
  console.log(`Access the application at: http://localhost:${port}`);
});