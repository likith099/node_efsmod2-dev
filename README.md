# EFSMOD Portal - Node.js Web Application

Node.js 22 LTS web application powering the EFSMOD Portal, designed for Azure App Service deployment with a modern, responsive interface and comprehensive service access.

## 🚀 Project Overview

This project provides a comprehensive portal interface for EFSMOD (Educational and Family Services Management and Operations Database), featuring:

- **Modern UI/UX**: Clean, accessible design inspired by Florida's Early Learning Portal
- **Responsive Design**: Mobile-first approach with full tablet and desktop support
- **Azure Integration**: Built for Azure App Service with Easy Auth support
- **Security**: Helmet.js, CORS, and secure session management
- **Database Ready**: MSSQL integration for data persistence

## 📁 Project Structure

```
efsmod2-dev/
├── .github/
│   └── copilot-instructions.md    # Development guidelines
├── public/                         # Static assets and client-side files
│   ├── css/                        # Stylesheets
│   │   ├── flwins-styles.css          # Core FL design system
│   │   ├── flwins-components.css      # Reusable UI components
│   │   ├── portal.css                 # Portal-specific styles
│   │   └── efsmod-home.css            # Home page styles
│   ├── js/                         # JavaScript files
│   │   ├── flwins-main.js             # Main FL utilities
│   │   ├── portal-nav.js              # Navigation logic
│   │   ├── efsmod-home.js             # Home page functionality
│   │   └── profile.js                 # User profile handling
│   ├── images/                     # Image assets
│   │   └── README.md                  # Image requirements guide
│   ├── home.html                   # Main landing page (NEW - EFSMOD themed)
│   ├── efsmod.html                 # Original EFSMOD page
│   ├── flwins.html                 # FLWINS reference page
│   ├── index.html                  # Development dashboard
│   ├── profile.html                # User profile page
│   └── logout.html                 # Logout confirmation
├── config/                         # Configuration files
│   └── database.js                 # Database connection & schema
├── app.js                          # Main Express application
├── package.json                    # Node dependencies
├── web.config                      # IIS/Azure configuration
└── README.md                       # This file
```

## 🎨 Design System

### Color Palette

The EFSMOD portal uses a specific color scheme:

- **Primary Blue**: `#01689B` - Primary actions, links, and Service Application section
- **Red**: `#AE0C06` - Resource & Referral section
- **Green**: `#248641` - Program Enrollment section
- **Text Primary**: `#2D2D2D` - Main text color
- **Text Secondary**: `#4B4B4B` - Secondary text
- **Border**: `#D2D2D2` - Borders and dividers
- **Background**: `#F8F7F5` - Alternate backgrounds

### Typography

- **Font Family**: System fonts (Arial, Helvetica, sans-serif)
- **Font Sizes**: 
  - Mobile: 14px base
  - Desktop: 18px base
  - Headers: 20px - 32px

### Key Components

- **Navigation**: Fixed header with responsive Sign In/Sign Up buttons
- **Hero Section**: Large banner with welcome message and sign-in CTA
- **Service Cards**: Three-column grid with colored headers and action buttons
- **Modals**: Accessible modal dialogs for Sign Up flow
- **Forms**: Styled inputs with validation and masking support
- **Footer**: Informational links and browser recommendations

## Features

- **Express.js** web server with secure defaults (Helmet, CORS, body parsing)
- **EFSMOD Portal UI** - Modern landing page served from `/` (home.html)
- **Profile dashboard** at `/profile` backed by Microsoft Graph enrichment
- **Intake form endpoint** at `/api/intake` with MSSQL persistence
- **Health and status endpoints** for operational monitoring (`/health`, `/api/status`)
- **Azure AD Authentication** via Easy Auth (`/signin`, `/signout`, `/create-account`)
- **Session Management** with idle timeout warnings
- **Google Analytics** integration for tracking
- **Accessibility Features**: ARIA labels, keyboard navigation, screen reader support

## Prerequisites

- Node.js 22 LTS
- npm package manager
- Azure account (for deployment)

## Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Or run in production mode
npm start
```

The site is available at <http://localhost:3000>. The home page now displays the EFSMOD Portal landing page with service cards and authentication options.

### Environment Variables

Create a `.env` file in the project root as needed:

```
NODE_ENV=development
PORT=3000
SQL_SERVER=<optional-sql-host>
SQL_DATABASE=<optional-database-name>
SQL_USER=<optional-username>
SQL_PASSWORD=<optional-password>
SQL_CONNECTION_STRING=<optional-azure-sql-connection-string>
```

> The SQL variables are only required when enabling the intake form persistence via Azure SQL.

## Key Routes

### Public Routes
- `GET /` → Serves `public/home.html` (EFSMOD Portal landing page)
- `GET /api/status` → JSON status heartbeat
- `GET /health` → Lightweight health probe for Azure App Service

### Authentication Routes
- `GET /signin` → Redirects to Azure AD login
- `GET /create-account` → Redirects to Azure AD signup
- `GET /signout` → Logs out and clears session

### Authenticated Routes
- `GET /profile` → EFSMOD profile dashboard
- `GET /api/profile` → Returns the authenticated user's profile (AAD + Microsoft Graph)
- `POST /api/intake` → Persists intake form payload (requires SQL configuration)

Static assets, styles, and scripts are delivered from the `public/` directory.

## 🚢 Azure App Service Deployment

### Quick Deploy

1. **Create App Service**
   ```bash
   az webapp create --resource-group <rg-name> --plan <plan-name> \
     --name <app-name> --runtime "NODE:22-lts"
   ```

2. **Configure Application Settings**
   ```bash
   az webapp config appsettings set --resource-group <rg-name> \
     --name <app-name> --settings \
     NODE_ENV=production \
     WEBSITE_NODE_DEFAULT_VERSION=22-lts
   ```

3. **Deploy Code**
   - Using Git: `git push azure master`
   - Using Azure CLI: `az webapp up --name <app-name>`
   - Using VS Code: Right-click → Deploy to Web App

### Configure Authentication (Optional)

To enable Azure AD authentication:

1. Navigate to Azure Portal → App Service → Authentication
2. Add identity provider → Microsoft
3. Set redirect URIs:
   - `https://<app-name>.azurewebsites.net/.auth/login/aad/callback`
4. Configure app to require authentication or allow anonymous (recommended for public landing page)

### Environment Configuration

In Azure Portal → Configuration → Application Settings, add:

- `NODE_ENV`: `production`
- `SQL_SERVER`: Your database server (if using intake forms)
- `SQL_DATABASE`: Your database name
- `SQL_USER`: Database username
- `SQL_PASSWORD`: Database password (use Key Vault in production)

## 📱 New Features in This Update

### Home Page (home.html)
- ✅ Modern, responsive landing page
- ✅ Hero section with welcome message
- ✅ Three service cards (Resource & Referral, Service Application, Program Enrollment)
- ✅ Sign In / Sign Up navigation
- ✅ Single Sign-On modal
- ✅ Informational footer
- ✅ Mobile-optimized design

### CSS Organization
- ✅ `efsmod-home.css` - Home page specific styles
- ✅ Form controls and validation styles
- ✅ Checkbox and radio button customization
- ✅ Responsive utilities and helpers
- ✅ Accessibility enhancements
- ✅ Print styles

### JavaScript Features
- ✅ `efsmod-home.js` - Home page functionality
- ✅ Modal management
- ✅ Idle timeout warnings
- ✅ Form input masking (phone, SSN, date)
- ✅ File upload handling
- ✅ Google Analytics event tracking
- ✅ Accessibility features

### Image Assets
- 📝 Placeholder structure for logos and hero image
- 📝 README guide for image requirements

## 🔧 Development

### Adding Images

Place the following images in `public/images/`:
- `logo.png` - Desktop logo (~200x40px)
- `logo-mobile.png` - Mobile logo (~120x30px)  
- `hero-image.jpg` - Hero banner (1920x500px)

See `public/images/README.md` for detailed guidelines.

### Modifying Styles

- Global styles: `public/css/flwins-styles.css`
- Component styles: `public/css/flwins-components.css`
- Portal styles: `public/css/portal.css`
- Home page styles: `public/css/efsmod-home.css`

### Customizing Content

Edit `public/home.html` to update:
- Service card titles and descriptions
- Links and URLs
- Footer information
- Modal content

## Scripts

- `npm start` – Launch the Express server (production mode)
- `npm run dev` – Start the server with nodemon for live reload
- `npm test` – Placeholder script (no automated tests yet)

## 📄 License

MIT