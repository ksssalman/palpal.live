// Type definitions for PalPal shared utilities
// Place this in src/types/palpal.d.ts

interface PalPalAuth {
  init(callback: (user: any) => void): void
  getCurrentUser(): any
  isAuthenticated(): boolean
  getUserId(): string | null
  getUserEmail(): string | null
  requireAuth(redirectUrl?: string): boolean
  onAuthStateChanged(callback: (user: any) => void): () => void
  signOut(): Promise<void>
}

interface PalPalDB {
  init(): any
  getInstance(): any
  getUserId(): string | null
  getUserProfile(userId?: string): Promise<any>
  setUserProfile(data: any, userId?: string): Promise<void>
  addProjectData(projectName: string, collectionName: string, data: any, userId?: string): Promise<string>
  getProjectData(projectName: string, collectionName: string, docId: string, userId?: string): Promise<any>
  getAllProjectData(projectName: string, collectionName: string, userId?: string): Promise<any[]>
  updateProjectData(projectName: string, collectionName: string, docId: string, data: any, userId?: string): Promise<void>
  deleteProjectData(projectName: string, collectionName: string, docId: string, userId?: string): Promise<void>
  queryProjectData(projectName: string, collectionName: string, fieldPath: string, operator: string, value: any, userId?: string): Promise<any[]>
  listenProjectData(projectName: string, collectionName: string, callback: (data: any[]) => void, userId?: string): () => void
}

declare global {
  interface Window {
    palpalAuth?: PalPalAuth
    palpalDB?: PalPalDB
    firebase?: any
    palpalAppState?: {
      user: any
      isAuthenticated: boolean
    }
  }
}

export { }
