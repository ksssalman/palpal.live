import { useState, useEffect } from 'react';

// Hook for managing work sessions
import type { TimeEntry } from '../types';
import type { PalPalBridge } from '../utils/palpalBridge';

export function useEntries(user: any, bridge: PalPalBridge | null) {
  const [sessions, setSessions] = useState<TimeEntry[]>([]);
  const [currentSession, setCurrentSession] = useState<TimeEntry | null>(null);
  const [isTemporaryData, setIsTemporaryData] = useState(false);

  // Load Data Logic
  useEffect(() => {
    const loadInitialData = async (currentUser: any) => {
      if (currentUser) {
        // AUTHENTICATED: Load from cloud (Firebase via Bridge)
        if (bridge && bridge.isAuthenticated()) {
          try {
            const remoteSessions = await bridge.getAllItems('work-tracker', 'sessions');
            if (remoteSessions && remoteSessions.length > 0) {
              const sortedSessions = (remoteSessions as TimeEntry[]).sort((a, b) =>
                new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime()
              );
              setSessions(sortedSessions);
              setIsTemporaryData(false);
            } else {
              setSessions([]);
              setIsTemporaryData(false);
            }
          } catch (e) {
            console.error('Failed to load cloud data:', e);
            // Fallback to local
            const saved = localStorage.getItem('timeSessions');
            if (saved) {
              try {
                setSessions(JSON.parse(saved) as TimeEntry[]);
                setIsTemporaryData(false);
              } catch (err) {
                console.error('Failed to parse local backup:', err);
              }
            }
          }
        }
      } else {
        // USER NOT AUTHENTICATED: Load from local storage
        const saved = localStorage.getItem('timeSessions');
        if (saved) {
          try {
            setSessions(JSON.parse(saved) as TimeEntry[]);
            setIsTemporaryData(true);
          } catch (e) {
            console.error('Failed to load sessions from localStorage:', e);
          }
        } else {
          setSessions([]);
          setIsTemporaryData(false);
        }
      }

      // Load current session from local
      const current = localStorage.getItem('currentSession');
      if (current) {
        try {
          setCurrentSession(JSON.parse(current) as TimeEntry);
        } catch (e) {
          console.error('Failed to load current session from localStorage:', e);
        }
      }
    };

    loadInitialData(user);
  }, [user, bridge]);

  // Persistence
  useEffect(() => {

    localStorage.setItem('timeSessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {

     if (currentSession) {
      localStorage.setItem('currentSession', JSON.stringify(currentSession));
    } else {
      localStorage.removeItem('currentSession');
    }
  }, [currentSession]);

  // Actions

  const startSession = (initialTags: string[] = []) => {
    // If already running, do nothing or user should have stopped it
    if (currentSession) return;

    const session: TimeEntry = {
      id: Date.now(),
      clockIn: new Date().toISOString(),
      clockOut: null,
      tags: initialTags
    };
    setCurrentSession(session);
  };


  const stopSession = async () => {
    if (currentSession) {
      const completedSession: TimeEntry = {
        ...currentSession,
        clockOut: new Date().toISOString()
      };
      const newSessions = [completedSession, ...sessions];
      setSessions(newSessions);
      setCurrentSession(null);

      if (user && bridge?.isAuthenticated()) {
        try {
          await bridge.saveItem('work-tracker', 'sessions', completedSession);
        } catch (e) {
          console.error('Cloud sync failed, data kept in local:', e);
        }
      }
    }
  };


  const updateSession = async (id: number, updates: Partial<TimeEntry>) => {
    if (currentSession && currentSession.id === id) {
      setCurrentSession({ ...currentSession, ...updates });
    } else {
      const updatedSessions = sessions.map(s =>
        s.id === id ? { ...s, ...updates } : s
      );
      setSessions(updatedSessions);

      // Update cloud if it's a past session
      const sessionToUpdate = updatedSessions.find(s => s.id === id);
      if (sessionToUpdate && user && bridge?.isAuthenticated()) {
         try {
           await bridge.saveItem('work-tracker', 'sessions', sessionToUpdate);
         } catch (e) {
           console.error('Cloud update failed', e);
         }
      }
    }
  };


  const deleteSession = async (sessionId: number) => {
      const updatedSessions = sessions.filter(s => s.id !== sessionId);
      setSessions(updatedSessions);

      if (bridge && bridge.isAuthenticated()) {
        try {
          await bridge.deleteItem('work-tracker', 'sessions', sessionId);
        } catch (e) {
          console.error('Failed to delete cloud item:', e);
        }
      }
  };


  const addSession = async (newSession: TimeEntry) => {
    const updatedSessions = [newSession, ...sessions].sort((a, b) =>
      new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime()
    );
    setSessions(updatedSessions);

    if (user && bridge?.isAuthenticated()) {
      try {
        await bridge.saveItem('work-tracker', 'sessions', newSession);
      } catch (e) {
        console.error('Failed to sync manual session:', e);
      }
    }
  };


  const clearAllData = () => {
    setSessions([]);
    setCurrentSession(null);
    localStorage.removeItem('timeSessions');
    localStorage.removeItem('currentSession');
  };

  return {
    sessions,
    setSessions,
    currentSession,
    isTemporaryData,
    startSession,
    stopSession,
    addSession,
    updateSession,
    deleteSession,
    clearAllData
  };
}
