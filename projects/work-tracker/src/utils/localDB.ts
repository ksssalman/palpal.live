// Local storage utility for Work Tracker (free/unauthenticated version)
// When user is authenticated, data syncs to Firebase
// When user is not authenticated, data is stored locally

const STORAGE_KEY = 'palpal_work_tracker'

export interface WorkItem {
  id: string
  title: string
  description?: string
  status: 'active' | 'completed' | 'paused'
  createdAt: string
  updatedAt: string
  tags?: string[]
  duration?: number
  [key: string]: any
}

class LocalWorkTrackerDB {
  private storageKey: string

  constructor(projectKey: string = 'default') {
    this.storageKey = `${STORAGE_KEY}_${projectKey}`
  }

  /**
   * Get all items from local storage
   */
  getAllItems(collectionName: string): WorkItem[] {
    try {
      const data = localStorage.getItem(`${this.storageKey}_${collectionName}`)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error(`Error reading ${collectionName}:`, error)
      return []
    }
  }

  /**
   * Get single item by ID
   */
  getItem(collectionName: string, itemId: string): WorkItem | null {
    const items = this.getAllItems(collectionName)
    return items.find(item => item.id === itemId) || null
  }

  /**
   * Add new item
   */
  addItem(collectionName: string, data: Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt'>): string {
    try {
      const items = this.getAllItems(collectionName)
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const now = new Date().toISOString()

      const newItem: WorkItem = {
        id,
        title: data.title || 'Untitled',
        status: data.status || 'active',
        createdAt: now,
        updatedAt: now,
        ...(data as any)
      }

      items.push(newItem)
      localStorage.setItem(`${this.storageKey}_${collectionName}`, JSON.stringify(items))
      return id
    } catch (error) {
      console.error(`Error adding item to ${collectionName}:`, error)
      throw error
    }
  }

  /**
   * Update item
   */
  updateItem(collectionName: string, itemId: string, data: Partial<WorkItem>): void {
    try {
      const items = this.getAllItems(collectionName)
      const itemIndex = items.findIndex(item => item.id === itemId)

      if (itemIndex === -1) {
        throw new Error(`Item ${itemId} not found in ${collectionName}`)
      }

      items[itemIndex] = {
        ...items[itemIndex],
        ...data,
        updatedAt: new Date().toISOString()
      }

      localStorage.setItem(`${this.storageKey}_${collectionName}`, JSON.stringify(items))
    } catch (error) {
      console.error(`Error updating item in ${collectionName}:`, error)
      throw error
    }
  }

  /**
   * Delete item
   */
  deleteItem(collectionName: string, itemId: string): void {
    try {
      const items = this.getAllItems(collectionName)
      const filtered = items.filter(item => item.id !== itemId)
      localStorage.setItem(`${this.storageKey}_${collectionName}`, JSON.stringify(filtered))
    } catch (error) {
      console.error(`Error deleting item from ${collectionName}:`, error)
      throw error
    }
  }

  /**
   * Clear all data
   */
  clear(collectionName?: string): void {
    try {
      if (collectionName) {
        localStorage.removeItem(`${this.storageKey}_${collectionName}`)
      } else {
        // Clear all Work Tracker data
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
          if (key.startsWith(this.storageKey)) {
            localStorage.removeItem(key)
          }
        })
      }
    } catch (error) {
      console.error('Error clearing storage:', error)
      throw error
    }
  }

  /**
   * Query items by condition
   */
  queryItems(collectionName: string, field: string, value: any): WorkItem[] {
    try {
      const items = this.getAllItems(collectionName)
      return items.filter(item => item[field] === value)
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error)
      return []
    }
  }

  /**
   * Export data as JSON
   */
  exportData(): string {
    try {
      const data: { [key: string]: WorkItem[] } = {}
      const keys = Object.keys(localStorage)

      keys.forEach(key => {
        if (key.startsWith(this.storageKey)) {
          const collectionName = key.replace(this.storageKey + '_', '')
          data[collectionName] = this.getAllItems(collectionName)
        }
      })

      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error('Error exporting data:', error)
      throw error
    }
  }

  /**
   * Import data from JSON
   */
  importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData)

      Object.entries(data).forEach(([collectionName, items]) => {
        localStorage.setItem(
          `${this.storageKey}_${collectionName}`,
          JSON.stringify(items)
        )
      })
    } catch (error) {
      console.error('Error importing data:', error)
      throw error
    }
  }
}

// Create global instance
export const localDB = new LocalWorkTrackerDB()

/**
 * Utility to get the appropriate database based on auth status
 * If user is authenticated, use Firebase (palpalDB)
 * If not authenticated, use localStorage
 */
export function getWorkTrackerDB() {
  const isAuthenticated = window.palpalAppState?.isAuthenticated || false

  if (isAuthenticated && window.palpalDB) {
    const db = window.palpalDB;
    return {
      isLocal: false,
      getAllItems: (collectionName: string) =>
        db.getAllProjectData('work-tracker', collectionName),
      getItem: (collectionName: string, itemId: string) =>
        db.getProjectData('work-tracker', collectionName, itemId),
      addItem: (collectionName: string, data: any) =>
        db.addProjectData('work-tracker', collectionName, data),
      updateItem: (collectionName: string, itemId: string, data: any) =>
        db.updateProjectData('work-tracker', collectionName, itemId, data),
      deleteItem: (collectionName: string, itemId: string) =>
        db.deleteProjectData('work-tracker', collectionName, itemId),
      queryItems: (collectionName: string, field: string, operator: string, value: any) =>
        db.queryProjectData('work-tracker', collectionName, field, operator, value)
    }
  }

  // Return localStorage interface
  return {
    isLocal: true,
    getAllItems: (collectionName: string) => localDB.getAllItems(collectionName),
    getItem: (collectionName: string, itemId: string) => localDB.getItem(collectionName, itemId),
    addItem: (collectionName: string, data: any) => localDB.addItem(collectionName, data),
    updateItem: (collectionName: string, itemId: string, data: any) =>
      localDB.updateItem(collectionName, itemId, data),
    deleteItem: (collectionName: string, itemId: string) =>
      localDB.deleteItem(collectionName, itemId),
    queryItems: (collectionName: string, field: string, _operator: string, value: any) =>
      localDB.queryItems(collectionName, field, value)
  }
}

export default localDB
