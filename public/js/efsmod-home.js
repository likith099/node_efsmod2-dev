/* ====================================================
   EFSMOD Portal - Home Page JavaScript
   ==================================================== */

// Prevent browser back button
function noBack() { 
    window.history.forward();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    noBack();
    initializeTooltips();
    initializeModalHandlers();
    initializeIdleTimer();
});

window.onload = noBack;
window.onpageshow = function(evt) { 
    if (evt.persisted) noBack();
};
window.onunload = function() { 
    void(0);
};

// Scroll to top on load
window.top.scrollTo(0, 0);

// ====================================================
// Tooltip Initialization
// ====================================================
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-toggle="tooltip"]');
    tooltipElements.forEach(function(element) {
        element.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('title') || this.getAttribute('data-original-title');
            if (tooltipText) {
                showTooltip(this, tooltipText);
            }
        });
        element.addEventListener('mouseleave', function(e) {
            hideTooltip();
        });
    });
}

function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = text;
    tooltip.id = 'active-tooltip';
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
    tooltip.style.left = (rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)) + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('active-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// ====================================================
// Modal Handlers
// ====================================================
function initializeModalHandlers() {
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(function(modal) {
        modal.style.display = 'none';
    });
}

// ====================================================
// Idle Timer / Session Timeout
// ====================================================
let idleTimer = null;
let idleWarningTimer = null;
const IDLE_WARNING_TIME = 28 * 60 * 1000; // 28 minutes
const IDLE_LOGOUT_TIME = 30 * 60 * 1000;  // 30 minutes
const WARNING_COUNTDOWN = 30; // 30 seconds

function initializeIdleTimer() {
    // Only initialize if user is logged in (check for auth indicators)
    const isLoggedIn = document.querySelector('[data-user-authenticated]');
    if (!isLoggedIn) return;

    resetIdleTimer();
    
    // Track user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(function(event) {
        document.addEventListener(event, resetIdleTimer, true);
    });
}

function resetIdleTimer() {
    clearTimeout(idleTimer);
    clearTimeout(idleWarningTimer);
    
    // Set warning timer
    idleWarningTimer = setTimeout(showIdleWarning, IDLE_WARNING_TIME);
    
    // Set logout timer
    idleTimer = setTimeout(autoLogout, IDLE_LOGOUT_TIME);
}

function showIdleWarning() {
    const modal = document.getElementById('timeoutWarningModal');
    if (modal) {
        modal.style.display = 'block';
        startCountdown();
    }
}

function startCountdown() {
    let seconds = WARNING_COUNTDOWN;
    const countdownElement = document.getElementById('timeoutCountDown');
    
    const countdownInterval = setInterval(function() {
        seconds--;
        if (countdownElement) {
            countdownElement.textContent = seconds;
        }
        
        if (seconds <= 0) {
            clearInterval(countdownInterval);
            autoLogout();
        }
    }, 1000);
    
    // Store interval ID for cleanup
    window.currentCountdownInterval = countdownInterval;
}

function autoLogout() {
    window.location.href = '/signout';
}

function stayLoggedIn() {
    const modal = document.getElementById('timeoutWarningModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    if (window.currentCountdownInterval) {
        clearInterval(window.currentCountdownInterval);
    }
    
    resetIdleTimer();
}

// ====================================================
// Form Helpers
// ====================================================

// Masked Input Support
function setupMaskedInputs() {
    // Phone number mask: (XXX) XXX-XXXX
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[data-mask="phone"]');
    phoneInputs.forEach(function(input) {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            if (value.length > 0) {
                formattedValue = '(' + value.substring(0, 3);
            }
            if (value.length >= 4) {
                formattedValue += ') ' + value.substring(3, 6);
            }
            if (value.length >= 7) {
                formattedValue += '-' + value.substring(6, 10);
            }
            
            e.target.value = formattedValue;
        });
    });
    
    // SSN mask: XXX-XX-XXXX
    const ssnInputs = document.querySelectorAll('input[data-mask="ssn"]');
    ssnInputs.forEach(function(input) {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            if (value.length > 0) {
                formattedValue = value.substring(0, 3);
            }
            if (value.length >= 4) {
                formattedValue += '-' + value.substring(3, 5);
            }
            if (value.length >= 6) {
                formattedValue += '-' + value.substring(5, 9);
            }
            
            e.target.value = formattedValue;
        });
    });
    
    // Date mask: MM/DD/YYYY
    const dateInputs = document.querySelectorAll('input[data-mask="date"]');
    dateInputs.forEach(function(input) {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            if (value.length > 0) {
                formattedValue = value.substring(0, 2);
            }
            if (value.length >= 3) {
                formattedValue += '/' + value.substring(2, 4);
            }
            if (value.length >= 5) {
                formattedValue += '/' + value.substring(4, 8);
            }
            
            e.target.value = formattedValue;
        });
    });
}

// Custom File Input Handler
function setupFileInputs() {
    document.addEventListener('change', function(e) {
        if (e.target.matches('.btn-file input[type="file"]')) {
            const input = e.target;
            const numFiles = input.files ? input.files.length : 1;
            const label = input.value.replace(/\\/g, '/').replace(/.*\//, '');
            
            const textInput = input.closest('.input-group').querySelector('input[type="text"]');
            const log = numFiles > 1 ? numFiles + ' files selected' : label;
            
            if (textInput) {
                textInput.value = log;
            }
        }
    });
}

// ====================================================
// Google Analytics Event Tracking
// ====================================================
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Track outbound links
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.hostname !== window.location.hostname) {
        trackEvent('Outbound Link', 'click', link.href);
    }
});

// ====================================================
// Accessibility Enhancements
// ====================================================

// Skip to main content
function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'sr-only sr-only-focusable';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '0';
    skipLink.style.left = '0';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Announce page changes to screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(function() {
        announcement.remove();
    }, 1000);
}

// ====================================================
// Initialize All Features
// ====================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllFeatures);
} else {
    initializeAllFeatures();
}

function initializeAllFeatures() {
    setupMaskedInputs();
    setupFileInputs();
    addSkipLink();
}

// ====================================================
// Export Functions for Global Use
// ====================================================
window.EFSMOD = window.EFSMOD || {};
window.EFSMOD.trackEvent = trackEvent;
window.EFSMOD.announceToScreenReader = announceToScreenReader;
window.EFSMOD.stayLoggedIn = stayLoggedIn;
window.EFSMOD.autoLogout = autoLogout;
