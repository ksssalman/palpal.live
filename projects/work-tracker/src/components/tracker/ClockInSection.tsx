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
  calculateDuration
}: ClockInSectionProps) {
  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/50 shadow-xl">
      {!currentEntry ? (
        <button
          onClick={onClockIn}
          className="w-full bg-[#541342] hover:bg-[#3d0e30] text-white font-bold text-lg py-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Clock In
        </button>
      ) : (
        <div>
          <div className="bg-white/50 rounded-xl p-6 mb-6 border border-white/60 shadow-inner">
            <div className="grid grid-cols-3 gap-4">
              {/* Current Time */}
              <div className="text-center">
                <div className="text-xs font-bold text-[#541342]/50 uppercase tracking-wider mb-2">Current Time</div>
                <div className="text-3xl font-black text-[#541342]">
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </div>
                <div className="text-xs text-[#541342]/60 mt-1 font-medium">
                  {currentTime.toLocaleTimeString('en-US', { second: '2-digit' }).split(' ')[0]}
                </div>
              </div>

              {/* Clock In Time */}
              <div className="text-center border-l border-r border-[#541342]/10">
                <div className="text-xs font-bold text-[#541342]/50 uppercase tracking-wider mb-2">Clocked In</div>
                <div className="text-3xl font-black text-emerald-600">
                  {formatTime(currentEntry.clockIn)}
                </div>
                <div className="text-xs text-emerald-600/70 mt-1 font-medium">
                  {new Date(currentEntry.clockIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              {/* Duration */}
              <div className="text-center">
                <div className="text-xs font-bold text-[#541342]/50 uppercase tracking-wider mb-2">Duration</div>
                <div className="text-3xl font-black text-purple-600">
                  {calculateDuration(currentEntry.clockIn, null)}
                </div>
                <div className="text-xs text-purple-600/70 mt-1 font-medium">Active Session</div>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-bold text-[#541342]/70 mb-2">
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
                className="flex-1 bg-white/70 border border-white/50 rounded-xl px-4 py-3 text-sm text-[#541342] placeholder-[#541342]/30 focus:outline-none focus:border-[#541342]/30 focus:ring-2 focus:ring-[#541342]/10 transition-all shadow-sm"
              />
              <button
                onClick={onAddTag}
                className="bg-[#541342] hover:bg-[#3d0e30] text-white p-3 rounded-xl transition shadow-md"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentEntry.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#541342]/10 border border-[#541342]/10 px-3 py-1.5 rounded-full text-sm font-medium text-[#541342] flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => onRemoveTag(tag)}
                    className="hover:text-red-500 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={onClockOut}
            className="w-full bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 font-bold py-4 rounded-xl transition transform hover:scale-[1.01] shadow-sm"
          >
            Clock Out
          </button>
        </div>
      )}
    </div>
  );
}
