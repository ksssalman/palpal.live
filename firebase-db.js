// Firebase Firestore Database Helper Functions

// Add a new document
async function addDocument(collectionName, data) {
  try {
    const docRef = await firebase
      .firestore()
      .collection(collectionName)
      .add(data);
    console.log("Document added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error.message);
    throw error;
  }
}

// Get a single document
async function getDocument(collectionName, docId) {
  try {
    const doc = await firebase
      .firestore()
      .collection(collectionName)
      .doc(docId)
      .get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    } else {
      console.log("Document not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error.message);
    throw error;
  }
}

// Get all documents from a collection
async function getAllDocuments(collectionName) {
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
    console.error("Error getting documents:", error.message);
    throw error;
  }
}

// Update a document
async function updateDocument(collectionName, docId, data) {
  try {
    await firebase
      .firestore()
      .collection(collectionName)
      .doc(docId)
      .update(data);
    console.log("Document updated");
  } catch (error) {
    console.error("Error updating document:", error.message);
    throw error;
  }
}

// Delete a document
async function deleteDocument(collectionName, docId) {
  try {
    await firebase.firestore().collection(collectionName).doc(docId).delete();
    console.log("Document deleted");
  } catch (error) {
    console.error("Error deleting document:", error.message);
    throw error;
  }
}

// Query documents with a condition
async function queryDocuments(collectionName, fieldPath, operator, value) {
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
    console.error("Error querying documents:", error.message);
    throw error;
  }
}

// Listen for real-time updates
function onDocumentUpdate(collectionName, docId, callback) {
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
        console.error("Error listening to document:", error.message);
      }
    );
}

// Listen for collection updates
function onCollectionUpdate(collectionName, callback) {
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
        console.error("Error listening to collection:", error.message);
      }
    );
}
