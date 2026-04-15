/**
 * Authentication Guard Module
 * Handles restricting access to features that require authentication
 */

class AuthGuard {
  constructor() {
    this.currentUser = null;
    this.initializeAuthListener();
  }

  /**
   * Initialize Firebase auth state listener
   */
  initializeAuthListener() {
    this.waitForFirebase(() => {
      if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged((user) => {
          this.currentUser = user;
          this.updateRestrictedElements();
          console.log('✓ Auth guard initialized -', user ? `Signed in as ${user.email}` : 'Not signed in');
        });
      }
    });
  }

  /**
   * Wait for Firebase to be available
   */
  waitForFirebase(callback) {
    let attempts = 0;
    const maxAttempts = 50;
    
    const checkFirebase = setInterval(() => {
      attempts++;
      if (typeof firebase !== 'undefined' && firebase.auth && window.firebaseInitialized) {
        clearInterval(checkFirebase);
        callback();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkFirebase);
        console.warn('⚠ Firebase not ready for auth guard');
      }
    }, 100);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.currentUser !== null;
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Update restricted elements (disable/enable based on auth state)
   */
  updateRestrictedElements() {
    const restrictedElements = document.querySelectorAll('[data-requires-auth]');
    
    restrictedElements.forEach((element) => {
      if (this.isAuthenticated()) {
        element.classList.remove('auth-restricted');
        element.disabled = false;
        element.title = '';
      } else {
        element.classList.add('auth-restricted');
        element.disabled = false; // Keep interactive for showing message
        element.title = 'Sign in required';
      }
    });
  }

  /**
   * Show sign-in prompt for restricted feature
   */
  showSignInPrompt(featureName = 'This feature') {
    this.showAuthModal(featureName);
  }

  /**
   * Show authentication modal
   */
  showAuthModal(featureName = 'This feature') {
    // Remove existing modal if any
    const existingModal = document.getElementById('authGuardModal');
    if (existingModal) {
      existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'authGuardModal';
    modal.className = 'auth-guard-modal-overlay';
    modal.innerHTML = `
      <div class="auth-guard-modal">
        <button class="modal-close" onclick="document.getElementById('authGuardModal').remove()">&times;</button>
        <div class="auth-guard-header">
          <h2>Sign In Required</h2>
        </div>
        <div class="auth-guard-content">
          <p>${featureName} is available for signed-in users only.</p>
          <p>Sign in to your PalPal account to access this feature and unlock all the tools we've built for you.</p>
        </div>
        <div class="auth-guard-actions">
          <a href="auth.html" class="btn btn-primary auth-guard-sign-in">Sign In</a>
          <button class="btn btn-secondary" onclick="document.getElementById('authGuardModal').remove()">Maybe Later</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthGuard;
}
