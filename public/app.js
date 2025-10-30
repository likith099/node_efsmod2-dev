// Enhanced JavaScript functionality for EFS Module 2 Development Portal

class EFSPortal {
    constructor() {
        this.apiBaseUrl = '';
        this.init();
    }

    init() {
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
        const link = e.target.closest('a');
        const href = link.getAttribute('href');
        
        // Don't prevent default for external links
        if (href.startsWith('http') || href.includes('github.com')) {
            return;
        }

        e.preventDefault();
        
        const originalContent = link.innerHTML;
        this.showLoading(link);

        try {
            const response = await fetch(href, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const data = await response.json();
            this.showApiResponse(data, href);
        } catch (error) {
            this.showError('Failed to fetch API data: ' + error.message);
        } finally {
            this.hideLoading(link, originalContent);
        }
    }

    showLoading(element) {
        const originalContent = element.innerHTML;
        element.dataset.originalContent = originalContent;
        element.innerHTML = '<div class="loading"></div> Loading...';
        element.style.pointerEvents = 'none';
    }

    hideLoading(element, originalContent) {
        element.innerHTML = originalContent;
        element.style.pointerEvents = 'auto';
    }

    showApiResponse(data, endpoint) {
        const modalHtml = `
            <div class="modal" id="apiResponseModal" style="display: block;">
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <h3>API Response: ${endpoint}</h3>
                    <div class="alert alert-info">
                        <strong>Endpoint:</strong> ${endpoint}<br>
                        <strong>Status:</strong> Success
                    </div>
                    <pre style="background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; font-size: 14px;">${JSON.stringify(data, null, 2)}</pre>
                    <div style="margin-top: 20px; text-align: right;">
                        <button class="btn" onclick="efsPortal.closeModal()">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Add event listener to close button
        document.querySelector('#apiResponseModal .modal-close').addEventListener('click', () => {
            this.closeModal();
        });
    }

    showError(message) {
        const alertHtml = `
            <div class="alert alert-error" style="position: fixed; top: 100px; right: 20px; z-index: 1001; max-width: 300px;">
                ${message}
                <button style="float: right; background: none; border: none; font-size: 18px; cursor: pointer;" onclick="this.parentElement.remove()">&times;</button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', alertHtml);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            const alert = document.querySelector('.alert.alert-error');
            if (alert) alert.remove();
        }, 5000);
    }

    async loadSystemStatus() {
        try {
            const response = await fetch('/health');
            const data = await response.json();
            
            // Update status indicators if they exist
            const statusElements = document.querySelectorAll('.status-indicator');
            statusElements.forEach(element => {
                element.classList.add('healthy');
                element.textContent = 'Online';
            });
            
        } catch (error) {
            console.warn('Could not load system status:', error);
            
            const statusElements = document.querySelectorAll('.status-indicator');
            statusElements.forEach(element => {
                element.classList.add('error');
                element.textContent = 'Offline';
            });
        }
    }

    openModal(e) {
        const target = e.target.getAttribute('data-modal-target');
        const modal = document.querySelector(target);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(e) {
        const modal = e ? e.target.closest('.modal') : document.querySelector('.modal[style*="block"]');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Remove dynamically created modals
            if (modal.id === 'apiResponseModal') {
                modal.remove();
            }
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }

    // Utility methods
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatUptime(seconds) {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (days > 0) return `${days}d ${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
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
    module.exports = EFSPortal;
}