export default function StatsModal({ stats, onClose }) {
  const winRate = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
  const winsPct = stats.played > 0 ? (stats.wins / stats.played) * 100 : 0;
  const lossesPct = stats.played > 0 ? (stats.losses / stats.played) * 100 : 0;
  const drawsPct = stats.played > 0 ? (stats.draws / stats.played) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-b from-emerald-900 to-emerald-950 border-2 border-emerald-600/60 rounded-3xl p-6 w-full max-w-xs shadow-2xl text-white relative">
        <h2 className="text-lg font-black tracking-wider text-amber-300 mb-1 text-center">PERFORMANCE STATS</h2>
        <div className="w-10 h-1 bg-amber-400 rounded-full mx-auto mb-4"></div>

        <div className="mb-5 bg-emerald-950/90 p-3 rounded-2xl border border-emerald-700/40">
          <div className="text-[10px] text-emerald-300 font-bold mb-1.5 flex justify-between">
            <span>Result Ratio Chart</span>
            <span>{stats.played} Played</span>
          </div>
          <div className="h-3.5 w-full bg-emerald-900 rounded-full overflow-hidden flex shadow-inner border border-emerald-700/50">
            <div style={{ width: `${winsPct}%` }} className="bg-amber-400 h-full transition-all duration-500" title="Wins"></div>
            <div style={{ width: `${lossesPct}%` }} className="bg-rose-400 h-full transition-all duration-500" title="Losses"></div>
            <div style={{ width: `${drawsPct}%` }} className="bg-slate-300 h-full transition-all duration-500" title="Draws"></div>
          </div>
          <div className="flex justify-between items-center text-[9px] mt-1.5 text-emerald-300 font-bold px-0.5">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>Wins</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block"></span>Losses</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300 inline-block"></span>Draws</span>
          </div>
        </div>

        <div className="space-y-2 mb-5">
          <div className="bg-emerald-950/80 px-3.5 py-2 rounded-xl border border-emerald-700/40 flex justify-between items-center">
            <span className="text-[11px] text-emerald-300 font-bold">Games Played</span>
            <span className="text-xs font-black text-emerald-100">{stats.played}</span>
          </div>
          <div className="bg-emerald-950/80 px-3.5 py-2 rounded-xl border border-emerald-700/40 flex justify-between items-center">
            <span className="text-[11px] text-emerald-300 font-bold">Victories (Wins)</span>
            <span className="text-xs font-black text-amber-400">{stats.wins}</span>
          </div>
          <div className="bg-emerald-950/80 px-3.5 py-2 rounded-xl border border-emerald-700/40 flex justify-between items-center">
            <span className="text-[11px] text-emerald-300 font-bold">Defeats (Losses)</span>
            <span className="text-xs font-black text-rose-400">{stats.losses}</span>
          </div>
          <div className="bg-emerald-950/90 px-3.5 py-2.5 rounded-xl border border-amber-400/40 flex justify-between items-center shadow-inner">
            <span className="text-[11px] text-amber-300 font-black uppercase">Win Percentage</span>
            <span className="text-sm font-black text-amber-300">{winRate}%</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black py-2.5 rounded-xl shadow transition-all text-xs tracking-widest uppercase"
        >
          Close
        </button>
      </div>
    </div>
  );
}
