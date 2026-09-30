import { useState } from 'react';

export default function StatsModal({ stats, onClose }) {
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' ya 'settings'
  
  const [musicEnabled, setMusicEnabled] = useState(() => {
    return localStorage.getItem('setting_music') !== 'false';
  });
  const [sfxEnabled, setSfxEnabled] = useState(() => {
    return localStorage.getItem('setting_sfx') !== 'false';
  });

  const toggleMusic = () => {
    const nextVal = !musicEnabled;
    setMusicEnabled(nextVal);
    localStorage.setItem('setting_music', nextVal);
  };

  const toggleSfx = () => {
    const nextVal = !sfxEnabled;
    setSfxEnabled(nextVal);
    localStorage.setItem('setting_sfx', nextVal);
  };

  const winRate = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
  const winsPct = stats.played > 0 ? (stats.wins / stats.played) * 100 : 0;
  const lossesPct = stats.played > 0 ? (stats.losses / stats.played) * 100 : 0;
  const drawsPct = stats.played > 0 ? (stats.draws / stats.played) * 100 : 0;

  // Extra smart metrics (fallback values agar stats object mein na hon)
  const highestScore = stats.highestScore || 0;
  const averageScore = stats.played > 0 ? Math.round((stats.totalScore || 0) / stats.played) : 0;
  const currentStreak = stats.currentStreak || 0;
  const highestStreak = stats.highestStreak || 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-b from-emerald-900 to-emerald-950 border-2 border-emerald-600/60 rounded-3xl p-5 w-full max-w-xs shadow-2xl text-white relative">
        
        {/* Top Tab Switcher Buttons (STATS / SETTINGS) */}
        <div className="grid grid-cols-2 gap-1.5 bg-emerald-950 p-1 rounded-2xl border border-emerald-700/50 mb-3">
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
              activeTab === 'stats'
                ? 'bg-amber-400 text-emerald-950 shadow'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            📊 Stats
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
              activeTab === 'settings'
                ? 'bg-amber-400 text-emerald-950 shadow'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            ⚙️ Settings
          </button>
        </div>

        {/* --- STATS TAB CONTENT --- */}
        {activeTab === 'stats' && (
          <div className="animate-fadeIn">
            <h2 className="text-sm font-black tracking-wider text-amber-300 mb-0.5 text-center">PERFORMANCE STATS</h2>
            <div className="w-8 h-1 bg-amber-400 rounded-full mx-auto mb-2.5"></div>

            {/* Result Ratio Bar Chart */}
            <div className="mb-3 bg-emerald-950/90 p-2 rounded-2xl border border-emerald-700/40">
              <div className="text-[10px] text-emerald-300 font-bold mb-1 flex justify-between">
                <span>Result Ratio</span>
                <span>{stats.played} Played</span>
              </div>
              <div className="h-2.5 w-full bg-emerald-900 rounded-full overflow-hidden flex shadow-inner border border-emerald-700/50">
                <div style={{ width: `${winsPct}%` }} className="bg-amber-400 h-full transition-all duration-500" title="Wins"></div>
                <div style={{ width: `${lossesPct}%` }} className="bg-rose-400 h-full transition-all duration-500" title="Losses"></div>
                <div style={{ width: `${drawsPct}%` }} className="bg-slate-300 h-full transition-all duration-500" title="Draws"></div>
              </div>
              <div className="flex justify-between items-center text-[8px] mt-1 text-emerald-300 font-bold px-0.5">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>Wins ({stats.wins})</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block"></span>Losses ({stats.losses})</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Draws ({stats.draws || 0})</span>
              </div>
            </div>

            {/* Scrollable Stats List */}
            <div className="space-y-1.5 mb-3 max-h-[200px] overflow-y-auto pr-0.5 custom-scrollbar">
              <div className="bg-emerald-950/80 px-2.5 py-1.5 rounded-xl border border-emerald-700/40 flex justify-between items-center">
                <span className="text-[10px] text-emerald-300 font-bold">Games Played</span>
                <span className="text-xs font-black text-emerald-100">{stats.played}</span>
              </div>
              <div className="bg-emerald-950/80 px-2.5 py-1.5 rounded-xl border border-emerald-700/40 flex justify-between items-center">
                <span className="text-[10px] text-emerald-300 font-bold">Victories (Wins)</span>
                <span className="text-xs font-black text-amber-400">{stats.wins}</span>
              </div>
              <div className="bg-emerald-950/80 px-2.5 py-1.5 rounded-xl border border-emerald-700/40 flex justify-between items-center">
                <span className="text-[10px] text-emerald-300 font-bold">Defeats (Losses)</span>
                <span className="text-xs font-black text-rose-400">{stats.losses}</span>
              </div>
              <div className="bg-emerald-950/80 px-2.5 py-1.5 rounded-xl border border-emerald-700/40 flex justify-between items-center">
                <span className="text-[10px] text-emerald-300 font-bold">Draw Matches</span>
                <span className="text-xs font-black text-slate-300">{stats.draws || 0}</span>
              </div>
              <div className="bg-emerald-950/80 px-2.5 py-1.5 rounded-xl border border-emerald-700/40 flex justify-between items-center">
                <span className="text-[10px] text-emerald-300 font-bold">Highest Score</span>
                <span className="text-xs font-black text-emerald-200">{highestScore}</span>
              </div>
              <div className="bg-emerald-950/80 px-2.5 py-1.5 rounded-xl border border-emerald-700/40 flex justify-between items-center">
                <span className="text-[10px] text-emerald-300 font-bold">Average Score</span>
                <span className="text-xs font-black text-emerald-200">{averageScore}</span>
              </div>
              <div className="bg-emerald-950/80 px-2.5 py-1.5 rounded-xl border border-emerald-700/40 flex justify-between items-center">
                <span className="text-[10px] text-emerald-300 font-bold">Current Win Streak</span>
                <span className="text-xs font-black text-amber-300">🔥 {currentStreak}</span>
              </div>
              <div className="bg-emerald-950/80 px-2.5 py-1.5 rounded-xl border border-emerald-700/40 flex justify-between items-center">
                <span className="text-[10px] text-emerald-300 font-bold">Highest Win Streak</span>
                <span className="text-xs font-black text-amber-300">🔥 {highestStreak}</span>
              </div>
              <div className="bg-emerald-950/90 px-3 py-2 rounded-xl border border-amber-400/40 flex justify-between items-center shadow-inner">
                <span className="text-[10px] text-amber-300 font-black uppercase">Win Percentage</span>
                <span className="text-xs font-black text-amber-300">{winRate}%</span>
              </div>
            </div>
          </div>
        )}

        {/* --- SETTINGS TAB CONTENT --- */}
        {activeTab === 'settings' && (
          <div className="animate-fadeIn">
            <h2 className="text-sm font-black tracking-wider text-amber-300 mb-0.5 text-center">GAME SETTINGS</h2>
            <div className="w-8 h-1 bg-amber-400 rounded-full mx-auto mb-3"></div>

            <div className="space-y-2.5 mb-4">
              {/* Music Toggle */}
              <div className="bg-emerald-950/80 px-3 py-2.5 rounded-2xl border border-emerald-700/40 flex justify-between items-center">
                <div>
                  <span className="text-[11px] text-emerald-200 font-bold block">Background Music</span>
                  <span className="text-[8px] text-emerald-400">Play audio themes</span>
                </div>
                <button
                  onClick={toggleMusic}
                  className={`w-11 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                    musicEnabled ? 'bg-amber-400' : 'bg-emerald-900 border border-emerald-700'
                  }`}
                >
                  <div
                    className={`bg-emerald-950 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      musicEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Sound Effects (SFX) Toggle */}
              <div className="bg-emerald-950/80 px-3 py-2.5 rounded-2xl border border-emerald-700/40 flex justify-between items-center">
                <div>
                  <span className="text-[11px] text-emerald-200 font-bold block">Sound Effects (SFX)</span>
                  <span className="text-[8px] text-emerald-400">Dice roll & click sounds</span>
                </div>
                <button
                  onClick={toggleSfx}
                  className={`w-11 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                    sfxEnabled ? 'bg-amber-400' : 'bg-emerald-900 border border-emerald-700'
                  }`}
                >
                  <div
                    className={`bg-emerald-950 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      sfxEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black py-2 rounded-xl shadow transition-all text-[11px] tracking-widest uppercase"
        >
          Close
        </button>
      </div>
    </div>
  );
}