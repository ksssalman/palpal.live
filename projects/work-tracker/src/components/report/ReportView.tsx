import { BarChart2, Download, Filter } from 'lucide-react';
import type { ReportPeriod, TagStat } from '../../types';

interface ReportViewProps {
  reportPeriod: ReportPeriod;
  setReportPeriod: (val: ReportPeriod) => void;
  customStartDate: string;
  setCustomStartDate: (val: string) => void;
  customEndDate: string;
  setCustomEndDate: (val: string) => void;
  generateReport: () => void;
  exportToCSV: () => void;
  tagStats: TagStat[];
  totalDuration: number;
  formatDuration: (ms: number) => string;
}

export default function ReportView({
  reportPeriod,
  setReportPeriod,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  generateReport,
  exportToCSV,
  tagStats,
  totalDuration,
  formatDuration
}: ReportViewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white/60 rounded-2xl p-6 border border-white/50 shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#541342]">
          <Filter className="w-5 h-5" />
          Report Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-[#541342]/60 block mb-1.5">Period</label>
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value as ReportPeriod)}
              className="w-full bg-white border border-white/50 rounded-xl px-4 py-3 text-sm text-[#541342] focus:outline-none focus:border-[#541342]/30 focus:ring-2 focus:ring-[#541342]/10 transition-all"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          {reportPeriod === 'custom' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-[#541342]/60 block mb-1.5">Start</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full bg-white border border-white/50 rounded-xl px-4 py-3 text-sm text-[#541342] focus:outline-none focus:border-[#541342]/30 focus:ring-2 focus:ring-[#541342]/10 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#541342]/60 block mb-1.5">End</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full bg-white border border-white/50 rounded-xl px-4 py-3 text-sm text-[#541342] focus:outline-none focus:border-[#541342]/30 focus:ring-2 focus:ring-[#541342]/10 transition-all"
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateReport}
            className="flex-1 bg-[#541342] hover:bg-[#541342]/90 text-white py-3 rounded-xl transition font-bold shadow-lg shadow-[#541342]/20 flex items-center justify-center gap-2"
          >
            <BarChart2 className="w-4 h-4" />
            Generate Report
          </button>
          <button
            onClick={exportToCSV}
            className="px-6 bg-white hover:bg-gray-50 text-[#541342] border border-[#541342]/10 py-3 rounded-xl transition font-bold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white/60 rounded-2xl p-6 border border-white/50 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-[#541342]">Summary</h2>
          <div className="text-right">
            <p className="text-xs text-[#541342]/60 font-medium mb-1">Total Time</p>
            <p className="text-2xl font-bold text-[#541342]">{formatDuration(totalDuration)}</p>
          </div>
        </div>

        <div className="space-y-4">
          {tagStats.map(stat => (
            <div key={stat.tag} className="bg-white/50 rounded-xl p-4 border border-white/50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-[#541342]">{stat.tag || 'Untagged'}</span>
                <span className="font-mono text-sm text-[#541342]/80 bg-[#541342]/5 px-2 py-1 rounded-lg">
                  {formatDuration(stat.duration)}
                </span>
              </div>
              <div className="w-full bg-[#541342]/5 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#541342] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stat.duration / totalDuration) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
          {tagStats.length === 0 && (
            <div className="text-center py-8 text-[#541342]/40">
              <BarChart2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No data available for this period</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
