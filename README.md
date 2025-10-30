# FL WINS - Florida Workforce Innovation Network System

A modern, responsive web application for Florida's Workforce Innovation Network System, built with Node.js and Express.js for deployment on Azure App Service.

## Features

- **Express.js** framework for web server
- **Security** middleware with Helmet.js
- **CORS** support for cross-origin requests
- **Environment** configuration with dotenv
- **Health check** endpoint for monitoring
- **Static file** serving from public directory
- **Azure App Service** ready configuration

## Prerequisites

- Node.js 22 LTS
- npm or yarn package manager

## Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

### Local Development
```bash
# Start development server with nodemon
npm run dev

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

### Environment Variables

Create a `.env` file in the project root with the following variables:
```
NODE_ENV=development
PORT=3000
```

## API Endpoints

- `GET /` - Main API endpoint with server information
- `GET /health` - Health check endpoint
- Static files served from `/public` directory

## Azure App Service Deployment (Windows)

This application is configured for Azure Windows App Service with:

- Runtime: Node.js 22 LTS
- Windows + IIS + iisnode via `web.config`
- Package.json pins Node 22.x
- Express serves `public/index.html` at `/`

### Deployment Steps

1. Create an Azure App Service (Windows) with Node.js 22 runtime
2. Configure Application Settings:
   - `NODE_ENV=production`
   - `WEBSITE_NODE_DEFAULT_VERSION=22-lts`
3. Deploy (Git, VS Code, or GitHub Actions)
4. Browse the site root `/` → should render `public/index.html`

### Health checks

- `GET /health` returns a simple JSON for availability checks
- `GET /api/status` returns app information

### Database (optional / currently disabled)

- This project deploys without any database requirement.
- DB integration is optional and guarded at runtime; `/api/intake` returns `501` unless DB module and SQL settings are present.
- You can later add DB by supplying `SQL_CONNECTION_STRING` (or `SQL_SERVER` + credentials) and a `config/database` module exporting `ensureIntakeTable` and `upsertIntakeForm`.

## Project Structure

```
flwins2-dev/
├── .github/
│   └── copilot-instructions.md
├── .vscode/
│   └── launch.json
├── public/
│   └── index.html
├── .env
├── .gitignore
├── app.js
├── package.json
├── web.config
└── README.md
```

## Scripts

- `npm start` - Start the application
- `npm run dev` - Start with nodemon for development
- `npm test` - Run tests (not implemented yet)

## License

MIT