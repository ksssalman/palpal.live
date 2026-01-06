import { useState, useEffect } from 'react';
import type { TimeEntry, View } from './types';

// Hooks
import { usePalPalAuth } from './hooks/usePalPalAuth.ts';
import { useEntries } from './hooks/useEntries.ts';
import { useSettings } from './hooks/useSettings.ts';
import { useReports } from './hooks/useReports.ts';
import { useExport } from './hooks/useExport.ts';

// Utils
import { calculateDuration, formatTime, formatDate, formatDurationMs } from './utils/dateUtils';

// Components
import Header from './components/common/Header';
import ClearDataModal from './components/common/ClearDataModal';
import SettingsModal from './components/common/SettingsModal';
import TagDetailsModal from './components/common/TagDetailsModal';
import ClockInSection from './components/tracker/ClockInSection';
import RecentEntriesList from './components/tracker/RecentEntriesList';
import ReportView from './components/report/ReportView';

export default function TimeTrackerWidget() {
  // --- 1. Auth & Data ---
  const { user, bridge, isSigningIn, signInError, handleSignIn, handleSignOut } = usePalPalAuth();
  const {
    entries,
    currentEntry,
    addEntry,
    updateEntry,
    deleteEntry,
    startSession,
    stopSession,
    clearAllData,
    isTemporaryData
  } = useEntries(user, bridge);

  // --- 2. Settings & Timezone ---
  const { timezone, setTimezone } = useSettings(user, bridge);

  // --- 3. UI State ---
  const [view, setView] = useState<View>('tracker');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Tracker UI Input State
  const [tagInput, setTagInput] = useState<string>('');

  // Manual Entry / Edit UI State
  const [editingEntry, setEditingEntry] = useState<number | null>(null);
  const [manualTag, setManualTag] = useState<string>('');
  const [manualClockIn, setManualClockIn] = useState<string>('');
  const [manualClockOut, setManualClockOut] = useState<string>('');

  // --- 4. Reports Logic ---
  const {
    reportPeriod,
    setReportPeriod,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    tagStats,
    totalDuration,
    filteredEntries
  } = useReports(entries);

  // --- 5. Export Logic ---
  const { exportToCSV, exportToJSON, addRecentToCalendar } = useExport(entries, timezone);

  // Helpers bound to timezone for passing down
  const formatTimeBound = (d: string) => formatTime(d, timezone);
  const calculateDurationBound = (start: string, end: string | null) => calculateDuration(start, end);
  const formatDateBound = (d: string) => formatDate(d, timezone);

  // --- Effects ---
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // --- Handlers ---

  const handleClockIn = () => {
    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
    startSession(tags);
    setTagInput('');
  };

  const handleAddTag = () => {
    if (!currentEntry) return;
    const newTags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
    if (newTags.length === 0) return;

    // Check dupe
    const updatedTags = Array.from(new Set([...currentEntry.tags, ...newTags]));
    updateEntry(currentEntry.id, { tags: updatedTags });
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!currentEntry) return;
    const updatedTags = currentEntry.tags.filter((t: string) => t !== tagToRemove);
    updateEntry(currentEntry.id, { tags: updatedTags });
  };

  const handleAddManualEntry = (entryData: TimeEntry) => {
    if (editingEntry) {
      updateEntry(editingEntry, {
        tags: entryData.tags,
        clockIn: entryData.clockIn,
        clockOut: entryData.clockOut
      });
      setEditingEntry(null);
    } else {
      addEntry(entryData);
    }
    setManualTag('');
    setManualClockIn('');
    setManualClockOut('');
  };

  // Used for RecentEntriesList and ReportView clicks
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  // --- Render ---

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 pb-24 font-brand">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-purple-500/10">

        {/* Header */}
        <Header
          view={view}
          setView={setView}
          // Auth
          user={user}
          isSigningIn={isSigningIn}
          signInError={signInError}
          onSignIn={() => handleSignIn(isTemporaryData)}
          onSignOut={handleSignOut}

          // Data
          isTemporaryData={isTemporaryData}
          setShowClearModal={setShowClearModal}
          setShowSettings={setShowSettings}
          exportToCSV={() => exportToCSV([], filteredEntries)}
          exportToJSON={() => exportToJSON([], filteredEntries)}
          addRecentToCalendar={addRecentToCalendar}
        />

        {/* --- View Content --- */}
        <div className="p-6 md:p-8 space-y-8">

          {view === 'tracker' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Clock In / Activity Section */}
              <ClockInSection
                currentEntry={currentEntry}
                currentTime={currentTime}
                tagInput={tagInput}
                setTagInput={setTagInput}
                onClockIn={handleClockIn}
                onClockOut={stopSession}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
                formatTime={formatTimeBound}
                calculateDuration={calculateDurationBound}
                timezone={timezone}
                onTagClick={handleTagClick}
              />

              {/* Entries List */}
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
                onAddManualEntry={handleAddManualEntry}
                formatTime={formatTimeBound}
                formatDate={formatDateBound}
                calculateDuration={calculateDurationBound}
                onTagClick={handleTagClick}
              />
            </div>
          )}

          {view === 'report' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ReportView
                reportPeriod={reportPeriod}
                setReportPeriod={setReportPeriod}
                customStartDate={customStartDate}
                setCustomStartDate={setCustomStartDate}
                customEndDate={customEndDate}
                setCustomEndDate={setCustomEndDate}
                generateReport={() => {}} // Auto-handled by hook logic now
                exportToCSV={() => exportToCSV([], filteredEntries)}
                tagStats={tagStats}
                totalDuration={totalDuration}
                formatDuration={(ms) => (ms / (1000 * 60 * 60)).toFixed(2) + 'h'}
                onTagClick={handleTagClick}
              />

              {/* Search/Filter UI for Reports could be added here or inside ReportView
                  Since we moved state to hook (searchTerm), passing it down would be good if ReportView supports it.
                  Currently ReportView doesn't seem to have search input props.
                  I'll leave it as is for now - clicking tags filters, but clearing filter might need UI.
               */}
            </div>
          )}
        </div>
      </div>

      {/* --- Modals --- */}

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        timezone={timezone}
        onTimezoneChange={setTimezone} // Renamed prop match
      />

      <ClearDataModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={() => {
          clearAllData();
          setShowClearModal(false);
        }}
      />

      <TagDetailsModal
        isOpen={!!selectedTag}
        onClose={() => setSelectedTag(null)}
        tagName={selectedTag || ''}
        entries={entries.filter(e => e.tags.includes(selectedTag || ''))}
        formatDuration={formatDurationMs}
        formatDate={formatDateBound}
      />

    </div>
  );
}
