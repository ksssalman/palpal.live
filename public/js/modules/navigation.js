/**
 * UI Navigation Module
 * Handles page navigation and section visibility
 */

class UINavigation {
  constructor() {
    this.currentPage = 'home';
    this.initializeElements();
    this.setupEventListeners();
    this.handleInitialHash();
  }

  /**
   * Initialize DOM element references
   */
  initializeElements() {
    this.welcomeSection = document.getElementById('welcomeSection');
    this.projectsSection = document.getElementById('projectsSection');
    this.exploreButton = document.getElementById('exploreButton');
    this.backButton = document.getElementById('backButton');
    this.navProjectsLink = document.getElementById('navProjectsLink');
    this.navLogo = document.getElementById('navLogo');
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    if (this.exploreButton) {
      this.exploreButton.addEventListener('click', (e) =>
        this.goToProjects(e)
      );
    }

    if (this.backButton) {
      this.backButton.addEventListener('click', () => this.goToHome());
    }

    if (this.navProjectsLink) {
      this.navProjectsLink.addEventListener('click', (e) =>
        this.goToProjects(e)
      );
    }

    if (this.navLogo) {
      this.navLogo.addEventListener('click', (e) => this.goToHome(e));
    }

    window.addEventListener('popstate', () => this.handlePopState());
  }

  /**
   * Navigate to projects page
   */
  goToProjects(e) {
    if (e) e.preventDefault();
    this.welcomeSection.style.display = 'none';
    this.projectsSection.classList.add('active');
    this.currentPage = 'projects';
    window.history.pushState({ page: 'projects' }, '', '#projects');
  }

  /**
   * Navigate to home page
   */
  goToHome(e) {
    if (e) e.preventDefault();
    this.projectsSection.classList.remove('active');
    this.welcomeSection.style.display = 'block';
    this.currentPage = 'home';
    window.history.pushState({ page: 'home' }, '', '#');
  }

  /**
   * Handle browser back/forward buttons
   */
  handlePopState() {
    if (window.location.hash === '#projects') {
      this.goToProjects();
    } else {
      this.goToHome();
    }
  }

  /**
   * Handle initial page load hash
   */
  handleInitialHash() {
    if (window.location.hash === '#projects') {
      this.goToProjects();
    }
  }

  /**
   * Get current page
   */
  getCurrentPage() {
    return this.currentPage;
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UINavigation;
}
