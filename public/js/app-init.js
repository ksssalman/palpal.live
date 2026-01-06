/**
 * Application Initializer
 * Initializes all modules in correct order for the main landing page
 */

class AppInitializer {
  static initialize() {
    // Initialize modules in dependency order
    console.log('Initializing PalPal application...');

    // UI components
    window.navController = new UINavigation();
    window.mobileMenuController = new MobileMenu();
    window.navAuthController = new NavAuthentication();

    console.log('Application initialized successfully');
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
