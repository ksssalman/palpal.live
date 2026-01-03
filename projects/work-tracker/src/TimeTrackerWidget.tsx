import { BarChart3, Calendar, CalendarPlus, Download, Edit3, Plus, Tag, Trash2, X, Cloud, CloudOff, LogOut, LogIn, FileJson } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getPalPalBridge } from './utils/palpalBridge';
import { auth as dedicatedAuth, googleProvider } from './utils/firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

// Type definitions
interface TimeEntry {
  id: number;
  clockIn: string;
  clockOut: string | null;
  tags: string[];
  parentId?: number;
  isManual?: boolean;
}

interface TagStat {
  tag: string;
  hours: number;
}

type View = 'tracker' | 'report';
type ReportPeriod = 'day' | 'week' | 'month';

export default function TimeTrackerWidget() {
  // State with proper types
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const bridge = getPalPalBridge();
  const [user, setUser] = useState<any>(null);
  const [tagInput, setTagInput] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [view, setView] = useState<View>('tracker');
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('week');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);
  const [editingEntry, setEditingEntry] = useState<number | null>(null);
  const [manualTag, setManualTag] = useState<string>('');
  const [manualClockIn, setManualClockIn] = useState<string>('');
  const [manualClockOut, setManualClockOut] = useState<string>('');
  const [showClearModal, setShowClearModal] = useState<boolean>(false);
  const [clearOption, setClearOption] = useState<'all' | 'date' | null>(null);
  const [clearDate, setClearDate] = useState<string>('');

  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setSignInError(null);
      console.log('Attempting to sign in with Google...');
      await signInWithPopup(dedicatedAuth, googleProvider);
      console.log('Sign in successful');
    } catch (e: any) {
      const errorMessage = e?.message || 'Sign in failed. Please try again.';
      console.error('Sign in failed:', e);
      setSignInError(errorMessage);
      // Auto-clear error after 5 seconds
      setTimeout(() => setSignInError(null), 5000);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(dedicatedAuth);
      console.log('Sign out successful');
      // Data remains in state (local mode fallback)
    } catch (e) {
      console.error('Sign out failed:', e);
    }
  };

  // Update current time every second when there's an active session
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
    
    const loadInitialData = async () => {
      if (!bridge) return;
      
      // Load local data first
      const saved = localStorage.getItem('timeEntries');
      if (saved) {
        try {
          setEntries(JSON.parse(saved) as TimeEntry[]);
        } catch (e) {
          console.error('Failed to load entries from localStorage:', e);
        }
      }
      
      const current = localStorage.getItem('currentEntry');
      if (current) {
        try {
          setCurrentEntry(JSON.parse(current) as TimeEntry);
        } catch (e) {
          console.error('Failed to load current entry from localStorage:', e);
        }
      }
      
      // If authenticated, load cloud data and override
      if (bridge.isAuthenticated()) {
        try {
          const remoteEntries = await bridge.getAllItems('work-tracker', 'sessions');
          if (remoteEntries && remoteEntries.length > 0) {
            setEntries(remoteEntries as TimeEntry[]);
            console.log('Loaded entries from cloud:', remoteEntries.length);
          }
        } catch (e) {
          console.error('Failed to load cloud data:', e);
        }
      }
    };
    
    if (bridge) {
      setUser(bridge.getUser());

      let unsubscribe: (() => void) | undefined;

      if (!bridge.isDedicated) {
        unsubscribe = (window as any).palpalAuth?.onAuthStateChanged((u: any) => {
          const user = u ? { uid: u.uid, email: u.email } : null;
          setUser(user);
          if (user) {
            loadInitialData();
          }
        });
      } else {
        unsubscribe = onAuthStateChanged(dedicatedAuth, (u) => {
          const user = u ? { uid: u.uid, email: u.email } : null;
          setUser(user);
          if (user) {
            loadInitialData();
          }
        });
      }

      loadInitialData();

      return () => {
        if (unsubscribe) unsubscribe();
      };
    } else {
      // No bridge available, just load local data
      const saved = localStorage.getItem('timeEntries');
      if (saved) {
        try {
          setEntries(JSON.parse(saved) as TimeEntry[]);
        } catch (e) {
          console.error('Failed to load entries:', e);
        }
      }
      const current = localStorage.getItem('currentEntry');
      if (current) {
        try {
          setCurrentEntry(JSON.parse(current) as TimeEntry);
        } catch (e) {
          console.error('Failed to load current entry:', e);
        }
      }
    }
  }, []);

  // Save entries to localStorage and cloud
  useEffect(() => {
    localStorage.setItem('timeEntries', JSON.stringify(entries));
    
    // Sync to cloud if authenticated
    if (bridge?.isAuthenticated() && entries.length > 0) {
      console.log('Entries synced to localStorage, cloud sync via individual saves');
    }
  }, [entries]);

  // Save current entry to localStorage
  useEffect(() => {
    if (currentEntry) {
      localStorage.setItem('currentEntry', JSON.stringify(currentEntry));
    } else {
      localStorage.removeItem('currentEntry');
    }
  }, [currentEntry]);

  // Clock in
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

      // Cloud sync
      if (bridge?.isAuthenticated()) {
        try {
          const syncResult = await bridge.saveItem('work-tracker', 'sessions', completedEntry);
          if (syncResult) {
            console.log('Entry saved to cloud with ID:', syncResult);
          }
        } catch (e) {
          console.error('Cloud sync failed - entry remains in local storage', e);
        }
      } else {
        console.log('Entry saved to local storage only (not authenticated)');
      }
    }
  };

  // Toggle tag selection
  const toggleTagFilter = (tag: string): void => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Clear all tag filters
  const clearTagFilters = (): void => {
    setSelectedTags([]);
  };

  // Add tag to current entry
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

  // Remove tag from current entry
  const removeTag = (tagToRemove: string): void => {
    if (currentEntry) {
      const updatedEntry: TimeEntry = {
        ...currentEntry,
        tags: currentEntry.tags.filter(tag => tag !== tagToRemove)
      };
      setCurrentEntry(updatedEntry);
    }
  };

  // Delete an entry
  const deleteEntry = (entryId: number): void => {
    if (window.confirm('Delete this entry?')) {
      const updatedEntries = entries.filter(e => e.id !== entryId);
      setEntries(updatedEntries);
      setSelectedEntries(selectedEntries.filter(id => id !== entryId));
    }
  };

  // Format ISO string to HH:MM
  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Format ISO string to date
  const formatDate = (isoString: string): string => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate duration between clock in and out
  const calculateDuration = (clockIn: string, clockOut: string | null): string => {
    const start = new Date(clockIn);
    const end = clockOut ? new Date(clockOut) : new Date();
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
  };

  // Calculate total hours as decimal
  const calculateTotalHours = (clockIn: string, clockOut: string | null): number => {
    const start = new Date(clockIn);
    const end = clockOut ? new Date(clockOut) : new Date();
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  };

  // Get filtered entries based on period and tag
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
      }
      return true;
    });

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(entry => {
        // Check if "(Not Tagged)" is selected
        const hasNotTaggedFilter = selectedTags.includes('(Not Tagged)');
        const hasOtherFilters = selectedTags.filter(t => t !== '(Not Tagged)').length > 0;

        // If only "(Not Tagged)" is selected, show entries with no tags
        if (hasNotTaggedFilter && !hasOtherFilters) {
          return entry.tags.length === 0;
        }

        // If "(Not Tagged)" + other tags selected, show entries matching other tags OR no tags
        if (hasNotTaggedFilter && hasOtherFilters) {
          const otherTags = selectedTags.filter(t => t !== '(Not Tagged)');
          return entry.tags.length === 0 || otherTags.every(tag => entry.tags.includes(tag));
        }

        // If only regular tags selected, entry must have ALL selected tags
        return selectedTags.every(tag => entry.tags.includes(tag));
      });
    }

    return filtered;
  };

  // Get tag statistics
  const getTagStats = (): TagStat[] => {
    const filtered = getFilteredEntries();
    const tagMap: Record<string, number> = {};
    let untaggedHours = 0;

    filtered.forEach(entry => {
      const hours = calculateTotalHours(entry.clockIn, entry.clockOut);
      if (entry.tags.length === 0) {
        untaggedHours += hours;
      } else {
        entry.tags.forEach(tag => {
          tagMap[tag] = (tagMap[tag] || 0) + hours;
        });
      }
    });

    const stats = Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, hours]) => ({ tag, hours }));

    // Add untagged entries if any exist
    if (untaggedHours > 0) {
      stats.push({ tag: '(Not Tagged)', hours: untaggedHours });
    }

    return stats;
  };

  // Get total hours for period
  const getTotalHours = (): number => {
    const filtered = getFilteredEntries();
    return filtered.reduce((total, entry) => {
      return total + calculateTotalHours(entry.clockIn, entry.clockOut);
    }, 0);
  };

  // Toggle entry selection

  // Export to CSV
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
  };  // Export to JSON
  const exportToJSON = (): void => {
    const entriesToExport = selectedEntries.length > 0
      ? entries.filter(e => selectedEntries.includes(e.id))
      : getFilteredEntries();

    const json = JSON.stringify(entriesToExport, null, 2);
    downloadFile(json, 'work-tracker-export.json', 'application/json');
  };

  // Download file helper
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

  // Add entry to calendar

  // Add selected entries to calendar
  const addSelectedToCalendar = (): void => {
    if (selectedEntries.length === 0) return;

    const entriesToAdd = entries.filter(e => selectedEntries.includes(e.id));

    const formatDateForICS = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const events = entriesToAdd.map(entry => {
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

    downloadFile(icsContent, 'work-sessions.ics', 'text/calendar');
    setSelectedEntries([]);
  };

  // Add manual tag entry
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
      // eslint-disable-next-line react-hooks/purity
      id: Date.now(),
      clockIn: clockInDate.toISOString(),
      clockOut: clockOutDate.toISOString(),
      tags: [manualTag.trim()],
      parentId: parentEntry.id,
      isManual: true
    };

    setEntries([newEntry, ...entries]);
    setEditingEntry(null);
    setManualTag('');
    setManualClockIn('');
    setManualClockOut('');
    
    // Sync to cloud if authenticated
    if (bridge?.isAuthenticated()) {
      try {
        const syncResult = await bridge.saveItem('work-tracker', 'sessions', newEntry);
        if (syncResult) {
          console.log('Manual entry saved to cloud with ID:', syncResult);
        }
      } catch (e) {
        console.error('Failed to sync manual entry to cloud:', e);
      }
    }
  };

  // Clear data functions
  const clearAllData = (): void => {
    if (window.confirm('Are you sure you want to delete ALL entries? This cannot be undone.')) {
      setEntries([]);
      setCurrentEntry(null);
      localStorage.removeItem('timeEntries');
      localStorage.removeItem('currentEntry');
      setShowClearModal(false);
      alert('All data has been cleared.');
    }
  };

  const clearDataByDate = (): void => {
    if (!clearDate) {
      alert('Please select a date');
      return;
    }

    const selectedDate = new Date(clearDate);
    const filtered = entries.filter(entry => {
      const entryDate = new Date(entry.clockIn);
      return entryDate.toDateString() !== selectedDate.toDateString();
    });

    if (filtered.length === entries.length) {
      alert('No entries found for the selected date.');
      return;
    }

    if (window.confirm(`Delete ${entries.length - filtered.length} entries from ${selectedDate.toLocaleDateString()}?`)) {
      setEntries(filtered);
      setShowClearModal(false);
      setClearDate('');
      alert('Entries deleted successfully.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Clear Data Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border-2 border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-400" />
                Clear Data
              </h2>
              <button
                onClick={() => {
                  setShowClearModal(false);
                  setClearOption(null);
                  setClearDate('');
                }}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setClearOption('date')}
                className={`w-full p-4 rounded-lg border-2 transition text-left ${clearOption === 'date'
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-slate-600 hover:border-slate-500'
                  }`}
              >
                <div className="font-semibold mb-1">Clear by Date</div>
                <div className="text-sm text-gray-400">Delete all entries from a specific date</div>
              </button>

              {clearOption === 'date' && (
                <div className="ml-4 space-y-3">
                  <input
                    type="date"
                    value={clearDate}
                    onChange={(e) => setClearDate(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <button
                    onClick={clearDataByDate}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium"
                  >
                    Delete Entries
                  </button>
                </div>
              )}

              <button
                onClick={() => setClearOption('all')}
                className={`w-full p-4 rounded-lg border-2 transition text-left ${clearOption === 'all'
                  ? 'border-red-500 bg-red-500/20'
                  : 'border-slate-600 hover:border-slate-500'
                  }`}
              >
                <div className="font-semibold mb-1 text-red-400">Clear All Data</div>
                <div className="text-sm text-gray-400">Delete all entries permanently</div>
              </button>

              {clearOption === 'all' && (
                <div className="ml-4">
                  <button
                    onClick={clearAllData}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition font-medium"
                  >
                    Delete All Entries
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg relative">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" />
              <path d="M3 11h18" stroke="currentColor" strokeWidth="2" />
            </svg>
            <h1 className="text-xl font-bold">Work Tracker</h1>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30 backdrop-blur-sm">
                <Cloud className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">Cloud Synced</span>
                {bridge?.isDedicated && (
                  <button
                    onClick={handleSignOut}
                    className="ml-2 p-1.5 text-emerald-400 hover:text-white hover:bg-emerald-500/20 rounded-lg transition-all duration-200"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600/50 backdrop-blur-sm">
                  <CloudOff className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-400">Local Only</span>
                </div>
                {bridge?.isDedicated && (
                  <button
                    onClick={handleSignIn}
                    disabled={isSigningIn}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-sm ${
                      isSigningIn
                        ? 'bg-blue-500/50 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20'
                    }`}
                    title={isSigningIn ? 'Signing in...' : 'Enable Cloud Sync'}
                  >
                    {isSigningIn ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Connecting...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span className="text-sm">Sign In</span>
                      </>
                    )}
                  </button>
                )}
                {signInError && (
                  <div className="absolute top-full right-4 mt-2 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm shadow-lg z-40 whitespace-nowrap backdrop-blur-sm border border-red-400/30">
                    {signInError}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setView('tracker')}
                className={`p-2.5 rounded-lg transition-all duration-200 ${view === 'tracker' ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'
                  }`}
                title="Tracker View"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <button
                onClick={() => setView('report')}
                className={`p-2.5 rounded-lg transition-all duration-200 ${view === 'report' ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'
                  }`}
                title="Report View"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {view === 'tracker' ? (
          <>
            {/* Clock In/Out Section */}
            <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
              {!currentEntry ? (
                <button
                  onClick={clockIn}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Clock In
                </button>
              ) : (
                <div>
                  <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-6 mb-6 border border-slate-700/50 backdrop-blur-sm">
                    <div className="grid grid-cols-3 gap-4">
                      {/* Current Time */}
                      <div className="text-center">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Current Time</div>
                        <div className="text-2xl font-bold text-blue-400">
                          {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </div>
                        <div className="text-xs text-blue-300 mt-1">
                          {currentTime.toLocaleTimeString('en-US', { second: '2-digit' }).split(' ')[0]}
                        </div>
                      </div>

                      {/* Clock In Time */}
                      <div className="text-center border-l border-r border-slate-600/50">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Clocked In</div>
                        <div className="text-2xl font-bold text-green-400">
                          {formatTime(currentEntry.clockIn)}
                        </div>
                        <div className="text-xs text-green-300 mt-1">
                          {new Date(currentEntry.clockIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="text-center">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Duration</div>
                        <div className="text-2xl font-bold text-purple-400">
                          {calculateDuration(currentEntry.clockIn, null)}
                        </div>
                        <div className="text-xs text-purple-300 mt-1">Active Session</div>
                      </div>
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Tag className="w-4 h-4" />
                      Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        placeholder="Add a tag..."
                        className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                      <button
                        onClick={addTag}
                        className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentEntry.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-400 transition"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={clockOut}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
                  >
                    Clock Out
                  </button>
                </div>
              )}
            </div>

            {/* Recent Entries */}
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Entries
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {entries.slice(0, 10).map(entry => (
                  <div key={entry.id}>
                    <div
                      className={`bg-slate-800 rounded-lg p-4 border relative ${entry.isManual ? 'border-purple-500/50 ml-4' : 'border-slate-700'
                        }`}
                    >
                      {entry.isManual && (
                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-purple-500"></div>
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-400">{formatDate(entry.clockIn)}</p>
                            {entry.isManual && (
                              <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded">
                                Manual
                              </span>
                            )}
                          </div>
                          <p className="font-semibold">
                            {formatTime(entry.clockIn)} - {entry.clockOut ? formatTime(entry.clockOut) : 'N/A'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400 font-semibold">
                            {calculateDuration(entry.clockIn, entry.clockOut)}
                          </span>
                          {!entry.isManual && (
                            <button
                              onClick={() => {
                                setEditingEntry(entry.id);
                                setManualClockIn('');
                                setManualClockOut('');
                                setManualTag('');
                              }}
                              className="p-1.5 bg-purple-600 hover:bg-purple-700 rounded transition"
                              title="Add manual tag entry"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="p-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded transition"
                            title="Delete entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded text-xs ${entry.isManual
                                ? 'bg-purple-600/30 text-purple-300'
                                : 'bg-slate-700 text-gray-300'
                                }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Manual Entry Form */}
                    {editingEntry === entry.id && (
                      <div className="ml-4 mt-2 bg-slate-700/50 rounded-lg p-4 border border-purple-500/50">
                        <h3 className="text-sm font-semibold mb-3 text-purple-300">
                          Add Manual Tag Entry
                        </h3>
                        <p className="text-xs text-gray-400 mb-3">
                          Session: {formatTime(entry.clockIn)} - {entry.clockOut ? formatTime(entry.clockOut) : 'N/A'}
                        </p>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Tag</label>
                            <input
                              type="text"
                              value={manualTag}
                              onChange={(e) => setManualTag(e.target.value)}
                              placeholder="e.g., Meeting, Coding"
                              className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-gray-400 block mb-1">Clock In</label>
                              <input
                                type="time"
                                value={manualClockIn}
                                onChange={(e) => setManualClockIn(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-400 block mb-1">Clock Out</label>
                              <input
                                type="time"
                                value={manualClockOut}
                                onChange={(e) => setManualClockOut(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => addManualTagEntry(entry)}
                              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition text-sm"
                            >
                              Add Entry
                            </button>
                            <button
                              onClick={() => {
                                setEditingEntry(null);
                                setManualTag('');
                                setManualClockIn('');
                                setManualClockOut('');
                              }}
                              className="px-4 bg-slate-600 hover:bg-slate-500 text-white py-2 rounded transition text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Compact Export and Calendar Actions */}
            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={exportToCSV}
                  className="p-2 bg-slate-700 hover:bg-green-600 text-gray-300 hover:text-white rounded-lg transition-colors"
                  title="Export CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={exportToJSON}
                  className="p-2 bg-slate-700 hover:bg-purple-600 text-gray-300 hover:text-white rounded-lg transition-colors"
                  title="Export JSON"
                >
                  <FileJson className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
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
                  }}
                  className="p-2 bg-slate-700 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg transition-colors"
                  title="Add Recent to Calendar"
                >
                  <CalendarPlus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowClearModal(true)}
                className="p-2 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                title="Clear Data"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Report View */}
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                {(['day', 'week', 'month'] as const).map(period => (
                  <button
                    key={period}
                    onClick={() => setReportPeriod(period)}
                    className={`flex-1 py-2 rounded-lg font-medium transition ${reportPeriod === period
                      ? 'bg-blue-600'
                      : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>

              {selectedEntries.length > 0 && (
                <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {selectedEntries.length} {selectedEntries.length === 1 ? 'entry' : 'entries'} selected
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={addSelectedToCalendar}
                        className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm flex items-center gap-1 transition"
                      >
                        <CalendarPlus className="w-3 h-3" />
                        Add to Calendar
                      </button>
                      <button
                        onClick={() => setSelectedEntries([])}
                        className="bg-slate-600 hover:bg-slate-700 text-white py-1 px-3 rounded text-sm transition"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Total Hours */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6 text-center">
                <p className="text-sm text-blue-100 mb-1">Total Hours</p>
                <p className="text-4xl font-bold">
                  {Math.floor(getTotalHours()).toString().padStart(2, '0')}h {Math.round((getTotalHours() % 1) * 60).toString().padStart(2, '0')}m
                </p>
                <p className="text-sm text-blue-100 mt-1">
                  {reportPeriod === 'day' ? 'Today' : `This ${reportPeriod}`}
                </p>
              </div>

              {/* Tag Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Hours by Tag</h3>
                {selectedTags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Filtered by:</span>
                      <button
                        onClick={clearTagFilters}
                        className="text-sm text-blue-400 hover:text-blue-300 transition"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTagFilter(tag)}
                          className="bg-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-2 hover:bg-blue-700 transition"
                        >
                          {tag}
                          <X className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {getTagStats().map(({ tag, hours }) => (
                    <button
                      key={tag}
                      onClick={() => toggleTagFilter(tag)}
                      className={`w-full bg-slate-800 rounded-lg p-4 border transition text-left ${selectedTags.includes(tag)
                        ? 'border-blue-500 ring-2 ring-blue-500/50 hover:border-blue-500'
                        : tag === '(Not Tagged)'
                          ? 'border-slate-700 hover:border-gray-500'
                          : 'border-slate-700 hover:border-blue-500'
                        }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${tag === '(Not Tagged)' ? 'text-gray-400 italic' : ''}`}>
                            {tag}
                          </span>
                          {selectedTags.includes(tag) && (
                            <span className="text-xs bg-blue-500 px-2 py-0.5 rounded">Selected</span>
                          )}
                        </div>
                        <span className="text-blue-400 font-semibold">
                          {Math.floor(hours).toString().padStart(2, '0')}h {Math.round((hours % 1) * 60).toString().padStart(2, '0')}m
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${tag === '(Not Tagged)'
                            ? 'bg-gradient-to-r from-gray-500 to-gray-600'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500'
                            }`}
                          style={{ width: `${(hours / getTotalHours()) * 100}%` }}
                        />
                      </div>
                    </button>
                  ))}
                  {getTagStats().length === 0 && (
                    <p className="text-gray-400 text-center py-8">
                      No tagged entries for this period
                    </p>
                  )}
                </div>
              </div>

              {/* Filtered Entries List */}
              {selectedTags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Filtered Entries ({getFilteredEntries().length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {getFilteredEntries().map(entry => (
                      <div
                        key={entry.id}
                        className="bg-slate-800 rounded-lg p-4 border border-slate-700"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-start gap-3 flex-1">
                            <input
                              type="checkbox"
                              checked={selectedEntries.includes(entry.id)}
                              onChange={() => {
                                setSelectedEntries(prev =>
                                  prev.includes(entry.id)
                                    ? prev.filter(id => id !== entry.id)
                                    : [...prev, entry.id]
                                );
                              }}
                              className="mt-1 w-4 h-4 rounded border border-slate-600 bg-slate-700 checked:bg-blue-600 checked:border-blue-600 cursor-pointer accent-blue-600"
                            />
                            <div>
                              <p className="text-sm text-gray-400">{formatDate(entry.clockIn)}</p>
                              <p className="font-semibold">
                                {formatTime(entry.clockIn)} - {entry.clockOut ? formatTime(entry.clockOut) : 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-400 font-semibold">
                              {calculateDuration(entry.clockIn, entry.clockOut)}
                            </span>
                            <button
                              onClick={() => deleteEntry(entry.id)}
                              className="p-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded transition"
                              title="Delete entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 ml-7">
                            {entry.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded text-xs ${selectedTags.includes(tag)
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-700 text-gray-300'
                                  }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}