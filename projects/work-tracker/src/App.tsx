import WorkTrackerWidget from './WorkTrackerWidget';

function App() {
  return (
    <div id="root" className="main-app-container">
      {/* Navigation Bar - PalPal.live style */}
      <nav className="fixed top-0 left-0 right-0 h-[70px] px-8 sm:px-4 flex items-center justify-between bg-gradient-to-r from-[#f9f0f6] to-[#f0e0ec] backdrop-blur-md border-b border-[#541342]/10 z-[1000] transition-all duration-300 shadow-md">
        <a href="https://palpal.live" className="text-2xl font-extrabold text-[#541342] tracking-tight no-underline flex items-center gap-2 font-brand lowercase italic pr-[0.2em]">
          <img src="/assets/logo.png" alt="PalPal" className="h-8 w-8 rounded-lg mr-2" />
          PalPal
        </a>
        <div className="flex gap-8 items-center">
          <a href="https://palpal.live/#projects" className="text-[#541342]/70 no-underline font-medium text-[0.95rem] transition-all duration-300 hover:text-[#541342] hover:-translate-y-[1px] cursor-pointer">
            Projects
          </a>
        </div>
      </nav>

      {/* Main Content - Add top padding for fixed navbar */}
      <div className="pt-[70px] flex justify-center w-full">
        <div className="w-full">
          <WorkTrackerWidget />
        </div>
      </div>
    </div>
  );
}

export default App;
