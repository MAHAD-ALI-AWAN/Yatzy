import React from 'react';
import Die from './Die';
import ScoreCell from './ScoreCell';
import { COLUMN_PAIRS } from '../game/logic';

export default function GameBoard({
  turn,
  gameMode,
  rollsLeft,
  p2RollsLeft,
  p2Message,
  playerDice,
  held,
  isRolling,
  p2Dice,
  p2Held,
  isP2Rolling,
  playerScores,
  opponentScores,
  grandTotal,
  opponentTotal,
  gameOver,
  resetGame,
  handleSelectScore,
  toggleHold,
  rollDice,
  upperSubtotal,
}) {
  const renderCellContent = (item) => {
    const isP1Scored = playerScores[item.id] !== undefined;
    const isP2Scored = opponentScores[item.id] !== undefined;
    const canScoreP1 = turn === 'player' && !isP1Scored && rollsLeft < 3;
    const canScoreP2 = gameMode === 'friend' && turn === 'opponent' && !isP2Scored && p2RollsLeft < 3;

    return (
      <ScoreCell
        item={item}
        playerScores={playerScores}
        opponentScores={opponentScores}
        turn={turn}
        playerDice={playerDice}
        p2Dice={p2Dice}
        canScoreP1={canScoreP1}
        canScoreP2={canScoreP2}
        handleSelectScore={handleSelectScore}
        upperSubtotal={upperSubtotal}
      />
    );
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 overflow-hidden">
      <div className="flex justify-between items-center bg-emerald-950/70 px-3.5 py-2 rounded-2xl border border-emerald-700/40 shadow-inner">
        <button
          onClick={resetGame}
          className="px-2.5 py-1 bg-emerald-900 hover:bg-emerald-800 text-amber-300 rounded-xl text-xs font-black border border-emerald-600/40 transition-all"
        >
          🏠 MENU
        </button>

        <div className="text-center">
          <span className="text-[9px] text-emerald-400 block uppercase tracking-wider font-bold">
            {gameMode === 'ai' ? 'VS AI BOT' : 'PASS & PLAY'}
          </span>
          <span className="text-xs font-black text-amber-300">
            {turn === 'player' ? "Player 1's Turn" : (gameMode === 'ai' ? 'AI Turn' : "Player 2's Turn")}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[9px] text-emerald-400 block uppercase tracking-wider">Score</span>
          <span className="text-xs font-black text-amber-300">
            {grandTotal} <span className="text-emerald-500">|</span> <span className="text-rose-400">{opponentTotal}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 my-2 overflow-y-auto pr-1">
        {COLUMN_PAIRS.map((pair, idx) => (
          <React.Fragment key={idx}>
            <div>{renderCellContent(pair.left)}</div>
            <div>{renderCellContent(pair.right)}</div>
          </React.Fragment>
        ))}
      </div>

      <div className="mt-auto pt-2 border-t border-emerald-800/40">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-[10px] font-bold text-emerald-300">
            {turn === 'player' ? `Rolls left: ${rollsLeft}/3` : (gameMode === 'ai' ? p2Message : `P2 Rolls: ${p2RollsLeft}/3`)}
          </span>
          <span className="text-[10px] font-black text-amber-300">
            {turn === 'player' ? 'Your Turn' : (gameMode === 'ai' ? 'AI Thinking...' : "Player 2's Turn")}
          </span>
        </div>

        {turn === 'player' ? (
          <div id="player-tray-container" className="bg-emerald-950/80 p-3.5 rounded-2xl border border-emerald-700/50 shadow-lg flex flex-col gap-2.5">
            <div className="flex justify-center gap-3">
              {playerDice.map((val, idx) => (
                <Die
                  key={idx}
                  value={val}
                  held={held[idx]}
                  disabled={rollsLeft === 3 || gameOver || isRolling}
                  isRolling={isRolling}
                  onClick={() => toggleHold(idx)}
                />
              ))}
            </div>

            <button
              disabled={rollsLeft <= 0 || gameOver || isRolling}
              onClick={rollDice}
              className={`w-full py-2.5 rounded-xl font-black text-xs tracking-wider uppercase transition-all shadow-md ${
                rollsLeft > 0 && !gameOver && !isRolling
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 border border-amber-200'
                  : 'bg-emerald-900/50 text-emerald-500/60 border border-emerald-800/40 cursor-not-allowed'
              }`}
            >
              {rollsLeft === 3 ? 'Roll Dice' : rollsLeft > 0 ? `Re-Roll Dice (${rollsLeft} left)` : 'Select a Score'}
            </button>
          </div>
        ) : gameMode === 'friend' ? (
          <div id="p2-tray-container" className="bg-violet-950/80 p-3.5 rounded-2xl border border-violet-700/50 shadow-lg flex flex-col gap-2.5">
            <div className="flex justify-center gap-3">
              {p2Dice.map((val, idx) => (
                <Die
                  key={idx}
                  value={val}
                  held={p2Held[idx]}
                  disabled={p2RollsLeft === 3 || gameOver || isP2Rolling}
                  isRolling={isP2Rolling}
                  isP2={true}
                  onClick={() => toggleHold(idx)}
                />
              ))}
            </div>

            <button
              disabled={p2RollsLeft <= 0 || gameOver || isP2Rolling}
              onClick={rollDice}
              className={`w-full py-2.5 rounded-xl font-black text-xs tracking-wider uppercase transition-all shadow-md ${
                p2RollsLeft > 0 && !gameOver && !isP2Rolling
                  ? 'bg-gradient-to-r from-violet-400 to-violet-500 hover:from-violet-300 hover:to-violet-400 text-violet-950 border border-violet-200'
                  : 'bg-violet-900/50 text-violet-400/60 border border-violet-800/40 cursor-not-allowed'
              }`}
            >
              {p2RollsLeft === 3 ? "Player 2 Roll" : p2RollsLeft > 0 ? `P2 Re-Roll (${p2RollsLeft} left)` : 'Select P2 Score'}
            </button>
          </div>
        ) : (
          <div id="p2-tray-container" className="bg-emerald-950/80 p-3.5 rounded-2xl border border-rose-900/40 shadow-lg text-center py-4">
            <div className="text-xs font-black text-rose-300 animate-pulse">{p2Message}</div>
            <div className="flex justify-center gap-3 mt-2">
              {p2Dice.map((val, idx) => (
                <div key={idx} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-200 font-black text-base">
                  {val}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {gameOver && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-b from-emerald-900 to-emerald-950 border-2 border-amber-400/60 rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center text-white">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 border-2 border-amber-200 flex items-center justify-center text-2xl shadow-xl mx-auto mb-4 animate-bounce">
              🏆
            </div>
            <h2 className="text-lg font-black tracking-wider text-amber-300 mb-1">MATCH FINISHED</h2>
            <div className="w-10 h-1 bg-amber-400 rounded-full mx-auto mb-4"></div>

            <div className="space-y-2 mb-5 bg-emerald-950/80 p-3.5 rounded-2xl border border-emerald-700/40 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-emerald-300">Your Score:</span>
                <span className="text-amber-400 font-black">{grandTotal} PTS</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-emerald-300">{gameMode === 'ai' ? 'AI Bot Score:' : 'Player 2 Score:'}</span>
                <span className="text-rose-400 font-black">{opponentTotal} PTS</span>
              </div>
              <div className="pt-2 border-t border-emerald-800/60 font-black text-sm text-emerald-100">
                {grandTotal > opponentTotal ? '🎉 You Won the Match!' : grandTotal < opponentTotal ? '💀 Defeat! Try Again.' : '🤝 It is a Draw!'}
              </div>
            </div>

            <button
              onClick={resetGame}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black py-3 rounded-xl shadow transition-all text-xs tracking-widest uppercase"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
