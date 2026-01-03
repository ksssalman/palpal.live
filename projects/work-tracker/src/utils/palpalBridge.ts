import { auth as dedicatedAuth, db as dedicatedDb } from './firebase';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';

export interface PalPalUser {
    uid: string;
    email: string | null;
}

export interface PalPalBridge {
    isAuthenticated: () => boolean;
    getUser: () => PalPalUser | null;
    saveItem: (projectName: string, colName: string, data: any) => Promise<string | null>;
    getAllItems: (projectName: string, colName: string) => Promise<any[]>;
    // New methods for dedicated auth
    isDedicated?: boolean;
}


export const getPalPalBridge = (): PalPalBridge | null => {
    if (typeof window === 'undefined') return null;

    const sharedAuth = window.palpalAuth;
    const sharedDb = window.palpalDB;

    // Preference: Use shared PalPal if running inside the ecosystem
    if (sharedAuth && sharedDb) {
        return {
            isAuthenticated: () => sharedAuth.isAuthenticated(),
            getUser: () => {
                const user = sharedAuth.getCurrentUser();
                return user ? { uid: user.uid, email: user.email } : null;
            },
            saveItem: async (projectName, colName, data) => {
                return await sharedDb.addProjectData(projectName, colName, data);
            },
            getAllItems: async (projectName, colName) => {
                return await sharedDb.getAllProjectData(projectName, colName);
            },
            isDedicated: false
        };
    }

    // Fallback: Dedicated Firebase for standalone mode
    return {
        isAuthenticated: () => !!dedicatedAuth.currentUser,
        getUser: () => {
            const user = dedicatedAuth.currentUser;
            return user ? { uid: user.uid, email: user.email } : null;
        },
        saveItem: async (_projectName, colName, data) => {
            if (!dedicatedAuth.currentUser) return null;
            const path = `users/${dedicatedAuth.currentUser.uid}/${colName}`;
            const docRef = await addDoc(collection(dedicatedDb, path), data);
            return docRef.id;
        },
        getAllItems: async (_projectName, colName) => {
            if (!dedicatedAuth.currentUser) return [];
            const path = `users/${dedicatedAuth.currentUser.uid}/${colName}`;
            const q = query(collection(dedicatedDb, path));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },
        isDedicated: true
    };
};
