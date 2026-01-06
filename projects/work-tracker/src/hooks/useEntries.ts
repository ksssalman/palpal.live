import { useState, useEffect } from 'react';
// Hook for managing time entries
import type { TimeEntry } from '../types';
import type { PalPalBridge } from '../utils/palpalBridge';

export function useEntries(user: any, bridge: PalPalBridge | null) {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [isTemporaryData, setIsTemporaryData] = useState(false);

  // Load Data Logic
  useEffect(() => {
    const loadInitialData = async (currentUser: any) => {
      if (currentUser) {
        // AUTHENTICATED: Load from cloud (Firebase via Bridge)
        if (bridge && bridge.isAuthenticated()) {
          try {
            const remoteEntries = await bridge.getAllItems('work-tracker', 'sessions');
            if (remoteEntries && remoteEntries.length > 0) {
              const sortedEntries = (remoteEntries as TimeEntry[]).sort((a, b) =>
                new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime()
              );
              setEntries(sortedEntries);
              setIsTemporaryData(false);
            } else {
              setEntries([]);
              setIsTemporaryData(false);
            }
          } catch (e) {
            console.error('Failed to load cloud data:', e);
            // Fallback to local
            const saved = localStorage.getItem('timeEntries');
            if (saved) {
              try {
                setEntries(JSON.parse(saved) as TimeEntry[]);
                setIsTemporaryData(false);
              } catch (err) {
                console.error('Failed to parse local backup:', err);
              }
            }
          }
        }
      } else {
        // USER NOT AUTHENTICATED: Load from local storage
        const saved = localStorage.getItem('timeEntries');
        if (saved) {
          try {
            setEntries(JSON.parse(saved) as TimeEntry[]);
            setIsTemporaryData(true);
          } catch (e) {
            console.error('Failed to load entries from localStorage:', e);
          }
        } else {
          setEntries([]);
          setIsTemporaryData(false);
        }
      }

      // Load current entry from local
      const current = localStorage.getItem('currentEntry');
      if (current) {
        try {
          setCurrentEntry(JSON.parse(current) as TimeEntry);
        } catch (e) {
          console.error('Failed to load current entry from localStorage:', e);
        }
      }
    };

    loadInitialData(user);
  }, [user, bridge]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('timeEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
     if (currentEntry) {
      localStorage.setItem('currentEntry', JSON.stringify(currentEntry));
    } else {
      localStorage.removeItem('currentEntry');
    }
  }, [currentEntry]);

  // Actions
  const startSession = (initialTags: string[] = []) => {
    // If already running, do nothing or user should have stopped it
    if (currentEntry) return;

    const entry: TimeEntry = {
      id: Date.now(),
      clockIn: new Date().toISOString(),
      clockOut: null,
      tags: initialTags
    };
    setCurrentEntry(entry);
  };

  const stopSession = async () => {
    if (currentEntry) {
      const completedEntry: TimeEntry = {
        ...currentEntry,
        clockOut: new Date().toISOString()
      };
      const newEntries = [completedEntry, ...entries];
      setEntries(newEntries);
      setCurrentEntry(null);

      if (user && bridge?.isAuthenticated()) {
        try {
          await bridge.saveItem('work-tracker', 'sessions', completedEntry);
        } catch (e) {
          console.error('Cloud sync failed, data kept in local:', e);
        }
      }
    }
  };

  const updateEntry = async (id: number, updates: Partial<TimeEntry>) => {
    if (currentEntry && currentEntry.id === id) {
      setCurrentEntry({ ...currentEntry, ...updates });
    } else {
      const updatedEntries = entries.map(e =>
        e.id === id ? { ...e, ...updates } : e
      );
      setEntries(updatedEntries);

      // Update cloud if it's a past entry
      const entryToUpdate = updatedEntries.find(e => e.id === id);
      if (entryToUpdate && user && bridge?.isAuthenticated()) {
         try {
           await bridge.saveItem('work-tracker', 'sessions', entryToUpdate);
         } catch (e) {
           console.error('Cloud update failed', e);
         }
      }
    }
  };

  const deleteEntry = async (entryId: number) => {
      const updatedEntries = entries.filter(e => e.id !== entryId);
      setEntries(updatedEntries);

      if (bridge && bridge.isAuthenticated()) {
        try {
          await bridge.deleteItem('work-tracker', 'sessions', entryId);
        } catch (e) {
          console.error('Failed to delete cloud item:', e);
        }
      }
  };

  const addEntry = async (newEntry: TimeEntry) => {
    const updatedEntries = [newEntry, ...entries].sort((a, b) =>
      new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime()
    );
    setEntries(updatedEntries);

    if (user && bridge?.isAuthenticated()) {
      try {
        await bridge.saveItem('work-tracker', 'sessions', newEntry);
      } catch (e) {
        console.error('Failed to sync manual entry:', e);
      }
    }
  };

  const clearAllData = () => {
    setEntries([]);
    setCurrentEntry(null);
    localStorage.removeItem('timeEntries');
    localStorage.removeItem('currentEntry');
  };

  return {
    entries,
    setEntries,
    currentEntry,
    isTemporaryData,
    startSession,
    stopSession,
    addEntry,
    updateEntry,
    deleteEntry,
    clearAllData
  };
}
