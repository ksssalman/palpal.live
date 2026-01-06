import { useState, useEffect } from 'react';
import { getPalPalBridge } from './utils/palpalBridge';
import { auth as dedicatedAuth, googleProvider } from './utils/firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import type { TimeEntry, TagStat, View, ReportPeriod } from './types';

// Components
import Header from './components/common/Header';
import ClearDataModal from './components/common/ClearDataModal';
import ClockInSection from './components/tracker/ClockInSection';
import RecentEntriesList from './components/tracker/RecentEntriesList';
import ReportView from './components/report/ReportView';
import { CalendarPlus, Download, FileJson, Trash2 } from 'lucide-react';

export default function TimeTrackerWidget() {
  // State
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const bridge = getPalPalBridge();
  const [user, setUser] = useState<any>(null);
  const [isTemporaryData, setIsTemporaryData] = useState(false);
  const [tagInput, setTagInput] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [view, setView] = useState<View>('tracker');

  // Report State
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('week');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  const [selectedTags] = useState<string[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);

  // Manual Entry State
  const [editingEntry, setEditingEntry] = useState<number | null>(null);
  const [manualTag, setManualTag] = useState<string>('');
  const [manualClockIn, setManualClockIn] = useState<string>('');
  const [manualClockOut, setManualClockOut] = useState<string>('');

  // Modal State
  const [showClearModal, setShowClearModal] = useState<boolean>(false);

  // Auth State
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Auth Handlers
  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setSignInError(null);

      // Logging for debugging temp data state
      if (isTemporaryData) {
        console.log('User signing in with temporary data in state');
      }

      if (bridge && !bridge.isDedicated) {
        await (window as any).palpalAuth.signInWithGoogle();
      } else {
        await signInWithPopup(dedicatedAuth, googleProvider);
      }
      // Auth state change listener will handle loading cloud data
    } catch (e: any) {
      const errorMessage = e?.message || 'Sign in failed. Please try again.';
      setSignInError(errorMessage);
      setTimeout(() => setSignInError(null), 5000);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (bridge && !bridge.isDedicated) {
        await (window as any).palpalAuth.signOut();
      } else {
        await signOut(dedicatedAuth);
      }
      // Temp data will be cleared on next auth state change
      setIsTemporaryData(false);
    } catch (e) {
      console.error('Sign out failed:', e);
    }
  };

  // Effects
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentEntry) {
      interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentEntry]);

  useEffect(() => {
    const bridge = getPalPalBridge();

    const loadInitialData = async (authenticatedUser: any) => {
      if (!bridge) return;

      // Check if user is authenticated
      const isAuthenticated = authenticatedUser !== null;

      if (isAuthenticated) {
        // USER IS AUTHENTICATED: Load from cloud first
        try {
          const remoteEntries = await bridge.getAllItems('work-tracker', 'sessions');
          if (remoteEntries && remoteEntries.length > 0) {
             const sortedEntries = (remoteEntries as TimeEntry[]).sort((a, b) =>
               new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime()
             );
            setEntries(sortedEntries);
            setIsTemporaryData(false);
            console.log('Loaded cloud data for authenticated user');
          } else {
            // No cloud data, start fresh
            setEntries([]);
            setIsTemporaryData(false);
            console.log('No cloud data found for new authenticated user');
          }
        } catch {
          // Cloud load failed, fall back to local backup
          const saved = localStorage.getItem('timeEntries');
          if (saved) {
            try {
              setEntries(JSON.parse(saved) as TimeEntry[]);
              setIsTemporaryData(false);
              console.log('Cloud load failed, using local backup');
            } catch (err) {
              console.error('Failed to load entries:', err);
            }
          }
        }
      } else {
        // USER NOT AUTHENTICATED: Load from local storage (temporary data)
        const saved = localStorage.getItem('timeEntries');
        if (saved) {
          try {
            setEntries(JSON.parse(saved) as TimeEntry[]);
            setIsTemporaryData(true);
            console.log('Loaded temporary data from local storage');
          } catch (e) {
            console.error('Failed to load entries from localStorage:', e);
          }
        } else {
          setEntries([]);
          setIsTemporaryData(false);
        }
      }

      // Load current entry from local (works for both auth states)
      const current = localStorage.getItem('currentEntry');
      if (current) {
        try {
          setCurrentEntry(JSON.parse(current) as TimeEntry);
        } catch (e) {
          console.error('Failed to load current entry from localStorage:', e);
        }
      }
    };

    if (bridge) {
      const currentUser = bridge.getUser();
      setUser(currentUser);
      loadInitialData(currentUser);

      // Setup auth state listener for future changes
      let unsubscribe: (() => void) | undefined;

      if (!bridge.isDedicated) {
        unsubscribe = (window as any).palpalAuth?.onAuthStateChanged((u: any) => {
          const user = u ? { uid: u.uid, email: u.email } : null;
          setUser(user);
          loadInitialData(user);
        });
      } else {
        unsubscribe = onAuthStateChanged(dedicatedAuth, (u) => {
          const user = u ? { uid: u.uid, email: u.email } : null;
          setUser(user);
          loadInitialData(user);
        });
      }

      return () => {
        if (unsubscribe) unsubscribe();
      };
    } else {
      // Fallback for no bridge
      const saved = localStorage.getItem('timeEntries');
      if (saved) {
        try {
          setEntries(JSON.parse(saved) as TimeEntry[]);
          setIsTemporaryData(true);
        } catch (e) {
          console.error(e);
        }
      }
      const current = localStorage.getItem('currentEntry');
      if (current) {
        try {
          setCurrentEntry(JSON.parse(current) as TimeEntry);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

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
  const clockIn = (): void => {
    const entry: TimeEntry = {
      id: Date.now(),
      clockIn: new Date().toISOString(),
      clockOut: null,
      tags: []
    };
    setCurrentEntry(entry);
  };

  const clockOut = async (): Promise<void> => {
    if (currentEntry) {
      const completedEntry: TimeEntry = {
        ...currentEntry,
        clockOut: new Date().toISOString()
      };
      const newEntries = [completedEntry, ...entries];
      setEntries(newEntries);
      setCurrentEntry(null);

      // Always sync to cloud if user is authenticated
      if (user && bridge?.isAuthenticated()) {
        try {
          await bridge.saveItem('work-tracker', 'sessions', completedEntry);
          console.log('Entry synced to cloud', completedEntry.id);
        } catch (e) {
          console.error('Cloud sync failed, data kept in local:', e);
          // Data is still in localStorage via useEffect
        }
      } else if (isTemporaryData) {
        // Temporary data - notify user they should sign in to backup
        console.warn('Entry saved locally as temporary data. Sign in to backup to cloud.');
      }
    }
  };

  const addTag = (): void => {
    if (tagInput.trim() && currentEntry) {
      const updatedEntry: TimeEntry = {
        ...currentEntry,
        tags: [...currentEntry.tags, tagInput.trim()]
      };
      setCurrentEntry(updatedEntry);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string): void => {
    if (currentEntry) {
      const updatedEntry: TimeEntry = {
        ...currentEntry,
        tags: currentEntry.tags.filter(tag => tag !== tagToRemove)
      };
      setCurrentEntry(updatedEntry);
    }
  };

  const deleteEntry = async (entryId: number): Promise<void> => {
    if (window.confirm('Delete this entry?')) {
      const updatedEntries = entries.filter(e => e.id !== entryId);
      setEntries(updatedEntries);
      setSelectedEntries(selectedEntries.filter(id => id !== entryId));

      if (bridge && bridge.isAuthenticated()) {
        try {
          // Use 'work-tracker' as project name, matching saveItem calls
          await bridge.deleteItem('work-tracker', 'sessions', entryId);
        } catch (e) {
          console.error('Failed to delete cloud item:', e);
        }
      }
    }
  };

  const addManualTagEntry = async (parentEntry: TimeEntry): Promise<void> => {
    if (!manualTag.trim() || !manualClockIn || !manualClockOut) {
      alert('Please fill in all fields');
      return;
    }

    const parentStart = new Date(parentEntry.clockIn);
    const parentEnd = parentEntry.clockOut ? new Date(parentEntry.clockOut) : new Date();

    const [inHours, inMinutes] = manualClockIn.split(':').map(Number);
    const [outHours, outMinutes] = manualClockOut.split(':').map(Number);

    const clockInDate = new Date(parentStart);
    clockInDate.setHours(inHours, inMinutes, 0, 0);

    const clockOutDate = new Date(parentStart);
    clockOutDate.setHours(outHours, outMinutes, 0, 0);

    if (clockOutDate <= clockInDate) {
      clockOutDate.setDate(clockOutDate.getDate() + 1);
    }

    if (clockInDate < parentStart) {
      alert(`Clock-in time (${formatTime(clockInDate.toISOString())}) is before session start (${formatTime(parentEntry.clockIn)})`);
      return;
    }

    if (clockOutDate > parentEnd) {
      alert(`Clock-out time (${formatTime(clockOutDate.toISOString())}) is after session end (${formatTime(parentEntry.clockOut || '')})`);
      return;
    }

    const newEntry: TimeEntry = {
      id: Date.now(),
      clockIn: clockInDate.toISOString(),
      clockOut: clockOutDate.toISOString(),
      tags: [manualTag.trim()],
      parentId: parentEntry.id,
      isManual: true
    };

    const updatedEntries = [newEntry, ...entries].sort((a, b) =>
      new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime()
    );

    setEntries(updatedEntries);
    setEditingEntry(null);
    setManualTag('');
    setManualClockIn('');
    setManualClockOut('');

    // Sync to cloud if authenticated
    if (user && bridge?.isAuthenticated()) {
      try {
        await bridge.saveItem('work-tracker', 'sessions', newEntry);
        console.log('Manual entry synced to cloud', newEntry.id);
      } catch (e) {
        console.error('Failed to sync manual entry to cloud:', e);
        // Data is kept in localStorage via useEffect
      }
    }
  };

  const clearAllData = (): void => {
    setEntries([]);
    setCurrentEntry(null);
    localStorage.removeItem('timeEntries');
    localStorage.removeItem('currentEntry');
    setShowClearModal(false);
  };

  // Helpers
  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (isoString: string): string => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateDuration = (clockIn: string, clockOut: string | null): string => {
    const start = new Date(clockIn);
    const end = clockOut ? new Date(clockOut) : new Date();
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
  };

  const calculateTotalHours = (clockIn: string, clockOut: string | null): number => {
    const start = new Date(clockIn);
    const end = clockOut ? new Date(clockOut) : new Date();
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  };

  const formatDurationMs = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Reporting Logic
  const getFilteredEntries = (): TimeEntry[] => {
    const now = new Date();
    let filtered = entries.filter(entry => {
      const entryDate = new Date(entry.clockIn);

      if (reportPeriod === 'day') {
        return entryDate.toDateString() === now.toDateString();
      } else if (reportPeriod === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return entryDate >= weekAgo;
      } else if (reportPeriod === 'month') {
        return entryDate.getMonth() === now.getMonth() &&
          entryDate.getFullYear() === now.getFullYear();
      } else if (reportPeriod === 'custom' && customStartDate && customEndDate) {
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        return entryDate >= start && entryDate <= end;
      }
      return true;
    });

    if (selectedTags.length > 0) {
      filtered = filtered.filter(entry => {
        const hasNotTaggedFilter = selectedTags.includes('(Not Tagged)');
        const hasOtherFilters = selectedTags.filter(t => t !== '(Not Tagged)').length > 0;

        if (hasNotTaggedFilter && !hasOtherFilters) {
          return entry.tags.length === 0;
        }

        if (hasNotTaggedFilter && hasOtherFilters) {
          const otherTags = selectedTags.filter(t => t !== '(Not Tagged)');
          return entry.tags.length === 0 || otherTags.every(tag => entry.tags.includes(tag));
        }

        return selectedTags.every(tag => entry.tags.includes(tag));
      });
    }

    return filtered;
  };

  const getTagStats = (): TagStat[] => {
    const filtered = getFilteredEntries();
    const tagMap: Record<string, number> = {};
    let untaggedDuration = 0;

    filtered.forEach(entry => {
      const start = new Date(entry.clockIn);
      const end = entry.clockOut ? new Date(entry.clockOut) : new Date();
      const duration = end.getTime() - start.getTime();

      if (entry.tags.length === 0) {
        untaggedDuration += duration;
      } else {
        entry.tags.forEach(tag => {
          tagMap[tag] = (tagMap[tag] || 0) + duration;
        });
      }
    });

    const stats = Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, duration]) => ({ tag, duration }));

    if (untaggedDuration > 0) {
      stats.push({ tag: '(Not Tagged)', duration: untaggedDuration });
    }

    return stats;
  };

  const getTotalDuration = (): number => {
    const filtered = getFilteredEntries();
    return filtered.reduce((total, entry) => {
      const start = new Date(entry.clockIn);
      const end = entry.clockOut ? new Date(entry.clockOut) : new Date();
      return total + (end.getTime() - start.getTime());
    }, 0);
  };

  // Export Functions
  const exportToCSV = (): void => {
    const entriesToExport = selectedEntries.length > 0
      ? entries.filter(e => selectedEntries.includes(e.id))
      : getFilteredEntries();

    const csv = [
      ['Date', 'Clock In', 'Clock Out', 'Duration (hours)', 'Tags'].join(','),
      ...entriesToExport.map(entry => [
        formatDate(entry.clockIn),
        formatTime(entry.clockIn),
        entry.clockOut ? formatTime(entry.clockOut) : 'N/A',
        calculateTotalHours(entry.clockIn, entry.clockOut).toFixed(2),
        entry.tags.join('; ')
      ].join(','))
    ].join('\n');

    downloadFile(csv, 'work-tracker-export.csv', 'text/csv');
  };

  const exportToJSON = (): void => {
    const entriesToExport = selectedEntries.length > 0
      ? entries.filter(e => selectedEntries.includes(e.id))
      : getFilteredEntries();

    const json = JSON.stringify(entriesToExport, null, 2);
    downloadFile(json, 'work-tracker-export.json', 'application/json');
  };

  const downloadFile = (content: string, filename: string, type: string): void => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addRecentToCalendar = () => {
    const recentEntries = entries.slice(0, 10);
    if (recentEntries.length === 0) {
      alert('No entries to add to calendar');
      return;
    }
    const formatDateForICS = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    const events = recentEntries.map(entry => {
      const startDate = new Date(entry.clockIn);
      const endDate = entry.clockOut ? new Date(entry.clockOut) : new Date();

      const summary = entry.tags.length > 0
        ? `Session ${entry.tags.map(tag => '#' + tag).join(' ')}`
        : 'Session';

      return [
        'BEGIN:VEVENT',
        `UID:${entry.id}@timetracker`,
        `DTSTAMP:${formatDateForICS(new Date())}`,
        `DTSTART:${formatDateForICS(startDate)}`,
        `DTEND:${formatDateForICS(endDate)}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:Tags: ${entry.tags.join(', ') || 'None'}\\nDuration: ${calculateDuration(entry.clockIn, entry.clockOut)}`,
        'END:VEVENT'
      ].join('\r\n');
    }).join('\r\n');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Work Tracker//EN',
      events,
      'END:VCALENDAR'
    ].join('\r\n');
    downloadFile(icsContent, 'recent-work-sessions.ics', 'text/calendar');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-2xl overflow-hidden">
      <ClearDataModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={clearAllData}
      />

      <Header
        user={user}
        isSigningIn={isSigningIn}
        signInError={signInError}
        view={view}
        setView={setView}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      <div className="p-6">
        {view === 'tracker' ? (
          <>
            <ClockInSection
              currentEntry={currentEntry}
              currentTime={currentTime}
              tagInput={tagInput}
              setTagInput={setTagInput}
              onClockIn={clockIn}
              onClockOut={clockOut}
              onAddTag={addTag}
              onRemoveTag={removeTag}
              formatTime={formatTime}
              calculateDuration={calculateDuration}
            />

            <RecentEntriesList
              entries={entries}
              editingEntry={editingEntry}
              setEditingEntry={setEditingEntry}
              manualTag={manualTag}
              setManualTag={setManualTag}
              manualClockIn={manualClockIn}
              setManualClockIn={setManualClockIn}
              manualClockOut={manualClockOut}
              setManualClockOut={setManualClockOut}
              onDeleteEntry={deleteEntry}
              onAddManualEntry={addManualTagEntry}
              formatTime={formatTime}
              formatDate={formatDate}
              calculateDuration={calculateDuration}
            />

            <div className="mt-6 pt-6 border-t border-[#541342]/10 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={exportToCSV}
                  className="p-2.5 bg-white hover:bg-green-50 text-gray-500 hover:text-green-600 rounded-xl transition-colors border border-gray-200 hover:border-green-200 shadow-sm"
                  title="Export CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={exportToJSON}
                  className="p-2.5 bg-white hover:bg-purple-50 text-gray-500 hover:text-purple-600 rounded-xl transition-colors border border-gray-200 hover:border-purple-200 shadow-sm"
                  title="Export JSON"
                >
                  <FileJson className="w-4 h-4" />
                </button>
                <button
                  onClick={addRecentToCalendar}
                  className="p-2.5 bg-white hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-xl transition-colors border border-gray-200 hover:border-blue-200 shadow-sm"
                  title="Add Recent to Calendar"
                >
                  <CalendarPlus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowClearModal(true)}
                className="p-2.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
                title="Clear Data"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <ReportView
            reportPeriod={reportPeriod}
            setReportPeriod={setReportPeriod}
            customStartDate={customStartDate}
            setCustomStartDate={setCustomStartDate}
            customEndDate={customEndDate}
            setCustomEndDate={setCustomEndDate}
            generateReport={() => { }} // Auto-generated
            exportToCSV={exportToCSV}
            tagStats={getTagStats()}
            totalDuration={getTotalDuration()}
            formatDuration={formatDurationMs}
          />
        )}
      </div>
    </div>
  );
}
