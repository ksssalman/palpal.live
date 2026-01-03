import TimeTrackerWidget from './TimeTrackerWidget';

function App() {
  return (
    <div className="w-full">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-[70px] px-8 flex items-center justify-between bg-white/10 backdrop-blur-2xl border-b border-white/10 z-[1000]">
        <a href="index.html" className="text-xl font-bold text-white tracking-tight">
          PalPal
        </a>
        <div className="flex gap-8 items-center">
          <a href="index.html#projects" className="text-white/80 no-underline font-medium text-sm transition-all ease-300 hover:text-white hover:-translate-y-0.5 cursor-pointer">
            Projects
          </a>
          <a href="auth.html" className="bg-white text-purple-600 px-6 py-2 rounded-full font-bold text-sm no-underline transition-all ease-300 hover:-translate-y-0.5 hover:bg-purple-50 hover:shadow-md cursor-pointer">
            Sign In
          </a>
        </div>
      </nav>

      {/* Main Content - Add top padding for fixed navbar */}
      <div className="pt-[70px] flex justify-center w-full">
        <TimeTrackerWidget />
      </div>
    </div>
  );
}

export default App;