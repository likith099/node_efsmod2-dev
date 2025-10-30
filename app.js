const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));
// Serve the downloaded assets folder used by the landing page
app.use('/Early Learning Family Portal_ Home_files', express.static(path.join(__dirname, 'Early Learning Family Portal_ Home_files')));

// Favicon (no content)
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Root -> landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check (useful for Azure or load balancer probes)
app.get('/healthz', (req, res) => res.status(200).send('OK'));

// Basic error handler - logs error and returns 500 for unhandled errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  res.status(500).send('Internal Server Error');
});

// Crash handlers to capture startup/runtime exceptions in logs
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err && err.stack ? err.stack : err);
  // Note: do not attempt complex async work here; let process exit/restart if needed.
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection at Promise:', reason);
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});