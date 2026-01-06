import { Calendar, Edit3, Trash2 } from 'lucide-react';
import type { TimeEntry } from '../../types';

interface RecentSessionsListProps {
	sessions: TimeEntry[];
	editingSession: number | null;
	setEditingSession: (id: number | null) => void;
	manualTag: string;
	setManualTag: (val: string) => void;
	manualClockIn: string;
	setManualClockIn: (val: string) => void;
	manualClockOut: string;
	setManualClockOut: (val: string) => void;
	onDeleteSession: (id: number) => void;
	onAddManualSession: (session: TimeEntry) => void;
	formatTime: (iso: string) => string;
	formatDate: (iso: string) => string;
	calculateDuration: (start: string, end: string | null) => string;
	onTagClick?: (tag: string) => void;
}

export default function RecentSessionsList({
	sessions,
	editingSession,
	setEditingSession,
	manualTag,
	setManualTag,
	manualClockIn,
	setManualClockIn,
	manualClockOut,
	setManualClockOut,
	onDeleteSession,
	onAddManualSession,
	formatTime,
	formatDate,
	calculateDuration,
	onTagClick
}: RecentSessionsListProps) {
	return (
		<div>
			<h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
				<Calendar className="w-5 h-5" />
				Recent Sessions
			</h2>
			<div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
				{sessions.slice(0, 10).map(session => (
					<div key={session.id}>
						<div
							className={`bg-slate-800 rounded-lg p-4 border relative transition-all ${session.isManual ? 'border-purple-500/50 ml-4' : 'border-slate-700'
								}`}
						>
							{session.isManual && (
								<div className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-purple-500"></div>
							)}
							<div className="flex justify-between items-start mb-2">
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<p className="text-sm text-slate-400 font-medium">{formatDate(session.clockIn)}</p>
										{session.isManual && (
											<span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded">Manual</span>
										)}
									</div>
									<p className="font-bold text-white text-lg">
										{formatTime(session.clockIn)} - {session.clockOut ? formatTime(session.clockOut) : 'N/A'}
									</p>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-white font-bold text-sm">
										{calculateDuration(session.clockIn, session.clockOut)}
									</span>
									{!session.isManual && (
										<button
											onClick={() => {
												setEditingSession(session.id);
												setManualClockIn('');
												setManualClockOut('');
												setManualTag('');
											}}
											className="p-1.5 bg-purple-600 hover:bg-purple-700 rounded transition"
											title="Add manual tag session"
										>
											<Edit3 className="w-4 h-4 text-white" />
										</button>
									)}
									<button
										onClick={() => onDeleteSession(session.id)}
										className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition"
										title="Delete session"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</div>
							{session.tags.length > 0 && (
								<div className="flex flex-wrap gap-1">
									{session.tags.map((tag, idx) => (
										<span
											key={idx}
											onClick={() => onTagClick?.(tag)}
											className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${session.isManual
												? 'bg-purple-600/30 text-purple-300'
												: 'bg-slate-700 text-slate-300'
												} ${onTagClick ? 'cursor-pointer hover:bg-purple-600 hover:text-white' : ''}`}
										>
											{tag}
										</span>
									))}
								</div>
							)}
						</div>

						{/* Manual Session Form */}
						{editingSession === session.id && (
							<div className="ml-4 mt-2 bg-slate-700/50 rounded-lg p-4 border border-purple-500/50">
								<h3 className="text-sm font-semibold mb-3 text-purple-300">
									Add Manual Tag Session
								</h3>
								<p className="text-xs text-slate-400 mb-4">
									Session: {formatTime(session.clockIn)} - {session.clockOut ? formatTime(session.clockOut) : 'N/A'}
								</p>
								<div className="space-y-4">
									<div>
										<label className="text-xs font-bold text-slate-300 block mb-1.5">Tag</label>
										<input
											type="text"
											value={manualTag}
											onChange={(e) => setManualTag(e.target.value)}
											placeholder="e.g., Meeting, Coding"
											className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
										/>
									</div>
									<div className="grid grid-cols-2 gap-3">
										<div>
											<label className="text-xs font-bold text-slate-300 block mb-1.5">Clock In</label>
											<input
												type="time"
												aria-label="Clock In Time"
												value={manualClockIn}
												onChange={(e) => setManualClockIn(e.target.value)}
												className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
											/>
										</div>
										<div>
											<label className="text-xs font-bold text-slate-300 block mb-1.5">Clock Out</label>
											<input
												type="time"
												aria-label="Clock Out Time"
												value={manualClockOut}
												onChange={(e) => setManualClockOut(e.target.value)}
												className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
											/>
										</div>
									</div>
									<div className="flex gap-2 pt-2">
										<button
											onClick={() => onAddManualSession(session)}
											className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition text-sm font-bold"
										>
											Add Session
										</button>
										<button
											onClick={() => {
												setEditingSession(null);
												setManualTag('');
												setManualClockIn('');
												setManualClockOut('');
											}}
											className="px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 rounded-lg transition text-sm font-bold"
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
	);
}
