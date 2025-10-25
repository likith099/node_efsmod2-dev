# EFSMOD Early Learning Family Portal

Node.js 22 LTS web application powering the EFSMOD Early Learning Family Portal, designed for Azure App Service deployment with a responsive landing page and authenticated profile experience.

## Features

- **Express.js** web server with secure defaults (Helmet, CORS, body parsing)
- **EFSMOD branded UI** served from `/public/efsmod.html` with shared `portal.css`
- **Profile dashboard** at `/profile` backed by Microsoft Graph enrichment and an intake form endpoint
- **Health and status endpoints** for operational monitoring (`/health`, `/api/status`)
- **Azure-ready configuration** including `web.config`, Node.js 22 engine pinning, and MSSQL helper utilities

## Prerequisites

- Node.js 22 LTS
- npm package manager

## Getting Started

```bash
npm install
npm run dev   # start with nodemon
# or
npm start     # run with node
```

The site is available at <http://localhost:3000>. The development home page (`/index.html`) links directly to the landing page and profile dashboard for quick navigation.

### Environment Variables

Create a `.env` file in the project root as needed:

```
NODE_ENV=development
PORT=3000
SQL_SERVER=<optional-sql-host>
SQL_CONNECTION_STRING=<optional-azure-sql-connection-string>
```

> The SQL variables are only required when enabling the intake form persistence via Azure SQL.

## Key Routes

- `GET /` → Serves `public/efsmod.html` (landing page)
- `GET /profile` → EFSMOD profile dashboard
- `GET /api/profile` → Returns the authenticated user's profile (AAD + Microsoft Graph)
- `POST /api/intake` → Persists intake form payload (requires SQL configuration)
- `GET /api/status` → JSON status heartbeat
- `GET /health` → Lightweight health probe for Azure App Service

Static assets, styles, and scripts are delivered from the `public/` directory.

## Azure App Service Deployment

1. Create an Azure App Service using the Node.js 22 LTS runtime.
2. Configure application settings:
   - `NODE_ENV=production`
   - `WEBSITE_NODE_DEFAULT_VERSION=22-lts`
   - Any SQL connection variables if using the intake form persistence.
3. Deploy the project (Git, Azure DevOps, VS Code, or GitHub Actions). The default startup command is `npm start`.

## Project Structure

```
node_efsmod2-dev/
├── .github/
│   └── copilot-instructions.md
├── public/
│   ├── css/
│   │   └── portal.css
│   ├── images/
│   ├── js/
│   │   └── profile.js
│   ├── efsmod.html
│   ├── index.html
│   └── profile.html
├── app.js
├── package.json
├── web.config
└── README.md
```

## Scripts

- `npm start` – Launch the Express server (production mode)
- `npm run dev` – Start the server with nodemon for live reload
- `npm test` – Placeholder script (no automated tests yet)

## License

MIT