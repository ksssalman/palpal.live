import { X, Calendar } from 'lucide-react';
import type { TimeEntry } from '../../types';

interface TagDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagName: string;
  entries: TimeEntry[];
  formatDuration: (ms: number) => string;
  formatDate: (iso: string) => string;
}

export default function TagDetailsModal({
  isOpen,
  onClose,
  tagName,
  entries,
  formatDuration,
  formatDate
}: TagDetailsModalProps) {
  if (!isOpen) return null;

  // Calculate stats
  const totalDuration = entries.reduce((acc, entry) => {
    const start = new Date(entry.clockIn).getTime();
    const end = entry.clockOut ? new Date(entry.clockOut).getTime() : new Date().getTime();
    return acc + (end - start);
  }, 0);

  const sessionCount = entries.length;

  // Sort entries recent first
  const sortedEntries = [...entries].sort((a, b) =>
    new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime()
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-3">
             <div className="bg-purple-600/20 p-2 rounded-lg">
                <TagIcon className="w-5 h-5 text-purple-400" />
             </div>
            <div>
                 <h2 className="text-xl font-bold text-white leading-tight">{tagName || 'Untagged'}</h2>
                 <p className="text-xs text-slate-400">Tag Statistics</p>
            </div>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col items-center justify-center text-center">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Time</div>
                    <div className="text-2xl font-black text-emerald-400">{formatDuration(totalDuration)}</div>
                </div>
                 <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col items-center justify-center text-center">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Sessions</div>
                    <div className="text-2xl font-black text-purple-400">{sessionCount}</div>
                </div>
            </div>

            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Recent Sessions
            </h3>

            <div className="space-y-3">
                {sortedEntries.slice(0, 10).map(entry => {
                    const duration = (entry.clockOut ? new Date(entry.clockOut).getTime() : new Date().getTime()) - new Date(entry.clockIn).getTime();
                    return (
                        <div key={entry.id} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex justify-between items-center">
                            <div>
                                <div className="text-white font-medium text-sm">
                                    {formatDate(entry.clockIn)}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {new Date(entry.clockIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                            <div className="text-emerald-400 font-mono font-bold text-sm bg-emerald-950/30 px-2 py-1 rounded">
                                {formatDuration(duration)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
}

function TagIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 7H7.01M7 17H17V7H7V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.071 4.929C17.7583 3.61633 16.0355 2.76846 14.2014 2.45957C12.3672 2.15068 10.478 2.39049 8.70014 3.1593C6.92224 3.92811 5.31292 5.19792 4.01547 6.85241C2.71801 8.5069 2.01562 10.6358 2.01562 12.75C2.01562 14.8642 2.71801 16.9931 4.01547 18.6476C5.31292 20.3021 6.92224 21.5719 8.70014 22.3407C10.478 23.1095 12.3672 23.3493 14.2014 23.0404C16.0355 22.7315 17.7583 21.8837 19.071 20.571" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}
