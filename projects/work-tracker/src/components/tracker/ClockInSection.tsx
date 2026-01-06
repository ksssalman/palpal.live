import { Plus, Tag, X } from 'lucide-react';
import type { TimeEntry } from '../../types';

interface ClockInSectionProps {
  currentEntry: TimeEntry | null;
  currentTime: Date;
  tagInput: string;
  setTagInput: (val: string) => void;
  onClockIn: () => void;
  onClockOut: () => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  formatTime: (iso: string) => string;
  calculateDuration: (start: string, end: string | null) => string;
  timezone: string;
}

export default function ClockInSection({
  currentEntry,
  currentTime,
  tagInput,
  setTagInput,
  onClockIn,
  onClockOut,
  onAddTag,
  onRemoveTag,
  formatTime,
  calculateDuration,
  timezone
}: ClockInSectionProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700 shadow-lg">
      {!currentEntry ? (
        <button
          onClick={onClockIn}
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
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl mb-6 border border-slate-700/50 backdrop-blur-sm overflow-hidden">
             {/* Header Bar: Current Time */}
             <div className="bg-slate-900/40 px-6 py-2 flex items-center justify-between border-b border-slate-700/50">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Session</div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-slate-400 font-medium">
                    {currentTime.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                  </div>
                </div>
             </div>

            <div className="grid grid-cols-2 gap-0 divide-x divide-slate-700/50">
              {/* Clock In Time */}
              <div className="p-6 text-center flex flex-col items-center justify-center">
                <div className="text-xs font-bold text-emerald-500/80 uppercase tracking-wider mb-2">Started At</div>
                <div className="text-3xl font-black text-emerald-400 whitespace-nowrap">
                  {formatTime(currentEntry.clockIn)}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-medium">
                  {new Date(currentEntry.clockIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              {/* Duration */}
              <div className="p-6 text-center flex flex-col items-center justify-center">
                <div className="text-xs font-bold text-purple-400/80 uppercase tracking-wider mb-2">Duration</div>
                <div className="text-3xl font-black text-purple-400 tabular-nums whitespace-nowrap">
                  {calculateDuration(currentEntry.clockIn, null)}
                </div>
                <div className="text-xs text-purple-300/50 mt-1">running</div>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-2">
              <Tag className="w-4 h-4" />
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onAddTag()}
                placeholder="Add a tag..."
                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
              />
              <button
                onClick={onAddTag}
                className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition"
                title="Add tag"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentEntry.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded text-xs flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => onRemoveTag(tag)}
                    className="hover:text-red-400 transition"
                    title="Remove tag"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={onClockOut}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
          >
            Clock Out
          </button>
        </div>
      )}
    </div>
  );
}
