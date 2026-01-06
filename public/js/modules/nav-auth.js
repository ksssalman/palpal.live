/**
 * Navigation Authentication Module
 * Handles authentication UI updates in navigation bar
 */

class NavAuthentication {
  constructor() {
    this.navAuthContainer = document.getElementById('navAuthContainer');
    this.mobileAuthContainer = document.getElementById('mobileAuthContainer');

    if (this.navAuthContainer && this.mobileAuthContainer) {
      this.initializeAuthListeners();
    }
  }

  /**
   * Initialize Firebase auth state listeners
   */
  initializeAuthListeners() {
    // Wait for Firebase to load
    this.waitForFirebase(() => {
      FirebaseAuth.onAuthStateChanged((user) => {
        this.updateNavAuth(user);
      });
    });
  }

  /**
   * Wait for Firebase to be available
   */
  waitForFirebase(callback) {
    const checkFirebase = setInterval(() => {
      if (typeof firebase !== 'undefined' && firebase.auth) {
        clearInterval(checkFirebase);
        callback();
      }
    }, 100);
  }

  /**
   * Update navigation authentication UI based on user state
   */
  updateNavAuth(user) {
    if (user) {
      this.renderUserMenu(user);
    } else {
      this.renderSignInButton();
    }
  }

  /**
   * Render user menu with sign out button
   */
  renderUserMenu(user) {
    this.navAuthContainer.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <span class="user-email">${user.email}</span>
        <a href="javascript:void(0)" class="nav-auth-btn secondary" id="signOutBtn">
          Sign Out
        </a>
      </div>
    `;

    this.mobileAuthContainer.innerHTML = `
      <a href="javascript:void(0)" class="nav-auth-btn mobile-block" id="mobileSignOutBtn">
        Sign Out
      </a>
    `;

    // Add click handlers for sign out buttons
    document.getElementById('signOutBtn').addEventListener('click', () => {
      this.handleSignOut();
    });

    document.getElementById('mobileSignOutBtn').addEventListener('click', () => {
      this.handleSignOut();
    });
  }

  /**
   * Render sign in button
   */
  renderSignInButton() {
    this.navAuthContainer.innerHTML = `
      <a href="auth.html" class="nav-auth-btn">Sign In</a>
    `;

    this.mobileAuthContainer.innerHTML = `
      <a href="auth.html" class="nav-auth-btn mobile-block">Sign In</a>
    `;
  }

  /**
   * Handle sign out action
   */
  async handleSignOut() {
    try {
      await FirebaseAuth.logout();
      // UI will update via auth state listener
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NavAuthentication;
}
