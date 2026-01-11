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
		isTemporaryData,
		loadDemoData,
		deleteAllDemoSessions
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

	const handleClockOut = async () => {
		console.log('🔴 CLOCK OUT BUTTON CLICKED');
		try {
			await stopSession();
			console.log('✅ CLOCK OUT COMPLETED SUCCESSFULLY');
		} catch (error) {
			console.error('❌ Clock out error:', error);
		}
	};

	const handleAddTag = () => {
		if (!currentSession) {
			console.warn('⚠️  Cannot add tag: No active session');
			return;
		}
		const newTags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
		if (newTags.length === 0) {
			console.warn('⚠️  No valid tags to add');
			return;
		}

		const updatedTags = Array.from(new Set([...currentSession.tags, ...newTags]));
		console.log('🏷️  ADDING TAGS:', { newTags, total: updatedTags });
		updateSession(currentSession.id, { tags: updatedTags });
		setTagInput('');
	};

	const handleRemoveTag = (tagToRemove: string) => {
		if (!currentSession) {
			console.warn('⚠️  Cannot remove tag: No active session');
			return;
		}
		const updatedTags = currentSession.tags.filter((t: string) => t !== tagToRemove);
		console.log('🗑️  REMOVING TAG:', { removed: tagToRemove, remaining: updatedTags });
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

					setShowClearModal={setShowClearModal}
					setShowSettings={setShowSettings}
					exportToCSV={() => exportToCSV([], filteredSessions)}
					exportToJSON={() => exportToJSON([], filteredSessions)}
					addRecentToCalendar={addRecentToCalendar}
				/>

				{/* --- View Content --- */}
				<div className="p-6 md:p-8 space-y-8">

					{!user ? (
						<div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
							<div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-purple-500/20">
								<svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
							</div>
							<h2 className="text-3xl font-bold text-slate-800 mb-3">Sign In Required</h2>
							<p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
								Please sign in with your Google account to access your work tracker and sync your sessions across devices.
							</p>
							<button
								onClick={() => handleSignIn(false)}
								className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-purple-600/30 flex items-center gap-2"
							>
								<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
								</svg>
								Sign In with Google
							</button>
						</div>
					) : (
						<>
							{view === 'tracker' && (
								<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
									{/* Clock In / Activity Section */}
									<ClockInSection
										currentEntry={currentSession}
										currentTime={currentTime}
										tagInput={tagInput}
										setTagInput={setTagInput}
										onClockIn={handleClockIn}
										onClockOut={handleClockOut}
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
						</>
					)}
				</div>
			</div>

			{/* --- Modals --- */}

			<SettingsModal
				isOpen={showSettings}
				onClose={() => setShowSettings(false)}
				timezone={timezone}
				onTimezoneChange={setTimezone}
				onLoadDemoData={loadDemoData}
				onRemoveDemoData={deleteAllDemoSessions}
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
