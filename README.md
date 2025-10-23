# EFS Module 2 Development Portal

A comprehensive Node.js 22 LTS web application for Azure App Service deployment with Azure Active Directory authentication, SQL Server database integration, and Early Learning Family Portal-inspired UI design.

## 🚀 Features

### Core Application
- **Express.js Web Server** - Robust server architecture with middleware support
- **Azure App Service Optimized** - Configured for seamless cloud deployment
- **Early Learning Portal UI** - Professional, responsive design with modern interface
- **Single Page Application** - Client-side routing with fallback support

### Authentication & Security
- **Azure Active Directory Integration** - Enterprise-grade authentication
- **User Profile Management** - Comprehensive user information handling
- **Security Middleware** - Helmet.js for security headers, CORS support
- **Session Management** - Express sessions with secure configuration

### Database Integration
- **SQL Server Support** - Full database connectivity with Azure SQL Database
- **Azure Managed Identity** - Secure database authentication without credentials
- **Connection Pooling** - Optimized database performance
- **Health Monitoring** - Database connection status tracking

### API Architecture
- **RESTful Endpoints** - Comprehensive API structure
- **Health Check System** - Multiple health monitoring endpoints
- **Error Handling** - Centralized error management
- **Logging Support** - Configurable logging levels

## 🛠️ Development Setup

### Prerequisites
- Node.js 22 LTS
- npm or yarn package manager
- Azure account (for deployment)
- SQL Server or Azure SQL Database (optional)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone [repository-url]
   cd efsmod2-dev
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env` file and update configuration:
   ```bash
   # Application Settings
   NODE_ENV=development
   PORT=3000
   APP_NAME=EFS Module 2 Development Portal
   
   # Azure AD Configuration
   AZURE_CLIENT_ID=your-azure-client-id
   AZURE_CLIENT_SECRET=your-azure-client-secret
   AZURE_TENANT_ID=your-azure-tenant-id
   
   # Database Configuration (optional)
   DATABASE_SERVER=your-server.database.windows.net
   DATABASE_NAME=EFS_Module2
   DATABASE_USERNAME=your-username
   DATABASE_PASSWORD=your-password
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Local: http://localhost:3000
   - Azure: https://your-app-name.azurewebsites.net

## 🏗️ Project Architecture

### Directory Structure
```
efsmod2-dev/
├── server.js              # Main Express application server
├── package.json           # Dependencies and npm scripts
├── web.config            # Azure App Service IIS configuration
├── .env                  # Environment variables (development)
├── config/
│   └── database.js       # Database configuration and connection manager
├── public/               # Static web assets
│   ├── index.html        # Main application page with authentication
│   ├── profile.html      # User profile page
│   ├── styles.css        # Application styles and responsive design
│   ├── app.js           # Legacy JavaScript (preserved)
│   └── app-auth.js      # Enhanced JavaScript with authentication
└── sample project/       # Reference implementation
    └── [sample files]    # Enterprise-grade example structure
```

### Key Components

#### Server Architecture (`server.js`)
- **Express.js Setup** - Middleware configuration, static serving, security
- **Authentication Routes** - Azure AD integration endpoints
- **API Endpoints** - Comprehensive REST API structure
- **Error Handling** - Centralized error management
- **Health Monitoring** - Multiple system health checks

#### Frontend Architecture
- **Responsive Design** - Mobile-first, professional interface
- **Authentication Manager** - Client-side auth status management
- **Dynamic Navigation** - Context-aware navigation based on auth status
- **API Integration** - Seamless backend communication

#### Database Layer (`config/database.js`)
- **Connection Management** - Pooled connections with retry logic
- **Azure Integration** - Support for Managed Identity authentication
- **Health Monitoring** - Connection status and performance tracking
- **Error Handling** - Comprehensive database error management

## 🔧 API Endpoints

### Core Application
- `GET /` - Main application page
- `GET /health` - Application health status
- `GET /api/status` - Detailed system status
- `GET /api` - Application information and metadata

### Authentication
- `GET /signin` - Initiate Azure AD authentication
- `GET /signout` - Sign out and clear session
- `GET /create-account` - Account creation flow
- `GET /api/auth/status` - Current authentication status

### User Management
- `GET /api/user/profile` - User profile information
- `GET /profile.html` - User profile page

### System Information
- `GET /api/system/info` - Comprehensive system information
- `GET /api/database/health` - Database connection status

## 🚀 Deployment

### Azure App Service Configuration

1. **Runtime Configuration:**
   - Node.js 22 LTS
   - Always On enabled
   - HTTPS only

2. **Environment Variables:**
   ```bash
   NODE_ENV=production
   WEBSITE_NODE_DEFAULT_VERSION=~22
   ```

3. **Authentication Setup:**
   - Configure Azure AD in App Service Authentication
   - Set up redirect URIs and app permissions

### Database Setup (Optional)

1. **Azure SQL Database:**
   - Create Azure SQL Database instance
   - Configure firewall rules for App Service
   - Set up Managed Identity authentication

2. **Connection Configuration:**
   ```bash
   DATABASE_AUTH_TYPE=managed-identity
   DATABASE_SERVER=your-server.database.windows.net
   DATABASE_NAME=your-database-name
   ```

## 🔒 Security Features

- **Content Security Policy** - Helmet.js security headers
- **CORS Configuration** - Cross-origin resource sharing controls
- **Session Security** - Secure session configuration
- **Input Validation** - Request validation and sanitization
- **Azure AD Integration** - Enterprise authentication

## 📊 Monitoring & Health Checks

### Built-in Health Checks
- Application server status
- Database connectivity
- System resource monitoring
- Authentication service status

### Performance Monitoring
- Page load time tracking
- API response time monitoring
- Memory usage tracking
- Error rate monitoring

## 🔄 Development Workflow

### Local Development
```bash
npm run dev          # Start with nodemon for hot reload
npm start           # Start production server
npm test            # Run test suite (when implemented)
```

### Code Quality
- ESLint configuration for code standards
- Error handling best practices
- Logging standards implementation
- Security vulnerability scanning

## 📚 Additional Resources

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Active Directory Integration](https://docs.microsoft.com/en-us/azure/active-directory/)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js 22 LTS Features](https://nodejs.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Submit a pull request

## 📄 License

This project is part of the EFS Module 2 development initiative.

---

## Recent Updates

### Architecture Transformation
- **Express.js Integration** - Converted from basic HTTP server to enterprise-grade Express.js application
- **Azure AD Authentication** - Implemented complete authentication flow with user profile management
- **Database Architecture** - Added SQL Server integration with Azure Managed Identity support
- **UI Enhancement** - Integrated Early Learning Family Portal design with responsive layout
- **API Expansion** - Added comprehensive REST API endpoints for system monitoring and user management

### Security Enhancements
- **Helmet.js Integration** - Advanced security header management
- **CORS Configuration** - Fine-tuned cross-origin resource sharing
- **Session Management** - Secure session handling with proper configuration
- **Environment Configuration** - Comprehensive environment variable management

### Performance Optimizations
- **Connection Pooling** - Optimized database connections
- **Static File Serving** - Efficient asset delivery
- **Error Handling** - Centralized error management with proper logging
- **Health Monitoring** - Multi-layer health check system

Built with ❤️ for the Florida Department of Education - Early Learning Family Portal Initiative