import MiniDiceIcon from './MiniDiceIcon';

export default function ScoreCell({
  item,
  playerScores,
  opponentScores,
  turn,
  rollsLeft,
  p2RollsLeft,
  gameMode,
  playerDice,
  p2Dice,
  canScoreP1,
  canScoreP2,
  handleSelectScore,
  upperSubtotal,
}) {
  if (item.isBonus) {
    return (
      <div className="bg-emerald-950/70 rounded-xl px-3 py-2 flex justify-between items-center border border-emerald-600/30 shadow-sm w-full">
        <div>
          <span className="text-[9px] uppercase font-black text-emerald-400 block leading-none">Bonus</span>
          <span className="text-[11px] font-black text-amber-300">+35 PTS</span>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-black text-emerald-100">{upperSubtotal}</span>
          <span className="text-[9px] text-emerald-400 block leading-none">/ 63</span>
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
    </button>
  );
}
