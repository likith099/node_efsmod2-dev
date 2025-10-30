# EFSMOD Portal - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```powershell
npm install
```

### Step 2: Start the Application
```powershell
# Development mode (auto-reload)
npm run dev

# OR Production mode
npm start
```

### Step 3: View the Portal
Open your browser to: **http://localhost:3000**

---

## 📋 What You'll See

### Home Page (/)
The new EFSMOD Portal landing page featuring:
- **Navigation Header** - Sign In and Sign Up buttons
- **Hero Section** - Welcome message with sign-in call-to-action
- **Three Service Cards**:
  1. **Resource & Referral** (Red)
  2. **Service Application** (Blue)
  3. **Program Enrollment** (Green)
- **Footer** - Browser recommendations and support links

### Key Features
✅ Fully responsive (mobile, tablet, desktop)
✅ Accessible with ARIA labels and keyboard navigation
✅ Modern UI matching the FLWINS design system
✅ Ready for Azure AD authentication
✅ Session timeout warnings
✅ Google Analytics integration

---

## 🎨 Before First Use

### Add Images (Recommended)
Place these files in `public/images/`:

1. **logo.png** - Main desktop logo
   - Recommended size: 200×40 pixels
   - Format: PNG with transparency

2. **logo-mobile.png** - Mobile logo
   - Recommended size: 120×30 pixels
   - Format: PNG with transparency

3. **hero-image.jpg** - Hero banner
   - Recommended size: 1920×500 pixels
   - Format: JPG (optimized for web)

> **Note**: The page will work without these images, but they enhance the visual experience.

---

## 🔑 Key Routes

| Route | Description |
|-------|-------------|
| `/` | EFSMOD Portal home page |
| `/signin` | Azure AD sign in (redirects to `.auth/login/aad`) |
| `/create-account` | Azure AD sign up |
| `/signout` | Logout and clear session |
| `/profile` | User profile dashboard |
| `/api/status` | API status check |
| `/health` | Health check endpoint |

---

## 🛠️ Customization

### Update Service Cards
Edit `public/home.html` around lines 450-550:
- Change card titles and descriptions
- Update button text and links
- Modify card colors (Red, Blue, Green sections)

### Modify Styles
- **Home page styles**: `public/css/efsmod-home.css`
- **Portal-wide styles**: `public/css/portal.css`
- **Design system**: `public/css/flwins-styles.css`

### Update Navigation
Edit `public/home.html` around lines 380-420:
- Change logo images
- Modify navigation buttons
- Update environment label (DEV, TEST, PROD)

---

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database (Optional - for intake forms)
SQL_SERVER=your-server.database.windows.net
SQL_DATABASE=your-database
SQL_USER=your-username
SQL_PASSWORD=your-password

# Or use connection string
SQL_CONNECTION_STRING=your-full-connection-string
```

### Package.json Scripts
```json
{
  "start": "node app.js",           // Production mode
  "dev": "nodemon app.js",          // Development with auto-reload
  "test": "echo 'No tests yet'"
}
```

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID <process-id> /F

# Or use a different port
$env:PORT=3001; npm start
```

### Module Not Found
```powershell
# Clean install
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

### Styles Not Loading
1. Clear browser cache (Ctrl + F5)
2. Check browser console for errors
3. Verify CSS files exist in `public/css/`

---

## 📱 Testing Checklist

Before deploying to Azure:

- [ ] Test on desktop (Chrome, Edge, Firefox)
- [ ] Test on mobile (iPhone Safari, Android Chrome)
- [ ] Test on tablet (iPad)
- [ ] Verify all links work
- [ ] Check modal open/close
- [ ] Test responsive breakpoints
- [ ] Validate accessibility (keyboard navigation)
- [ ] Check browser console for errors
- [ ] Verify images load correctly
- [ ] Test form inputs and validation

---

## 🚢 Deploy to Azure

### Quick Deploy with Azure CLI
```powershell
# Login to Azure
az login

# Create resource group (if needed)
az group create --name rg-efsmod --location eastus

# Create App Service plan (if needed)
az appservice plan create --name plan-efsmod --resource-group rg-efsmod --sku B1 --is-linux

# Create web app
az webapp create --resource-group rg-efsmod --plan plan-efsmod --name efsmod-portal --runtime "NODE:22-lts"

# Deploy code
az webapp up --name efsmod-portal --resource-group rg-efsmod
```

### Configure in Azure Portal
1. Navigate to your App Service
2. **Configuration** → Add application settings:
   - `NODE_ENV` = `production`
   - `WEBSITE_NODE_DEFAULT_VERSION` = `22-lts`
3. **Authentication** → Set up Azure AD (optional)
4. **Custom domains** → Add your domain (optional)

---

## 📚 Additional Resources

- **Full Documentation**: See `README.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Image Requirements**: See `public/images/README.md`
- **Development Guidelines**: See `.github/copilot-instructions.md`

---

## 💡 Tips

1. **Use npm run dev** during development for automatic restart on file changes
2. **Check browser DevTools** (F12) for console errors
3. **Test mobile view** using browser DevTools responsive mode
4. **Use environment variables** for sensitive data (never commit passwords)
5. **Keep dependencies updated** with `npm update`

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ Application starts without errors
- ✅ Home page loads at http://localhost:3000
- ✅ Three service cards are visible
- ✅ Navigation buttons respond to clicks
- ✅ Modal opens when clicking "Sign Up"
- ✅ Page is responsive on mobile
- ✅ Browser console shows no errors

---

## 🆘 Need Help?

1. Check the browser console (F12 → Console tab)
2. Review server logs in terminal
3. Verify all files are in correct locations
4. Ensure Node.js 22 LTS is installed: `node --version`
5. Check npm version: `npm --version`

---

**Happy Coding! 🎉**

The EFSMOD Portal is now ready for development and testing.
