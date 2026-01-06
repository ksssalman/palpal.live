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
import RecentSessionsList from './components/tracker/RecentSessionsList';
import ReportView from './components/report/ReportView';

export default function WorkTrackerWidget() {
	// --- 1. Auth & Data ---
	const { user, bridge, isSigningIn, signInError, handleSignIn, handleSignOut } = usePalPalAuth();
	const {
		sessions,
		currentSession,
		addSession,
		updateSession,
		deleteSession,
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

	// Manual Session / Edit UI State
	const [editingSession, setEditingSession] = useState<number | null>(null);
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
		filteredSessions
	} = useReports(sessions);

	// --- 5. Export Logic ---
	const { exportToCSV, exportToJSON, addRecentToCalendar } = useExport(sessions, timezone);

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
		if (!currentSession) return;
		const newTags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
		if (newTags.length === 0) return;

		// Check dupe
		const updatedTags = Array.from(new Set([...currentSession.tags, ...newTags]));
		updateSession(currentSession.id, { tags: updatedTags });
		setTagInput('');
	};

	const handleRemoveTag = (tagToRemove: string) => {
		if (!currentSession) return;
		const updatedTags = currentSession.tags.filter((t: string) => t !== tagToRemove);
		updateSession(currentSession.id, { tags: updatedTags });
	};

	const handleAddManualSession = (sessionData: TimeEntry) => {
		if (editingSession) {
			updateSession(editingSession, {
				tags: sessionData.tags,
				clockIn: sessionData.clockIn,
				clockOut: sessionData.clockOut
			});
			setEditingSession(null);
		} else {
			addSession(sessionData);
		}
		setManualTag('');
		setManualClockIn('');
		setManualClockOut('');
	};

	// Used for RecentSessionsList and ReportView clicks
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
					exportToCSV={() => exportToCSV([], filteredSessions)}
					exportToJSON={() => exportToJSON([], filteredSessions)}
					addRecentToCalendar={addRecentToCalendar}
				/>

				{/* --- View Content --- */}
				<div className="p-6 md:p-8 space-y-8">

					{view === 'tracker' && (
						<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
							{/* Clock In / Activity Section */}
							<ClockInSection
								currentEntry={currentSession}
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

							{/* Sessions List */}
							<RecentSessionsList
								sessions={sessions}
								editingSession={editingSession}
								setEditingSession={setEditingSession}
								manualTag={manualTag}
								setManualTag={setManualTag}
								manualClockIn={manualClockIn}
								setManualClockIn={setManualClockIn}
								manualClockOut={manualClockOut}
								setManualClockOut={setManualClockOut}
								onDeleteSession={deleteSession}
								onAddManualSession={handleAddManualSession}
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
								exportToCSV={() => exportToCSV([], filteredSessions)}
								tagStats={tagStats}
								totalDuration={totalDuration}
								formatDuration={(ms) => (ms / (1000 * 60 * 60)).toFixed(2) + 'h'}
								onTagClick={handleTagClick}
							/>
						</div>
					)}
				</div>
			</div>

			{/* --- Modals --- */}

			<SettingsModal
				isOpen={showSettings}
				onClose={() => setShowSettings(false)}
				timezone={timezone}
				onTimezoneChange={setTimezone}
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
				entries={sessions.filter(s => s.tags.includes(selectedTag || ''))}
				formatDuration={formatDurationMs}
				formatDate={formatDateBound}
			/>

		</div>
	);
}
