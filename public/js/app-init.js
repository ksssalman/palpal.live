/**
 * Application Initializer
 * Initializes all modules in correct order for the main landing page
 */

class AppInitializer {
  static initialize() {
    // Initialize modules in dependency order
    console.log('Initializing PalPal application...');

    // Wait for Firebase to be ready before initializing auth modules
    this.waitForFirebase(() => {
      // UI components
      window.navController = new UINavigation();
      window.mobileMenuController = new MobileMenu();
      window.navAuthController = new NavAuthentication();
      
      // Auth guard for restricted features
      window.authGuard = new AuthGuard();
      
      console.log('Application initialized successfully');
    });
  }

  /**
   * Wait for Firebase to be available
   */
  static waitForFirebase(callback) {
    let attempts = 0;
    const maxAttempts = 50; // Wait up to 5 seconds
    
    const checkFirebase = setInterval(() => {
      attempts++;
      if (typeof firebase !== 'undefined' && firebase.auth && window.firebaseInitialized) {
        clearInterval(checkFirebase);
        callback();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkFirebase);
        console.warn('⚠ Firebase not ready, initializing without auth');
        // Still initialize UI modules even if Firebase failed
        window.navController = new UINavigation();
        window.mobileMenuController = new MobileMenu();
      }
    }, 100);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    AppInitializer.initialize();
  });
} else {
  // DOM is already loaded
  AppInitializer.initialize();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppInitializer;
}
