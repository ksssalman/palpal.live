import { BarChart3, Cloud, CloudOff, LogIn, LogOut } from 'lucide-react';
import type { View } from '../../types';

interface HeaderProps {
  user: any;
  isDedicated: boolean;
  isSigningIn: boolean;
  signInError: string | null;
  view: View;
  setView: (view: View) => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

export default function Header({
  user,
  isDedicated,
  isSigningIn,
  signInError,
  view,
  setView,
  onSignIn,
  onSignOut
}: HeaderProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg relative">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" />
            <path d="M3 11h18" stroke="currentColor" strokeWidth="2" />
          </svg>
          <h1 className="text-xl font-bold">Work Tracker</h1>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30 backdrop-blur-sm">
              <Cloud className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">Cloud Synced</span>
              {isDedicated && (
                <button
                  onClick={onSignOut}
                  className="ml-2 p-1.5 text-emerald-400 hover:text-white hover:bg-emerald-500/20 rounded-lg transition-all duration-200"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600/50 backdrop-blur-sm">
                <CloudOff className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400">Local Only</span>
              </div>
              {isDedicated && (
                <button
                  onClick={onSignIn}
                  disabled={isSigningIn}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-sm ${
                    isSigningIn
                      ? 'bg-blue-500/50 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20'
                  }`}
                  title={isSigningIn ? 'Signing in...' : 'Enable Cloud Sync'}
                >
                  {isSigningIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Connecting...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span className="text-sm">Sign In</span>
                    </>
                  )}
                </button>
              )}
              {signInError && (
                <div className="absolute top-full right-4 mt-2 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm shadow-lg z-40 whitespace-nowrap backdrop-blur-sm border border-red-400/30">
                  {signInError}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setView('tracker')}
              className={`p-2.5 rounded-lg transition-all duration-200 ${view === 'tracker' ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'
                }`}
              title="Tracker View"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={() => setView('report')}
              className={`p-2.5 rounded-lg transition-all duration-200 ${view === 'report' ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'
                }`}
              title="Report View"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
