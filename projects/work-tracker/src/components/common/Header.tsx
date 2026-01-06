import { useState } from 'react';
import { BarChart3, LogIn, LogOut, User, Clock, ChevronDown } from 'lucide-react';
import type { View } from '../../types';

interface HeaderProps {
  user: any;
  isSigningIn: boolean;
  signInError: string | null;
  view: View;
  setView: (view: View) => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

export default function Header({
  user,
  isSigningIn,
  signInError,
  view,
  setView,
  onSignIn,
  onSignOut
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

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
            <h1 className="text-lg font-bold tracking-tight text-white block">Work Tracker</h1>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-2 pr-2 py-1.5 rounded-full bg-purple-700/50 hover:bg-purple-700 border border-purple-500/30 transition-all group"
                >
                  <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center border border-purple-400/30 text-xs font-bold text-purple-100">
                    {user.email ? user.email[0].toUpperCase() : <User className="w-3 h-3" />}
                  </div>
                  <ChevronDown className={`w-3 h-3 text-purple-300 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-purple-100 overflow-hidden z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Signed in as</p>
                        <p className="text-sm font-medium text-slate-900 truncate" title={user.email}>{user.email}</p>
                      </div>
                      <div className="p-1">
                        <button
                          onClick={() => {
                            onSignOut();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={onSignIn}
                  disabled={isSigningIn}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg transition-all duration-200 ${isSigningIn
                      ? 'bg-purple-900/50 text-purple-300 cursor-wait'
                      : 'bg-white text-purple-900 hover:bg-purple-50 hover:scale-105'
                    }`}
                >
                  {isSigningIn ? (
                    <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  <span>Sign In</span>
                </button>
                
                 {signInError && (
                  <div className="absolute top-full right-0 mt-3 p-3 bg-red-500 text-white text-xs rounded-xl shadow-xl w-48 border border-red-400 animate-in fade-in slide-in-from-top-2">
                    <div className="absolute -top-1.5 right-4 w-3 h-3 bg-red-500 rotate-45 border-l border-t border-red-400"></div>
                    {signInError}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row: Navigation Tabs - Centered/Pill Style */}
        <div className="flex justify-center w-full">
          <div className="flex bg-black/20 p-1 rounded-xl backdrop-blur-sm border border-white/5 mx-2 w-full max-w-xs justify-center">
            <button
              onClick={() => setView('tracker')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${view === 'tracker'
                  ? 'bg-white text-purple-900 shadow-sm'
                  : 'text-purple-200 hover:text-white hover:bg-white/5'
                }`}
            >
              <Clock className="w-4 h-4" />
              <span>Tracker</span>
            </button>
            <button
              onClick={() => setView('report')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${view === 'report'
                  ? 'bg-white text-purple-900 shadow-sm'
                  : 'text-purple-200 hover:text-white hover:bg-white/5'
                }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Report</span>
            </button>
          </div>
    </div>
  );
}
