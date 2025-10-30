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

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});