export default function MenuScreen({ showSplash, gameStarted, startGameWithMode, setShowStatsModal }) {
  if (showSplash) {
    return (
      <div className="flex-1 flex flex-col items-center justify-between p-8 text-center bg-gradient-to-b from-emerald-950 via-emerald-900 to-stone-950 animate-fadeIn">
        <div className="my-auto flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 border-2 border-amber-200 flex items-center justify-center text-3xl shadow-2xl mb-6 animate-bounce">
            🎲
          </div>
          <h1 className="text-2xl font-black tracking-widest text-emerald-100 mb-1">CASINO YATZY</h1>
          <div className="w-12 h-1 bg-amber-400 rounded-full mx-auto mb-4"></div>
        </div>
        <div className="pb-6">
          <span className="text-[10px] text-emerald-400 tracking-wider">LOADING EXPERIENCE...</span>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="flex-1 flex flex-col justify-between p-6 animate-fadeIn">
        <div className="pt-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 border-2 border-amber-200 flex items-center justify-center text-2xl shadow-xl mx-auto mb-3">
            🎲
          </div>
          <h1 className="text-xl font-black tracking-wider text-emerald-100">CASINO YATZY</h1>
          <div className="w-10 h-1 bg-amber-400 rounded-full mx-auto mt-2"></div>
        </div>

        <div className="space-y-3.5 my-auto">
          <button
            onClick={() => startGameWithMode('ai')}
            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black py-3.5 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-between group border border-amber-200"
          >
            <div className="text-left">
              <span className="block text-xs uppercase tracking-wider">Solo vs AI Bot</span>
              <span className="text-[10px] opacity-80 font-normal">Challenge automated smart AI</span>
            </div>
            <span className="text-lg group-hover:translate-x-1 transition-transform">🤖</span>
          </button>

          <button
            onClick={() => startGameWithMode('friend')}
            className="w-full bg-emerald-900/80 hover:bg-emerald-900 text-emerald-100 font-bold py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-between border border-emerald-600/40 group"
          >
            <div className="text-left">
              <span className="block text-xs uppercase tracking-wider text-amber-300 font-black">Pass & Play</span>
              <span className="text-[10px] text-emerald-300/80">Play locally with a friend</span>
            </div>
            <span className="text-lg group-hover:translate-x-1 transition-transform">👥</span>
          </button>

          <button
            onClick={() => setShowStatsModal(true)}
            className="w-full bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 font-bold py-3 px-4 rounded-2xl border border-emerald-700/40 transition-all flex items-center justify-between text-xs"
          >
            <span>Performance Stats</span>
            <span>📊</span>
          </button>
        </div>

        <div className="text-center pb-2">
          <span className="text-[9px] text-emerald-500 tracking-widest uppercase">Classic Dice Rolling Experience</span>
        </div>
      </div>
    );
  }

  return null;
}
