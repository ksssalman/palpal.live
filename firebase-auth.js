// Firebase Authentication Helper Functions

// Sign up with email and password
async function signupWithEmail(email, password) {
  try {
    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    console.log("User created successfully:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Signup error:", error.message);
    throw error;
  }
}

// Sign in with email and password
async function loginWithEmail(email, password) {
  try {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    console.log("User logged in:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
}

// Sign in with Google
async function signInWithGoogle() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    console.log("Google sign-in successful:", result.user.uid);
    return result.user;
  } catch (error) {
    console.error("Google sign-in error:", error.message);
    throw error;
  }
}

// Sign out
async function signOut() {
  try {
    await firebase.auth().signOut();
    console.log("User signed out");
  } catch (error) {
    console.error("Sign out error:", error.message);
    throw error;
  }
}

// Get current user
function getCurrentUser() {
  return firebase.auth().currentUser;
}

// Listen for auth state changes
function onAuthStateChanged(callback) {
  return firebase.auth().onAuthStateChanged(callback);
}

// Reset password
async function resetPassword(email) {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    console.log("Password reset email sent");
  } catch (error) {
    console.error("Password reset error:", error.message);
    throw error;
  }
}
