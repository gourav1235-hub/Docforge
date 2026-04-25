export default function TopAppBar({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-6 py-4 bg-slate-950/60 backdrop-blur-[20px] border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      {/* Left placeholder for flex balancing, containing the mobile menu */}
      <div className="flex-1 flex justify-start">
        <button 
          onClick={onMenuToggle}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg text-slate-300 hover:bg-white/5 transition-all group"
        >
          <div className="w-5 h-0.5 bg-current rounded-full transition-all group-hover:bg-blue-400 group-hover:w-6"></div>
          <div className="w-4 h-0.5 bg-current rounded-full transition-all group-hover:bg-purple-400 self-start ml-2.5 group-hover:w-6 group-hover:ml-2"></div>
          <div className="w-5 h-0.5 bg-current rounded-full transition-all group-hover:bg-blue-400 group-hover:w-6"></div>
        </button>
      </div>

      {/* Centered Logo */}
      <div className="flex-1 flex justify-center">
        <a href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.4)] group-hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] group-hover:scale-105 transition-all duration-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <path d="M9 15l2 2 4-4"></path>
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase">
            DocForge
          </span>
        </a>
      </div>

      {/* Right placeholder for flex balancing */}
      <div className="flex-1"></div>
    </header>
  );
}
