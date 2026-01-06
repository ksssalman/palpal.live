import TimeTrackerWidget from './TimeTrackerWidget';

function App() {
  return (
    <div className="w-full">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-[70px] px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-[#541342]/10 z-[1000] transition-all duration-300">
        <a href="https://palpal.live" className="text-2xl font-extrabold text-[#541342] tracking-tight no-underline flex items-center gap-2" style={{ fontFamily: '"Adobe Garamond Pro", Garamond, Georgia, "Times New Roman", serif', textTransform: 'lowercase', fontStyle: 'italic', paddingRight: '0.2em' }}>
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
        <TimeTrackerWidget />
      </div>
    </div>
  );
}

export default App;
