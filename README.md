# EFSMOD2 Early Learning Family Portal (Web Experience)

A Node.js 22 LTS **web application** that recreates the Early Learning Family Portal look and feel for Azure App Service. This project focuses on serving rich HTML content, Azure AD authentication hand-offs, and friendly status/error pages&mdash;no API surface is exposed.

## ✨ Highlights
- **Express.js web server** with security headers (Helmet) and Azure-friendly middleware
- **Static site delivery** of the EFSMOD2 landing page plus branded status/404/500 pages
- **Azure AD integration links** for sign-in, sign-out, and account creation flows
- **Tenant-aware auth helpers** with lightweight `/api/auth/status` and `/api/profile`
- **Azure App Service ready**: `/health` text probe and `status.html` for human checks
- **Responsive design** inspired by Florida's Early Learning Family Portal

## 🗂️ Project Structure
```
node_efsmod2-dev/
├── app.js                 # Express web server entry point
├── package.json           # Node.js 22 runtime + scripts
├── web.config             # Azure App Service configuration
├── public/
│   ├── efsmod.html        # Main landing page
│   ├── status.html        # Human-readable status page
│   ├── 404.html           # Branded not-found page
│   ├── 500.html           # Branded error page
│   └── assets (images)
└── README.md              # This guide
```

## 🚀 Getting Started

### Prerequisites
- Node.js **22.x** (matching Azure App Service Node 22 LTS)
- npm (bundled with Node.js)
- Optional configuration:
	- `AZURE_AD_CLIENT_ID` (defaults to `84b2dfe9-f72d-4f93-a55d-08e5735bf2a5`)
	- `AZURE_AD_TENANT_ID` to pin a specific Azure AD tenant (defaults to `common`)
	- `AZURE_AD_SCOPES` to customize requested OAuth scopes (`openid profile email offline_access`)
	- `AZURE_AD_REDIRECT_PATH` if you host the callback somewhere other than `/auth/callback`

### Install & Run Locally
```pwsh
npm install
npm run dev
```
Visit `http://localhost:3000` to load the EFSMOD2 landing page.

### Production Run (local)
```pwsh
npm start
```

## 🔐 Authentication Links
The application relies on Azure App Service authentication plus direct Azure AD authorization when needed. Routes of interest:

- `GET /signin` → Redirects to the Microsoft login page using `AZURE_AD_CLIENT_ID`. Pass `?tenant=<tenantId>` to override the default tenant (falls back to `AZURE_AD_TENANT_ID` or `common`). Optional query parameters `prompt`, `state`, and `login_hint` are forwarded to Microsoft.
- `GET /create-account` → Matches `/signin` behavior for convenience.
- `GET /signout` → Forwards to the built-in `/.auth/logout` endpoint.
- `GET /auth/callback` → Callback view that now confirms your session status by querying `/api/auth/status`.

### Authentication APIs
- `GET /api/auth/status` → Returns `{ authenticated: boolean, user?: {...} }` by calling Azure App Service's `/.auth/me` endpoint.
- `GET /api/profile` → Returns `{ authenticated: true, profile, claims }` with the raw claims provided by Azure AD. Responds with HTTP 401 when no session is present.

These minimal APIs are designed for client-side experiences (e.g., updating the portal header) and mirror the behavior in the reference sample app.

## 🏥 Health & Status
- `GET /health` returns plain text `healthy` for Azure health probes.
- `GET /status` renders a friendly HTML summary for manual checks.

## 🛡️ Error Handling
- Unknown routes fall back to the themed `404.html` page.
- Unhandled errors render `500.html` with user guidance.

## ☁️ Deploying to Azure App Service
1. Create an App Service (Linux or Windows) targeting Node.js 22 LTS.
2. Set `WEBSITE_NODE_DEFAULT_VERSION=~22` and any required Azure AD settings.
3. Deploy the repository (Git, VS Code, or GitHub Actions).
4. Configure Azure App Service Authentication if you need managed sign-in.

## 📄 License
This project is part of the EFSMOD2 initiative for the Florida Department of Education.

---

Built for a seamless **web** experience with just enough auth-aware APIs for Azure integrations.