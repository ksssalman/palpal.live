import { useState } from 'react';
import { BarChart3, LogIn, LogOut, Clock, ChevronDown, Settings, Download, CalendarPlus, Trash2 } from 'lucide-react';
import type { View } from '../../types';

interface HeaderProps {
  user: any;
  isSigningIn: boolean;
  signInError: string | null;
  view: View;
  setView: (view: View) => void;
  onSignIn: () => void;
  onSignOut: () => void;
  // New Data Props
  isTemporaryData: boolean;
  setShowClearModal: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  exportToCSV: () => void;
  exportToJSON: () => void;
  addRecentToCalendar: () => void;
}

export default function Header({
  user,
  isSigningIn,
  signInError,
  view,
  setView,
  onSignIn,
  onSignOut,
  isTemporaryData,
  setShowClearModal,
  setShowSettings,
  exportToCSV,
  exportToJSON,
  addRecentToCalendar
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <div className="bg-gradient-to-r from-purple-800 to-purple-950 text-white shadow-xl relative z-50">
      <div className="flex flex-col gap-3 px-4 py-3">
        {/* Top Row: Logo and Auth */}
        <div className="flex items-center justify-between w-full">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-sm border border-white/10">
              <svg className="w-5 h-5 text-purple-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 11h18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white block font-brand lowercase italic pr-[0.2em]">work tracker</h1>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition text-sm font-medium border border-white/10"
                >
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold ring-2 ring-purple-400/50">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:inline opacity-90">{user.email?.split('@')[0]}</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>

                {showUserMenu && (
                  <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-purple-100 overflow-hidden text-slate-800 z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Signed in as</p>
                        <p className="font-bold text-purple-900 truncate">{user.email}</p>
                      </div>

                      <button
                        onClick={() => { setShowSettings(true); setShowUserMenu(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-purple-50 flex items-center gap-2 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-purple-600" />
                        Settings
                      </button>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={() => { onSignOut(); setShowUserMenu(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onSignIn}
                disabled={isSigningIn}
                className="flex items-center gap-2 bg-white text-purple-900 hover:bg-purple-50 px-4 py-1.5 rounded-full transition font-semibold text-sm shadow-lg shadow-purple-900/20"
              >
                {isSigningIn ? (
                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Controls & Stats */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10">

            {/* View Switcher */}
            <div className="flex bg-black/20 p-1 rounded-lg">
                <button
                onClick={() => setView('tracker')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    view === 'tracker'
                    ? 'bg-white text-purple-900 shadow-sm'
                    : 'text-purple-200 hover:text-white hover:bg-white/5'
                }`}
                >
                <Clock className="w-3.5 h-3.5" />
                Tracker
                </button>
                <button
                onClick={() => setView('report')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    view === 'report'
                    ? 'bg-white text-purple-900 shadow-sm'
                    : 'text-purple-200 hover:text-white hover:bg-white/5'
                }`}
                >
                <BarChart3 className="w-3.5 h-3.5" />
                Reports
                </button>
            </div>

            {/* Actions */}
             <div className="flex items-center gap-2">
                 {/* Data/Export Menu */}
                 <div className="relative">
                    <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        className="p-2 hover:bg-white/10 rounded-lg text-purple-200 hover:text-white transition"
                        title="Data & Export"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    {showExportMenu && (
                        <>
                        <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowExportMenu(false)}
                        />
                         <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-purple-100 overflow-hidden text-slate-800 z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                             <div className="px-3 py-2 border-b border-slate-50 text-xs font-bold text-slate-400 uppercase">Export Data</div>
                             <button onClick={() => { exportToCSV(); setShowExportMenu(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 flex items-center gap-2">CSV</button>
                             <button onClick={() => { exportToJSON(); setShowExportMenu(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 flex items-center gap-2">JSON</button>
                             <button onClick={() => { addRecentToCalendar(); setShowExportMenu(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 flex items-center gap-2">
                                <CalendarPlus className="w-3 h-3 text-emerald-500" /> Recent to Cal
                             </button>

                             <div className="border-t border-slate-100 my-1"></div>

                             <button onClick={() => { setShowClearModal(true); setShowExportMenu(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2">
                                <Trash2 className="w-3 h-3" /> Clear All Data
                             </button>
                         </div>
                        </>
                    )}
                 </div>

                 <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 hover:bg-white/10 rounded-lg text-purple-200 hover:text-white transition"
                    title="Settings"
                 >
                     <Settings className="w-4 h-4" />
                 </button>
             </div>
        </div>
      </div>

      {/* Auth Error Warning */}
      {signInError && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-1.5 flex items-center justify-center gap-2 backdrop-blur-sm">
          <span className="text-xs font-bold text-red-200">Auth Error:</span>
          <span className="text-xs font-medium text-red-200">{signInError}</span>
        </div>
      )}

      {/* Temporary Data Warning */}
      {isTemporaryData && !isSigningIn && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 flex items-center justify-center gap-2 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-amber-200">
            Using temporary local storage. Sign in to save your progress.
          </span>
        </div>
      )}
    </div>
  );
}
