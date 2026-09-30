import React, { useState, useEffect } from 'react';
import MiniDiceIcon from './MiniDiceIcon';

export default function ScoreCell({
  item,
  playerScores,
  opponentScores,
  turn,
  playerDice,
  p2Dice,
  canScoreP1,
  canScoreP2,
  handleSelectScore,
  upperSubtotal,
}) {
  const p1Score = playerScores[item.id];

  const [showYatzyEffect, setShowYatzyEffect] = useState(false);
  const [showBonusEffect, setShowBonusEffect] = useState(false);

  // --- Yatzy Animation Trigger (Shorter Duration: 1.5s) ---
  useEffect(() => {
    if (item.id === 'yatzy' && p1Score === 50) {
      setShowYatzyEffect(true);
      const timer = setTimeout(() => setShowYatzyEffect(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [p1Score, item.id]);

  // --- Bonus Animation Trigger (Shorter Duration: 1.5s) ---
  useEffect(() => {
    if (item.isBonus && upperSubtotal >= 63) {
      setShowBonusEffect(true);
      const timer = setTimeout(() => setShowBonusEffect(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [upperSubtotal, item.isBonus]);

  if (item.isBonus) {
    return (
      <div className="bg-emerald-950/70 rounded-xl px-3 py-2 flex justify-between items-center border border-emerald-600/30 shadow-sm w-full relative overflow-visible">
        <div>
          <span className="text-[9px] uppercase font-black text-emerald-400 block leading-none">Bonus</span>
          <span className="text-[11px] font-black text-amber-300">+35 PTS</span>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-black text-emerald-100">{upperSubtotal}</span>
          <span className="text-[9px] text-emerald-400 block leading-none">/ 63</span>
        </div>

        {/* --- BONUS PATAKHA BURST EFFECT WITH FADE-OUT --- */}
        <div className={`absolute inset-0 z-50 pointer-events-none flex items-center justify-center transition-all duration-300 ${showBonusEffect ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-90 pointer-events-none'}`}>
          <span className="absolute text-2xl animate-ping -translate-x-6 -translate-y-8">🎁</span>
          <span className="absolute text-3xl animate-bounce translate-x-6 -translate-y-10">⭐</span>
          <span className="absolute text-2xl animate-ping translate-x-8 translate-y-2">✨</span>
          <span className="absolute text-2xl animate-bounce -translate-x-8 translate-y-4">🎈</span>
          <div className="absolute -top-12 bg-emerald-400 text-emerald-950 font-black text-[10px] px-3 py-1 rounded-full shadow-xl border border-emerald-200 animate-bounce whitespace-nowrap">
            🎁 BONUS UNLOCKED (+35) 🎁
          </div>
        </div>
      </div>
    );
  }

  const isP1Scored = playerScores[item.id] !== undefined;
  const isP2Scored = opponentScores[item.id] !== undefined;
  const potentialScoreP1 = item.calc(playerDice);
  const potentialScoreP2 = item.calc(p2Dice);

  return (
    <button
      id={`score-box-${item.id}`}
      disabled={!canScoreP1 && !canScoreP2}
      onClick={() => {
        if (canScoreP1) handleSelectScore(item.id, item.calc);
        else if (canScoreP2) handleSelectScore(item.id, item.calc);
      }}
      className={`flex items-center justify-between px-2.5 py-2 rounded-xl border transition-all w-full relative overflow-visible ${
        (turn === 'player' && canScoreP1) || (turn === 'opponent' && canScoreP2)
          ? 'bg-emerald-900/90 hover:bg-emerald-800 border-amber-400 text-white shadow-md ring-1 ring-amber-400/30'
          : 'bg-emerald-950/50 border-emerald-700/30 text-emerald-200'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <MiniDiceIcon value={item.diceVal} label={item.iconLabel} />
        <span className="text-[11px] font-bold tracking-tight truncate">{item.label}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isP1Scored ? (
          <span className="font-black text-amber-300 text-xs" title="P1 Score">
            {playerScores[item.id]}
          </span>
        ) : canScoreP1 ? (
          <span className="px-1.5 py-0.5 bg-amber-400 text-emerald-950 rounded font-black text-[9px] shadow whitespace-nowrap">
            +{potentialScoreP1}
          </span>
        ) : (
          <span className="w-5 h-5 bg-emerald-950/60 rounded border border-emerald-700/30 flex items-center justify-center text-emerald-400/50 text-[10px]">-</span>
        )}

        <span className="text-emerald-600 font-bold text-[10px]">|</span>

        {isP2Scored ? (
          <span className="font-black text-rose-300 text-xs" title="P2/AI Score">
            {opponentScores[item.id]}
          </span>
        ) : canScoreP2 ? (
          <span className="px-1.5 py-0.5 bg-rose-400 text-emerald-950 rounded font-black text-[9px] shadow whitespace-nowrap">
            +{potentialScoreP2}
          </span>
        ) : (
          <span className="w-5 h-5 bg-emerald-950/60 rounded border border-rose-950/30 flex items-center justify-center text-rose-400/40 text-[10px]">-</span>
        )}
      </div>

      {/* --- YATZY PATAKHA BURST EFFECT WITH FADE-OUT --- */}
      <div className={`absolute inset-0 z-50 pointer-events-none flex items-center justify-center transition-all duration-300 ${showYatzyEffect ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-90 pointer-events-none'}`}>
        <span className="absolute text-2xl animate-ping -translate-x-6 -translate-y-8">🎈</span>
        <span className="absolute text-3xl animate-bounce translate-x-6 -translate-y-10">⭐</span>
        <span className="absolute text-2xl animate-ping translate-x-8 translate-y-2">✨</span>
        <span className="absolute text-2xl animate-bounce -translate-x-8 translate-y-4">🎈</span>
        <div className="absolute -top-12 bg-amber-400 text-emerald-950 font-black text-[10px] px-3 py-1 rounded-full shadow-xl border border-amber-200 animate-bounce whitespace-nowrap">
          🔥 YATZY 50 PTS! 🔥
        </div>
      </div>
    </button>
  );
}