// Shared Authentication Handler for all PalPal Projects
// Use this in any project to access the authenticated user

class PalPalAuth {
  constructor() {
    this.user = null;
    this.authCallbacks = [];
  }

  // Initialize auth listener
  init(callback) {
    if (typeof firebase === "undefined") {
      console.error(
        "Firebase SDK not loaded. Make sure firebase-config.js is included."
      );
      return;
    }

    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
      if (callback) callback(user);
      this.authCallbacks.forEach((cb) => cb(user));
    });
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.user !== null;
  }

  // Get user ID
  getUserId() {
    return this.user ? this.user.uid : null;
  }

  // Get user email
  getUserEmail() {
    return this.user ? this.user.email : null;
  }

  // Redirect to auth page if not logged in
  requireAuth(redirectUrl = "/auth.html") {
    if (!this.isAuthenticated()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }

  // Subscribe to auth changes
  onAuthStateChanged(callback) {
    this.authCallbacks.push(callback);
    return () => {
      this.authCallbacks = this.authCallbacks.filter((cb) => cb !== callback);
    };
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      return result.user;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  }

  // Sign in with Facebook
  async signInWithFacebook() {
    try {
      const provider = new firebase.auth.FacebookAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      return result.user;
    } catch (error) {
      console.error("Facebook sign-in error:", error);
      throw error;
    }
  }

  // Sign out
  async signOut() {
    try {
      await firebase.auth().signOut();
      this.user = null;
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }
}

// Create global instance
const palpalAuth = new PalPalAuth();
