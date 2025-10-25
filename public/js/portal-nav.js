class PortalNavigation {
  constructor() {
    this.accountContainer = document.getElementById("portal-account-actions");
    this.statusButton = document.querySelector(
      ".portal-nav-actions .portal-btn-secondary"
    );
    this.dropdown = null;
    this.triggerButton = null;
    this.isAuthenticated = false;
  }

  async init() {
    if (!this.accountContainer) {
      return;
    }

    try {
      const authResponse = await fetch("/api/auth/me", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!authResponse.ok) {
        this.renderSignedOut();
        return;
      }

      const authData = await authResponse.json();
      this.isAuthenticated = Boolean(authData?.authenticated);

      if (this.isAuthenticated && authData?.user) {
        this.renderSignedIn(authData.user);
      } else {
        this.renderSignedOut();
      }
    } catch (error) {
      console.warn("Failed to resolve auth state:", error);
      this.renderSignedOut();
    }
  }

  renderSignedOut() {
    this.accountContainer.dataset.state = "signed-out";
    this.accountContainer.innerHTML = `
      <a href="/signin" class="portal-btn portal-btn-primary" data-role="signin-link">
        <span class="portal-btn-icon" aria-hidden="true">
          <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.2852 3.33464C8.44421 3.33464 6.95182 4.82702 6.95182 6.66797C6.95182 8.50892 8.44421 10.0013 10.2852 10.0013C12.1261 10.0013 13.6185 8.50892 13.6185 6.66797C13.6185 4.82702 12.1261 3.33464 10.2852 3.33464ZM5.28516 6.66797C5.28516 3.90655 7.52373 1.66797 10.2852 1.66797C13.0466 1.66797 15.2852 3.90655 15.2852 6.66797C15.2852 9.42939 13.0466 11.668 10.2852 11.668C7.52373 11.668 5.28516 9.42939 5.28516 6.66797ZM6.95182 15.0013C5.57111 15.0013 4.45182 16.1206 4.45182 17.5013C4.45182 17.9615 4.07873 18.3346 3.61849 18.3346C3.15825 18.3346 2.78516 17.9615 2.78516 17.5013C2.78516 15.2001 4.65064 13.3346 6.95182 13.3346H13.6185C15.9197 13.3346 17.7852 15.2001 17.7852 17.5013C17.7852 17.9615 17.4121 18.3346 16.9518 18.3346C16.4916 18.3346 16.1185 17.9615 16.1185 17.5013C16.1185 16.1206 14.9992 15.0013 13.6185 15.0013H6.95182Z" fill="currentColor"></path>
          </svg>
        </span>
        Sign In
      </a>
    `;
  }

  renderSignedIn(user) {
    const displayName = user?.name || user?.email || "Profile";

    this.accountContainer.dataset.state = "signed-in";
    this.accountContainer.innerHTML = `
      <div class="portal-user-menu" data-open="false">
        <button class="portal-user-trigger" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Open profile menu">
          <span class="portal-user-avatar" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C9.23858 12 7 9.76142 7 7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7C17 9.76142 14.7614 12 12 12ZM5 20.2C5 16.8658 7.68629 14.1795 11.0205 14.1795H12.9795C16.3137 14.1795 19 16.8658 19 20.2C19 20.6418 18.6418 21 18.2 21H5.8C5.35817 21 5 20.6418 5 20.2Z" fill="currentColor"/>
            </svg>
          </span>
          <span class="portal-user-name">${this.escapeHtml(displayName)}</span>
          <svg class="portal-user-caret" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4.47 6.97a.75.75 0 0 1 1.06 0L8 9.44l2.47-2.47a.75.75 0 1 1 1.06 1.06L8.53 10.53a1.25 1.25 0 0 1-1.77 0L4.47 8.03a.75.75 0 0 1 0-1.06Z" fill="currentColor"/>
          </svg>
        </button>
        <div class="portal-user-dropdown" role="menu" hidden>
          <a href="/profile" role="menuitem" class="portal-user-link">Profile</a>
          <button type="button" class="portal-user-link" data-action="logout" role="menuitem">Sign Out</button>
        </div>
      </div>
    `;

    this.dropdown = this.accountContainer.querySelector(
      ".portal-user-dropdown"
    );
    this.triggerButton = this.accountContainer.querySelector(
      ".portal-user-trigger"
    );

    this.triggerButton?.addEventListener("click", () => this.toggleMenu());
    document.addEventListener("click", (event) => this.handleGlobalClick(event));

    const logoutButton = this.accountContainer.querySelector(
      "[data-action=\"logout\"]"
    );
    logoutButton?.addEventListener("click", () => {
      this.renderSignedOut();
      window.location.href = "/signout";
    });
  }

  toggleMenu(forceState) {
    if (!this.dropdown || !this.triggerButton) {
      return;
    }

    const menu = this.dropdown.closest(".portal-user-menu");
    const isOpen = menu?.dataset.open === "true";
    const nextState =
      typeof forceState === "boolean" ? forceState : !isOpen;

    menu.dataset.open = String(nextState);
    this.triggerButton.setAttribute("aria-expanded", String(nextState));
    this.dropdown.hidden = !nextState;
  }

  handleGlobalClick(event) {
    if (!this.dropdown || !this.triggerButton) {
      return;
    }

    const menu = this.dropdown.closest(".portal-user-menu");
    if (!menu) {
      return;
    }

    if (menu.contains(event.target)) {
      return;
    }

    this.toggleMenu(false);
  }

  escapeHtml(value) {
    return String(value).replace(/[&<>"]+/g, (char) => {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
      };
      return map[char] || char;
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const nav = new PortalNavigation();
  nav.init();
});
