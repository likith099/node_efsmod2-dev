# EFS Module 2 Development

A Node.js 22 LTS web application optimized for Azure App Service deployment.

## Features

- **Express.js Framework**: Fast, unopinionated web framework
- **Security**: Helmet.js for security headers
- **CORS**: Cross-Origin Resource Sharing enabled
- **Compression**: Gzip compression middleware
- **Health Checks**: Built-in health endpoint for monitoring
- **Azure Optimized**: Configured for Azure App Service deployment

## Project Structure

```
efsmod2-dev/
├── .github/
│   └── copilot-instructions.md
├── public/
│   └── index.html
├── server.js              # Main application file
├── package.json           # Dependencies and scripts
├── web.config            # IIS/Azure configuration
├── app.yaml              # Azure App Service config
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js 22.x LTS
- npm (comes with Node.js)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Start production server:
   ```bash
   npm start
   ```

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests (placeholder)

## API Endpoints

- `GET /` - Welcome message and API information
- `GET /health` - Health check endpoint for monitoring
- `GET /api/status` - Server status and system information

## Environment Variables

The application uses the following environment variables:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

## Azure Deployment

This project is configured for Azure App Service with:

- **Runtime**: Node.js 22.x LTS
- **Web.config**: IIS configuration for Azure
- **Health Checks**: `/health` endpoint for Azure monitoring
- **Compression**: Enabled for better performance
- **Security**: Helmet.js security headers

### Deployment Steps

1. Create an Azure App Service with Node.js 22 LTS runtime
2. Configure deployment source (GitHub, Azure DevOps, etc.)
3. Set environment variables in Azure portal
4. Deploy the application

## Development

### Adding New Routes

Add routes in `server.js`:

```javascript
app.get('/api/new-endpoint', (req, res) => {
  res.json({ message: 'New endpoint' });
});
```

### Static Files

Place static files in the `public/` directory. They will be served automatically.

### Environment Configuration

Create a `.env` file for local development:

```env
NODE_ENV=development
PORT=3000
```

## Monitoring

The application includes built-in monitoring endpoints:

- `/health` - Basic health check
- `/api/status` - Detailed system information

## License

ISC License