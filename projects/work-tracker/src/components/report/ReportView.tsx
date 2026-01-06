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
  onTagClick?: (tag: string) => void;
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
  formatDuration,
  onTagClick
}: ReportViewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
          <Filter className="w-5 h-5" />
          Report Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Period</label>
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value as ReportPeriod)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
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
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Start</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">End</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateReport}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition font-semibold flex items-center justify-center gap-2"
          >
            <BarChart2 className="w-4 h-4" />
            Generate Report
          </button>
          <button
            onClick={exportToCSV}
            className="px-6 bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 py-2 rounded-lg transition font-semibold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Summary</h2>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium mb-1">Total Time</p>
            <p className="text-2xl font-bold text-emerald-400">{formatDuration(totalDuration)}</p>
          </div>
        </div>

        <div className="space-y-4">
          {tagStats.map(stat => (
            <div
              key={stat.tag}
              className={`bg-slate-700/50 rounded-lg p-4 border border-slate-600 transition-colors ${onTagClick ? 'cursor-pointer hover:bg-slate-700 hover:border-slate-500' : ''}`}
              onClick={() => onTagClick?.(stat.tag)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-white">{stat.tag || 'Untagged'}</span>
                <span className="font-mono text-sm text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                  {formatDuration(stat.duration)}
                </span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalDuration > 0 ? (stat.duration / totalDuration) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          ))}
          {tagStats.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <BarChart2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No data available for this period</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
