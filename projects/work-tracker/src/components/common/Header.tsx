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
    <div className="bg-white/30 backdrop-blur-md border-b border-[#541342]/10 text-[#541342] relative rounded-t-2xl">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          {/* Title removed for cleaner look */}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 backdrop-blur-sm">
              <Cloud className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700">Synced</span>
              {isDedicated && (
                <button
                  onClick={onSignOut}
                  className="ml-2 p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-500/20 rounded-full transition-all duration-200"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-200/50 rounded-full border border-slate-300/50 backdrop-blur-sm">
                <CloudOff className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-600">Local</span>
              </div>
              {isDedicated && (
                <button
                  onClick={onSignIn}
                  disabled={isSigningIn}
                  className={`px-5 py-2 rounded-full transition-all duration-200 flex items-center gap-2 font-bold shadow-sm text-sm ${
                    isSigningIn
                      ? 'bg-[#541342]/50 text-white cursor-not-allowed'
                      : 'bg-[#541342] text-white hover:bg-[#3d0e30] hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                  title={isSigningIn ? 'Signing in...' : 'Enable Cloud Sync'}
                >
                  {isSigningIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              )}
              {signInError && (
                <div className="absolute top-full right-4 mt-2 bg-red-500 text-white px-4 py-2 rounded-xl text-sm shadow-xl z-40 whitespace-nowrap">
                  {signInError}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setView('tracker')}
              className={`p-2.5 rounded-xl transition-all duration-200 ${view === 'tracker' ? 'bg-[#541342]/10 text-[#541342]' : 'text-[#541342]/60 hover:bg-[#541342]/5'
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
              className={`p-2.5 rounded-xl transition-all duration-200 ${view === 'report' ? 'bg-[#541342]/10 text-[#541342]' : 'text-[#541342]/60 hover:bg-[#541342]/5'
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
