import { useEffect, useState } from 'react'
import './index.css'
import App from './App'

/**
 * PalPal Auth Integration Wrapper
 * 
 * Handles two modes:
 * 1. ECOSYSTEM: Running within palpal.live (uses shared auth/db)
 * 2. STANDALONE: Running independently (uses dedicated Firebase)
 */

interface AppState {
  user: any | null
  isAuthenticated: boolean
  mode: 'ecosystem' | 'standalone'
}

export default function AppWithAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mode, setMode] = useState<'ecosystem' | 'standalone'>('standalone')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Detect mode
        const isEcosystem = !!(window as any).palpalAuth

        if (isEcosystem) {
          // Ecosystem mode: Use shared PalPal auth
          const palpalAuth = (window as any).palpalAuth

          palpalAuth.init((user: any) => {
            setUser(user)
            setIsAuthenticated(!!user)
            setMode('ecosystem')
            setLoading(false)

            if (user && (window as any).palpalDB) {
              (window as any).palpalDB.init()
            }
          })
        } else {
          // Standalone mode: Will use dedicated Firebase (configured in firebase.ts)
          // Just set ready state - App.tsx handles dedicated auth
          setMode('standalone')
          // Defer state update to avoid synchronous render warning
          setTimeout(() => setLoading(false), 0)
        }
      } catch (err) {
        setError(`Initialization error: ${err instanceof Error ? err.message : 'Unknown'}`)
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // Expose app state globally for components
  useEffect(() => {
    const appState: AppState = {
      user,
      isAuthenticated,
      mode
    }
    ;(window as any).palpalAppState = appState
  }, [user, isAuthenticated, mode])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="palpal-loading" style={{ margin: '0 auto 1rem' }}></div>
          <p>Loading Work Tracker...</p>
          <small style={{ opacity: 0.8 }}>Mode: {mode}</small>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <h2>⚠️ Initialization Error</h2>
          <p>{error}</p>
          <small>Check console for details</small>
        </div>
      </div>
    )
  }

  return <App />
}
