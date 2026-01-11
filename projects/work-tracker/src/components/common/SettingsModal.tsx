import { X, Globe } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
  onLoadDemoData: () => void;
  onRemoveDemoData: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  timezone,

  onTimezoneChange,
  onLoadDemoData,
  onRemoveDemoData
}: SettingsModalProps) {
  if (!isOpen) return null;

  // Get list of timezones
  const timezones = Intl.supportedValuesOf('timeZone');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Settings</h2>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 block">Timezone</label>
            <p className="text-xs text-slate-400 mb-2">Select your preferred timezone for tracking and reporting.</p>
            <div className="relative">
              <select
                aria-label="Timezone"
                value={timezone}
                onChange={(e) => onTimezoneChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-3 pr-8 appearance-none"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

           <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="text-purple-400 font-mono text-sm">
                 {new Date().toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </div>
              <div className="text-xs text-purple-200/70 flex items-center">
                 Current time in selected zone
              </div>
            </div>
          </div>

          {/* Demo Data Section */}
          <div className="bg-gradient-to-br from-indigo-900/20 to-blue-900/20 border border-indigo-500/20 rounded-lg p-4">
             <div className="flex items-center gap-2 mb-3">
               <div className="p-1 rounded bg-indigo-500/10">
                 <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                 </svg>
               </div>
               <h3 className="text-sm font-semibold text-indigo-200">Demo Data</h3>
             </div>
             <p className="text-xs text-indigo-200/70 mb-4">
               Populate the tracker with sample data to test reports and features. This will add entries for the last 30 days.
             </p>
             <div className="flex gap-3">
               <button
                 onClick={onLoadDemoData}
                 className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors border border-indigo-500/30 shadow-lg shadow-indigo-900/20"
               >
                 Load Demo
               </button>
               <button
                 onClick={onRemoveDemoData}
                 className="flex-1 px-3 py-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-300 text-slate-300 border border-slate-600 hover:border-red-500/30 text-xs font-semibold rounded-lg transition-colors"
               >
                 Clear Demo
               </button>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg hover:shadow-purple-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
