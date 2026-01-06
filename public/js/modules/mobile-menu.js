/**
 * Mobile Menu Module
 * Handles mobile menu toggle and interactions
 */

class MobileMenu {
  constructor() {
    this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    this.mobileMenu = document.getElementById('mobileMenu');
    this.isOpen = false;

    if (this.mobileMenuBtn && this.mobileMenu) {
      this.setupEventListeners();
    }
  }

  /**
   * Setup event listeners for mobile menu
   */
  setupEventListeners() {
    // Toggle menu on button click
    this.mobileMenuBtn.addEventListener('click', () => this.toggle());

    // Close menu when clicking on a link
    const mobileLinks = this.mobileMenu.querySelectorAll('a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => this.close());
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        !this.mobileMenuBtn.contains(e.target) &&
        !this.mobileMenu.contains(e.target)
      ) {
        this.close();
      }
    });
  }

  /**
   * Toggle mobile menu visibility
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open mobile menu
   */
  open() {
    this.mobileMenu.classList.add('active');
    this.isOpen = true;
  }

  /**
   * Close mobile menu
   */
  close() {
    this.mobileMenu.classList.remove('active');
    this.isOpen = false;
  }

  /**
   * Check if menu is open
   */
  getIsOpen() {
    return this.isOpen;
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileMenu;
}
