import { Calendar, Edit3, Trash2 } from 'lucide-react';
import type { TimeEntry } from '../../types';

interface RecentEntriesListProps {
  entries: TimeEntry[];
  editingEntry: number | null;
  setEditingEntry: (id: number | null) => void;
  manualTag: string;
  setManualTag: (val: string) => void;
  manualClockIn: string;
  setManualClockIn: (val: string) => void;
  manualClockOut: string;
  setManualClockOut: (val: string) => void;
  onDeleteEntry: (id: number) => void;
  onAddManualEntry: (entry: TimeEntry) => void;
  formatTime: (iso: string) => string;
  formatDate: (iso: string) => string;
  calculateDuration: (start: string, end: string | null) => string;
}

export default function RecentEntriesList({
  entries,
  editingEntry,
  setEditingEntry,
  manualTag,
  setManualTag,
  manualClockIn,
  setManualClockIn,
  manualClockOut,
  setManualClockOut,
  onDeleteEntry,
  onAddManualEntry,
  formatTime,
  formatDate,
  calculateDuration
}: RecentEntriesListProps) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#541342]">
        <Calendar className="w-5 h-5" />
        Recent Entries
      </h2>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {entries.slice(0, 10).map(entry => (
          <div key={entry.id}>
            <div
              className={`bg-white/60 rounded-xl p-4 border relative transition-all hover:bg-white/80 hover:shadow-md ${entry.isManual ? 'border-purple-300 ml-4' : 'border-white/50'
                }`}
            >
              {entry.isManual && (
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-purple-300"></div>
              )}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-[#541342]/60 font-medium">{formatDate(entry.clockIn)}</p>
                    {entry.isManual && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                        Manual
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-[#541342] text-lg">
                    {formatTime(entry.clockIn)} - {entry.clockOut ? formatTime(entry.clockOut) : 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#541342] font-bold bg-[#541342]/5 px-3 py-1 rounded-lg">
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
                      className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition"
                      title="Add manual tag entry"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition"
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
                      className={`px-2.5 py-1 rounded-md text-xs font-medium ${entry.isManual
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-[#541342]/5 text-[#541342]/80'
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
              <div className="ml-4 mt-2 bg-white rounded-xl p-5 border border-purple-200 shadow-lg">
                <h3 className="text-sm font-bold mb-3 text-purple-800">
                  Add Manual Tag Entry
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Session: {formatTime(entry.clockIn)} - {entry.clockOut ? formatTime(entry.clockOut) : 'N/A'}
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1.5">Tag</label>
                    <input
                      type="text"
                      value={manualTag}
                      onChange={(e) => setManualTag(e.target.value)}
                      placeholder="e.g., Meeting, Coding"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1.5">Clock In</label>
                      <input
                        type="time"
                        value={manualClockIn}
                        onChange={(e) => setManualClockIn(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1.5">Clock Out</label>
                      <input
                        type="time"
                        value={manualClockOut}
                        onChange={(e) => setManualClockOut(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => onAddManualEntry(entry)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg transition text-sm font-bold shadow-sm"
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
                      className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2.5 rounded-lg transition text-sm font-bold"
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
