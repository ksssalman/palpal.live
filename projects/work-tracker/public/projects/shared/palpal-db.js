// Shared Database Handler for all PalPal Projects
// Use this in any project to access shared data

class PalPalDB {
  constructor() {
    this.db = null;
  }

  // Initialize database
  init() {
    if (typeof firebase === "undefined") {
      console.error(
        "Firebase SDK not loaded. Make sure firebase-config.js is included."
      );
      return null;
    }
    this.db = firebase.firestore();
    return this.db;
  }

  // Get database instance
  getInstance() {
    if (!this.db) {
      this.init();
    }
    return this.db;
  }

  // Get current user ID (requires auth to be initialized)
  getUserId() {
    return palpalAuth.getUserId();
  }

  // ==================== USER PROFILE ====================

  async getUserProfile(userId) {
    const userId_ = userId || this.getUserId();
    if (!userId_) throw new Error("User not authenticated");

    const doc = await this.db.collection("users").doc(userId_).get();
    return doc.exists ? doc.data() : null;
  }

  async setUserProfile(data, userId) {
    const userId_ = userId || this.getUserId();
    if (!userId_) throw new Error("User not authenticated");

    await this.db.collection("users").doc(userId_).set(data, { merge: true });
  }

  // ==================== PROJECT-SPECIFIC DATA ====================

  // Add document to project collection
  async addProjectData(projectName, collectionName, data, userId) {
    const userId_ = userId || this.getUserId();
    if (!userId_) throw new Error("User not authenticated");

    const path = `projects/${projectName}/users/${userId_}/${collectionName}`;
    const docRef = await this.db.collection(path.split("/").join("/")).doc();
    await docRef.set(data);
    return docRef.id;
  }

  // Get project document
  async getProjectData(projectName, collectionName, docId, userId) {
    const userId_ = userId || this.getUserId();
    if (!userId_) throw new Error("User not authenticated");

    const path = `projects/${projectName}/users/${userId_}/${collectionName}`;
    const doc = await this.db.doc(path + "/" + docId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  // Get all project data
  async getAllProjectData(projectName, collectionName, userId) {
    const userId_ = userId || this.getUserId();
    if (!userId_) throw new Error("User not authenticated");

    const path = `projects/${projectName}/users/${userId_}/${collectionName}`;
    const snapshot = await this.db.collection(path).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // Update project data
  async updateProjectData(projectName, collectionName, docId, data, userId) {
    const userId_ = userId || this.getUserId();
    if (!userId_) throw new Error("User not authenticated");

    const path = `projects/${projectName}/users/${userId_}/${collectionName}`;
    await this.db.doc(path + "/" + docId).update(data);
  }

  // Delete project data
  async deleteProjectData(projectName, collectionName, docId, userId) {
    const userId_ = userId || this.getUserId();
    if (!userId_) throw new Error("User not authenticated");

    const path = `projects/${projectName}/users/${userId_}/${collectionName}`;
    await this.db.doc(path + "/" + docId).delete();
  }

  // Query project data
  async queryProjectData(
    projectName,
    collectionName,
    fieldPath,
    operator,
    value,
    userId
  ) {
    const userId_ = userId || this.getUserId();
    if (!userId_) throw new Error("User not authenticated");

    const path = `projects/${projectName}/users/${userId_}/${collectionName}`;
    const snapshot = await this.db
      .collection(path)
      .where(fieldPath, operator, value)
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // Listen to project data changes
  listenProjectData(projectName, collectionName, callback, userId) {
    const userId_ = userId || this.getUserId();
    if (!userId_) {
      console.error("User not authenticated");
      return () => {};
    }

    const path = `projects/${projectName}/users/${userId_}/${collectionName}`;
    return this.db.collection(path).onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  }
}

// Create global instance
const palpalDB = new PalPalDB();
