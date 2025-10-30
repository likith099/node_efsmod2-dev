// Enhanced JavaScript functionality for EFS Module 2 Development Portal with Authentication

class AuthManager {
    constructor() {
        this.isAuthenticated = false;
        this.userInfo = null;
    }

    async checkAuthStatus() {
        try {
            const response = await fetch('/api/auth/status');
            if (response.ok) {
                const authStatus = await response.json();
                this.isAuthenticated = authStatus.authenticated;
                this.userInfo = authStatus.user;
                return authStatus;
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        }
        return { authenticated: false };
    }

    updateNavigation() {
        const navButtons = document.getElementById('navButtons');
        
        if (this.isAuthenticated && this.userInfo) {
            // User is authenticated - show profile and sign out options
            navButtons.innerHTML = `
                <a href="#services" class="btn">
                    <svg width="16" height="16" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 7L9.5 13.5L18 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Features
                </a>
                <a href="/profile.html" class="btn">
                    <svg width="16" height="16" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.2852 3.33464C8.44421 3.33464 6.95182 4.82702 6.95182 6.66797C6.95182 8.50892 8.44421 10.0013 10.2852 10.0013C12.1261 10.0013 13.6185 8.50892 13.6185 6.66797C13.6185 4.82702 12.1261 3.33464 10.2852 3.33464Z" fill="white"/>
                        <path d="M6.95182 15.0013C5.57111 15.0013 4.45182 16.1206 4.45182 17.5013H13.6185C13.6185 16.1206 12.4992 15.0013 11.1185 15.0013H6.95182Z" fill="white"/>
                    </svg>
                    ${this.userInfo.displayName || 'Profile'}
                </a>
                <a href="/signout" class="btn" style="margin-left: 10px;">
                    <svg width="16" height="16" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16 17L21 12L16 7" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M21 12H9" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Sign Out
                </a>
            `;
        } else {
            // User is not authenticated - show sign in and sign up options
            navButtons.innerHTML = `
                <a href="#services" class="btn">
                    <svg width="16" height="16" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 7L9.5 13.5L18 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Features
                </a>
                <a href="/signin" class="btn">
                    <svg width="16" height="16" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.2852 3.33464C8.44421 3.33464 6.95182 4.82702 6.95182 6.66797C6.95182 8.50892 8.44421 10.0013 10.2852 10.0013C12.1261 10.0013 13.6185 8.50892 13.6185 6.66797C13.6185 4.82702 12.1261 3.33464 10.2852 3.33464Z" fill="white"/>
                    </svg>
                    Sign In
                </a>
                <a href="/create-account" class="btn" style="margin-left: 10px;">
                    <svg width="16" height="16" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 19C3.69137 16.6928 5.46998 16 9.5 16C13.53 16 15.3086 16.6928 16 19" stroke="#fff" stroke-width="1.75" stroke-linecap="round"/>
                        <path d="M13 9.5C13 11.433 11.433 13 9.5 13C7.567 13 6 11.433 6 9.5C6 7.567 7.567 6 9.5 6C11.433 6 13 7.567 13 9.5Z" stroke="#fff" stroke-width="1.75"/>
                        <path d="M15 6H21" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18 3L18 9" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Sign Up
                </a>
            `;
        }
    }

    updateHeroSection() {
        const heroTitle = document.querySelector('.hero h1');
        const heroSubtitle = document.querySelector('.hero p');
        
        if (this.isAuthenticated && this.userInfo && heroTitle && heroSubtitle) {
            heroTitle.textContent = `Welcome back, ${this.userInfo.displayName || 'User'}!`;
            heroSubtitle.textContent = 'Access your personalized dashboard and manage your Early Learning Family Portal account.';
        }
    }
}

class EFSPortal {
    constructor() {
        this.apiBaseUrl = '';
        this.authManager = new AuthManager();
        this.init();
    }

    async init() {
        console.log('EFS Module 2 Development Portal initializing...');
        
        // Initialize authentication first
        await this.authManager.checkAuthStatus();
        this.authManager.updateNavigation();
        this.authManager.updateHeroSection();
        
        this.setupEventListeners();
        this.loadSystemStatus();
        this.setupSmoothScrolling();
        
        console.log('EFS Module 2 Development Portal initialized successfully');
    }

    setupEventListeners() {
        // API Link interactions
        document.querySelectorAll('a[href^="/api"], a[href^="/health"]').forEach(link => {
            link.addEventListener('click', (e) => this.handleApiLinkClick(e));
        });

        // Modal functionality
        document.querySelectorAll('[data-modal-target]').forEach(trigger => {
            trigger.addEventListener('click', (e) => this.openModal(e));
        });

        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => this.closeModal(e));
        });

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Card hover animations
        const cards = document.querySelectorAll('.service-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    async handleApiLinkClick(e) {
        e.preventDefault();
        const url = e.target.getAttribute('href');
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            this.showApiResponse(url, data, response.status);
        } catch (error) {
            this.showApiResponse(url, { error: error.message }, 500);
        }
    }

    showApiResponse(url, data, status) {
        const modal = document.getElementById('apiModal') || this.createApiModal();
        const modalBody = modal.querySelector('.modal-body');
        
        modalBody.innerHTML = `
            <h3>API Response: ${url}</h3>
            <p><strong>Status:</strong> <span class="status-${status >= 200 && status < 300 ? 'success' : 'error'}">${status}</span></p>
            <pre><code>${JSON.stringify(data, null, 2)}</code></pre>
        `;
        
        modal.style.display = 'block';
    }

    createApiModal() {
        const modal = document.createElement('div');
        modal.id = 'apiModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <div class="modal-body"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listener for close button
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        return modal;
    }

    openModal(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('data-modal-target');
        const modal = document.getElementById(targetId);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    closeModal(e) {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    async loadSystemStatus() {
        try {
            const response = await fetch('/api/status');
            const status = await response.json();
            this.updateSystemStatusDisplay(status);
        } catch (error) {
            console.warn('Could not load system status:', error);
            this.updateSystemStatusDisplay({ 
                status: 'unknown', 
                error: 'Unable to connect to server' 
            });
        }
    }

    updateSystemStatusDisplay(status) {
        const statusElements = document.querySelectorAll('.system-status');
        statusElements.forEach(element => {
            element.textContent = status.status || 'unknown';
            element.className = `system-status status-${status.status || 'unknown'}`;
        });

        // Update any detailed status information
        const detailsElements = document.querySelectorAll('.status-details');
        detailsElements.forEach(element => {
            if (status.timestamp) {
                element.innerHTML = `Last updated: ${new Date(status.timestamp).toLocaleString()}`;
            }
        });
    }

    // Performance monitoring
    trackPageLoad() {
        if (window.performance && window.performance.timing) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        }
    }

    // Analytics placeholder
    trackEvent(eventName, properties = {}) {
        console.log('Event tracked:', eventName, properties);
        // Implement analytics tracking here
    }
}

// Initialize the portal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.efsPortal = new EFSPortal();
    
    // Track page load performance
    window.addEventListener('load', () => {
        window.efsPortal.trackPageLoad();
    });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EFSPortal, AuthManager };
}