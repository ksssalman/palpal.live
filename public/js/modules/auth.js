/**
 * Firebase Authentication Module
 * Handles all auth-related operations with consistent error handling
 */

class FirebaseAuth {
  /**
   * Sign up with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} User object
   */
  static async signup(email, password) {
    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      console.log('User created successfully:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('Signup error:', error.message);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} User object
   */
  static async login(email, password) {
    try {
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      console.log('User logged in:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error.message);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with Google
   * @returns {Promise<Object>} User object
   */
  static async signInWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      console.log('Google sign-in successful:', result.user.uid);
      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error.message);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with Facebook
   * @returns {Promise<Object>} User object
   */
  static async signInWithFacebook() {
    try {
      const provider = new firebase.auth.FacebookAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      console.log('Facebook sign-in successful:', result.user.uid);
      return result.user;
    } catch (error) {
      console.error('Facebook sign-in error:', error.message);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out
   * @returns {Promise<void>}
   */
  static async logout() {
    try {
      await firebase.auth().signOut();
      console.log('User signed out');
    } catch (error) {
      console.error('Sign out error:', error.message);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current user
   * @returns {Object|null} User object or null if not authenticated
   */
  static getCurrentUser() {
    return firebase.auth().currentUser;
  }

  /**
   * Listen for auth state changes
   * @param {Function} callback - Called with user object or null
   * @returns {Function} Unsubscribe function
   */
  static onAuthStateChanged(callback) {
    return firebase.auth().onAuthStateChanged(callback);
  }

  /**
   * Send password reset email
   * @param {string} email
   * @returns {Promise<void>}
   */
  static async resetPassword(email) {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      console.log('Password reset email sent');
    } catch (error) {
      console.error('Password reset error:', error.message);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Handle authentication errors with user-friendly messages
   * @param {Error} error
   * @returns {Error} User-friendly error
   */
  static handleAuthError(error) {
    const errorMap = {
      'auth/email-already-in-use': 'Email is already in use.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/weak-password': 'Password is too weak.',
      'auth/user-not-found': 'User not found.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/account-exists-with-different-credential':
        'Account exists with different credentials.',
      'auth/operation-not-allowed': 'Operation not allowed.',
      'auth/user-cancelled': 'Sign-in cancelled.',
    };

    const friendlyMessage =
      errorMap[error.code] || error.message || 'An error occurred';
    const customError = new Error(friendlyMessage);
    customError.code = error.code;
    return customError;
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FirebaseAuth;
}
