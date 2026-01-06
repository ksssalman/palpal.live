/**
 * Firebase Firestore Database Module
 * Handles all database operations with consistent error handling
 */

class FirebaseDatabase {
  /**
   * Add a new document to a collection
   * @param {string} collectionName - Firestore collection name
   * @param {Object} data - Document data
   * @returns {Promise<string>} Document ID
   */
  static async addDocument(collectionName, data) {
    try {
      const docRef = await firebase
        .firestore()
        .collection(collectionName)
        .add(data);
      console.log('Document added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding document:', error.message);
      throw error;
    }
  }

  /**
   * Get a single document by ID
   * @param {string} collectionName - Firestore collection name
   * @param {string} docId - Document ID
   * @returns {Promise<Object|null>} Document data or null
   */
  static async getDocument(collectionName, docId) {
    try {
      const doc = await firebase
        .firestore()
        .collection(collectionName)
        .doc(docId)
        .get();

      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      } else {
        console.log('Document not found');
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error.message);
      throw error;
    }
  }

  /**
   * Get all documents from a collection
   * @param {string} collectionName - Firestore collection name
   * @returns {Promise<Array>} Array of documents
   */
  static async getAllDocuments(collectionName) {
    try {
      const querySnapshot = await firebase
        .firestore()
        .collection(collectionName)
        .get();

      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return documents;
    } catch (error) {
      console.error('Error getting documents:', error.message);
      throw error;
    }
  }

  /**
   * Update a document
   * @param {string} collectionName - Firestore collection name
   * @param {string} docId - Document ID
   * @param {Object} data - Data to update
   * @returns {Promise<void>}
   */
  static async updateDocument(collectionName, docId, data) {
    try {
      await firebase
        .firestore()
        .collection(collectionName)
        .doc(docId)
        .update(data);
      console.log('Document updated');
    } catch (error) {
      console.error('Error updating document:', error.message);
      throw error;
    }
  }

  /**
   * Delete a document
   * @param {string} collectionName - Firestore collection name
   * @param {string} docId - Document ID
   * @returns {Promise<void>}
   */
  static async deleteDocument(collectionName, docId) {
    try {
      await firebase
        .firestore()
        .collection(collectionName)
        .doc(docId)
        .delete();
      console.log('Document deleted');
    } catch (error) {
      console.error('Error deleting document:', error.message);
      throw error;
    }
  }

  /**
   * Query documents with a condition
   * @param {string} collectionName - Firestore collection name
   * @param {string} fieldPath - Field to query
   * @param {string} operator - Comparison operator
   * @param {any} value - Value to compare
   * @returns {Promise<Array>} Array of matching documents
   */
  static async queryDocuments(collectionName, fieldPath, operator, value) {
    try {
      const querySnapshot = await firebase
        .firestore()
        .collection(collectionName)
        .where(fieldPath, operator, value)
        .get();

      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return documents;
    } catch (error) {
      console.error('Error querying documents:', error.message);
      throw error;
    }
  }

  /**
   * Listen for real-time updates to a single document
   * @param {string} collectionName - Firestore collection name
   * @param {string} docId - Document ID
   * @param {Function} callback - Called with document data
   * @returns {Function} Unsubscribe function
   */
  static onDocumentUpdate(collectionName, docId, callback) {
    return firebase
      .firestore()
      .collection(collectionName)
      .doc(docId)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            callback({ id: doc.id, ...doc.data() });
          }
        },
        (error) => {
          console.error('Error listening to document:', error.message);
        }
      );
  }

  /**
   * Listen for real-time updates to a collection
   * @param {string} collectionName - Firestore collection name
   * @param {Function} callback - Called with array of documents
   * @returns {Function} Unsubscribe function
   */
  static onCollectionUpdate(collectionName, callback) {
    return firebase
      .firestore()
      .collection(collectionName)
      .onSnapshot(
        (querySnapshot) => {
          const documents = [];
          querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
          });
          callback(documents);
        },
        (error) => {
          console.error('Error listening to collection:', error.message);
        }
      );
  }

  /**
   * Batch write multiple documents
   * @param {string} collectionName - Firestore collection name
   * @param {Array<Object>} documents - Array of documents to write
   * @returns {Promise<void>}
   */
  static async batchWrite(collectionName, documents) {
    try {
      const batch = firebase.firestore().batch();
      const collectionRef = firebase.firestore().collection(collectionName);

      documents.forEach((doc) => {
        if (doc.id) {
          batch.set(collectionRef.doc(doc.id), doc.data);
        } else {
          batch.set(collectionRef.doc(), doc.data);
        }
      });

      await batch.commit();
      console.log('Batch write completed');
    } catch (error) {
      console.error('Error in batch write:', error.message);
      throw error;
    }
  }

  /**
   * Get documents with pagination
   * @param {string} collectionName - Firestore collection name
   * @param {number} pageSize - Documents per page
   * @param {Object} startAfter - Last document of previous page
   * @returns {Promise<Array>} Array of documents
   */
  static async getPaginatedDocuments(
    collectionName,
    pageSize = 10,
    startAfter = null
  ) {
    try {
      let query = firebase
        .firestore()
        .collection(collectionName)
        .limit(pageSize);

      if (startAfter) {
        query = query.startAfter(startAfter);
      }

      const querySnapshot = await query.get();
      const documents = [];

      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      return documents;
    } catch (error) {
      console.error('Error getting paginated documents:', error.message);
      throw error;
    }
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FirebaseDatabase;
}
