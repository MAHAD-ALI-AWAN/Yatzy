import React, { useMemo, useState } from 'react';

const sumDice = (dice, val) => dice.filter((d) => d === val).reduce((a, b) => a + b, 0);

const getCounts = (dice) => {
  const counts = {};
  dice.forEach((d) => {
    counts[d] = (counts[d] || 0) + 1;
  });
  return counts;
};

const checkNOfAKind = (dice, n) => {
  const counts = getCounts(dice);
  for (const value in counts) {
    if (counts[value] >= n) return dice.reduce((a, b) => a + b, 0);
  }
  return 0;
};

const checkFullHouse = (dice) => {
  const counts = Object.values(getCounts(dice));
  return (counts.includes(3) && counts.includes(2)) || counts.includes(5) ? 25 : 0;
};

const checkSmallStraight = (dice) => {
  const unique = [...new Set(dice)].sort();
  const straights = [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6]];
  for (const straight of straights) {
    if (straight.every((num) => unique.includes(num))) return 30;
  }
  return 0;
};

const checkLargeStraight = (dice) => {
  const sorted = [...dice].sort((a, b) => a - b).join('');
  return sorted === '12345' || sorted === '23456' ? 40 : 0;
};

const checkYatzy = (dice) => (Object.values(getCounts(dice)).includes(5) ? 50 : 0);

const MiniDiceIcon = ({ value, label }) => {
  const dots = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [25, 75], [75, 25], [75, 75]],
    5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
    6: [[25, 20], [25, 50], [25, 80], [75, 20], [75, 50], [75, 80]],
  }[value];

  if (dots) {
    return (
      <div className="w-5 h-5 bg-gradient-to-br from-emerald-100 to-emerald-300 rounded relative shadow-sm border border-emerald-400/40 shrink-0 flex items-center justify-center">
        {dots.map((pos, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-950 rounded-full"
            style={{ top: `${pos[0]}%`, left: `${pos[1]}%`, transform: 'translate(-50%, -50%)' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-5 h-5 bg-emerald-950/60 border border-emerald-500/30 rounded text-[9px] font-black text-amber-300 flex items-center justify-center shadow-inner">
      {label}
    </div>
  );
};

const COLUMN_PAIRS = [
  {
    left: { id: 'ones', label: 'Ones', diceVal: 1, calc: (d) => sumDice(d, 1) },
    right: { id: 'threeOfAKind', label: '3x TRIPS', iconLabel: '3x', calc: (d) => checkNOfAKind(d, 3) },
  },
  {
    left: { id: 'twos', label: 'Twos', diceVal: 2, calc: (d) => sumDice(d, 2) },
    right: { id: 'fourOfAKind', label: '4x QUADS', iconLabel: '4x', calc: (d) => checkNOfAKind(d, 4) },
  },
  {
    left: { id: 'threes', label: 'Threes', diceVal: 3, calc: (d) => sumDice(d, 3) },
    right: { id: 'fullHouse', label: 'Full House', iconLabel: '🏠', calc: (d) => checkFullHouse(d) },
  },
  {
    left: { id: 'fours', label: 'Fours', diceVal: 4, calc: (d) => sumDice(d, 4) },
    right: { id: 'smallStraight', label: 'Sm. Straight', iconLabel: '⚁⚂', calc: (d) => checkSmallStraight(d) },
  },
  {
    left: { id: 'fives', label: 'Fives', diceVal: 5, calc: (d) => sumDice(d, 5) },
    right: { id: 'largeStraight', label: 'Lg. Straight', iconLabel: '⚂⚃', calc: (d) => checkLargeStraight(d) },
  },
  {
    left: { id: 'sixes', label: 'Sixes', diceVal: 6, calc: (d) => sumDice(d, 6) },
    right: { id: 'yatzy', label: 'Yatzy', iconLabel: '⭐', calc: (d) => checkYatzy(d) },
  },
  {
    left: { id: 'bonus', isBonus: true },
    right: { id: 'chance', label: 'Chance', iconLabel: '🎲', calc: (d) => d.reduce((a, b) => a + b, 0) },
  },
];

const emptyDice = [1, 1, 1, 1, 1];
const emptyHeld = [false, false, false, false, false];

function Die({ value, held, onClick, disabled, isRolling, isBot }) {
  const isHeld = Boolean(held);

  const renderDots = (val) => {
    const dotClass = `w-2 h-2 bg-emerald-950 rounded-full shadow-inner`;
    switch (val) {
      case 1:
        return <div className="flex items-center justify-center w-full h-full"><div className={dotClass}></div></div>;
      case 2:
        return (
          <div className="flex flex-col justify-between w-full h-full p-1">
            <div className={`self-start ${dotClass}`}></div>
            <div className={`self-end ${dotClass}`}></div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col justify-between w-full h-full p-1">
            <div className={`self-start ${dotClass}`}></div>
            <div className={`self-center ${dotClass}`}></div>
            <div className={`self-end ${dotClass}`}></div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col justify-between w-full h-full p-1">
            <div className="flex justify-between w-full"><div className={dotClass}></div><div className={dotClass}></div></div>
            <div className="flex justify-between w-full"><div className={dotClass}></div><div className={dotClass}></div></div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col justify-between w-full h-full p-1">
            <div className="flex justify-between w-full"><div className={dotClass}></div><div className={dotClass}></div></div>
            <div className="flex justify-center w-full"><div className={dotClass}></div></div>
            <div className="flex justify-between w-full"><div className={dotClass}></div><div className={dotClass}></div></div>
          </div>
        );
      case 6:
        return (
          <div className="flex flex-col justify-between w-full h-full p-1">
            <div className="flex justify-between w-full"><div className={dotClass}></div><div className={dotClass}></div></div>
            <div className="flex justify-between w-full"><div className={dotClass}></div><div className={dotClass}></div></div>
            <div className="flex justify-between w-full"><div className={dotClass}></div><div className={dotClass}></div></div>
          </div>
        );
      default:
        return null;
    }
  };

  const shouldAnimate = isRolling && !held;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all shadow-md border-2 bg-gradient-to-br from-white via-slate-100 to-emerald-50 border-emerald-300/60 text-emerald-950 ${
        isBot ? 'bg-transparent border-transparent shadow-none' : 'hover:bg-white shadow-emerald-950/25'
      } ${isHeld && !isBot ? 'from-amber-300 to-amber-500 border-amber-200 -translate-y-1 ring-1 ring-amber-300' : ''} ${
        isHeld && isBot ? 'bg-violet-500/10 border-violet-300/70 shadow-none' : ''
      } ${shouldAnimate ? 'animate-spin opacity-60' : ''}`}
    >
      {renderDots(value)}
      {isHeld && (
        <span className={`absolute -bottom-2 ${isBot ? 'bg-violet-400 text-violet-950' : 'bg-amber-400 text-emerald-950'} text-[7px] font-black px-1 rounded uppercase tracking-tighter border ${isBot ? 'border-violet-200' : 'border-amber-200'}`}>
          {isBot ? 'Hold' : 'Held'}
        </span>
      )}
    </button>
  );
}

export default function App() {
  const [playerDice, setPlayerDice] = useState(emptyDice);
  const [held, setHeld] = useState(emptyHeld);
  const [rollsLeft, setRollsLeft] = useState(3);
  const [turn, setTurn] = useState('player');
  const [playerScores, setPlayerScores] = useState({});
  const [opponentScores, setOpponentScores] = useState({});
  const [isRolling, setIsRolling] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Flying Animation State
  const [flyingDice, setFlyingDice] = useState([]);

  // Bot live roll state
  const [botDice, setBotDice] = useState([1, 1, 1, 1, 1]);
  const [botHeld, setBotHeld] = useState([false, false, false, false, false]);
  const [botRollsLeft, setBotRollsLeft] = useState(3);
  const [isBotRolling, setIsBotRolling] = useState(false);
  const [botMessage, setBotMessage] = useState('Waiting for turn...');

  const upperSubtotal = useMemo(
    () => ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].reduce((acc, id) => acc + (playerScores[id] || 0), 0),
    [playerScores],
  );
  const bonus = upperSubtotal >= 63 ? 35 : 0;
  const upperTotal = upperSubtotal + bonus;
  
  const lowerTotal = useMemo(
    () => ['threeOfAKind', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yatzy', 'chance'].reduce((acc, id) => acc + (playerScores[id] || 0), 0),
    [playerScores],
  );
  const grandTotal = upperTotal + lowerTotal;
  const opponentTotal = useMemo(
    () => Object.values(opponentScores).reduce((a, b) => a + b, 0),
    [opponentScores],
  );

  const totalCategoriesCount = 13;

  const finishGameIfNeeded = (scoresMap) => {
    if (Object.keys(scoresMap).length === totalCategoriesCount) {
      setGameOver(true);
      setTurn('player');
    }
  };

  const chooseBotHeldDice = (dice) => {
    const counts = getCounts(dice);
    const nextHeld = Array(5).fill(false);
    const highestCount = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

    if (!highestCount) return nextHeld;

    const targetValue = Number(highestCount[0]);
    if (highestCount[1] >= 2) {
      dice.forEach((value, idx) => {
        if (value === targetValue) nextHeld[idx] = true;
      });
    }

    if (nextHeld.every((held) => !held)) {
      const sorted = [...dice].sort((a, b) => a - b);
      const unique = [...new Set(sorted)];
      if (unique.length >= 4) {
        sorted.forEach((value, idx) => {
          if (value >= 2) nextHeld[idx] = true;
        });
      }
    }

    return nextHeld;
  };

  const getBestBotCategory = (dice, takenScores) => {
    const scoreMap = {
      ones: (d) => sumDice(d, 1),
      twos: (d) => sumDice(d, 2),
      threes: (d) => sumDice(d, 3),
      fours: (d) => sumDice(d, 4),
      fives: (d) => sumDice(d, 5),
      sixes: (d) => sumDice(d, 6),
      threeOfAKind: (d) => checkNOfAKind(d, 3),
      fourOfAKind: (d) => checkNOfAKind(d, 4),
      fullHouse: (d) => checkFullHouse(d),
      smallStraight: (d) => checkSmallStraight(d),
      largeStraight: (d) => checkLargeStraight(d),
      yatzy: (d) => checkYatzy(d),
      chance: (d) => d.reduce((a, b) => a + b, 0),
    };

    const available = Object.entries(scoreMap).filter(([id]) => takenScores[id] === undefined);
    if (!available.length) return null;

    let best = available[0];
    for (const entry of available.slice(1)) {
      if (entry[1](dice) > best[1](dice)) {
        best = entry;
      }
    }

    return best[0];
  };

  const rollDice = () => {
    if (turn !== 'player' || rollsLeft <= 0 || gameOver) return;
    setIsRolling(true);

    setTimeout(() => {
      const nextDice = playerDice.map((val, idx) => {
        if (held[idx]) return val;
        return Math.floor(Math.random() * 6) + 1;
      });

      setPlayerDice(nextDice);
      setRollsLeft((current) => current - 1);
      setIsRolling(false);
    }, 200);
  };

  const toggleHold = (idx) => {
    if (turn !== 'player' || rollsLeft === 3 || gameOver) return;
    setHeld((current) => {
      const next = [...current];
      next[idx] = !next[idx];
      return next;
    });
  };

  // Trigger Flying Animation and Score Commit
  const triggerFlyAndScore = (catId, calcFn, isBot = false, diceValues = playerDice) => {
    const scoreBoxEl = document.getElementById(`score-box-${catId}`);
    const sourceTrayEl = document.getElementById(isBot ? 'bot-tray-container' : 'player-tray-container');

    if (scoreBoxEl && sourceTrayEl) {
      const targetRect = scoreBoxEl.getBoundingClientRect();
      const sourceRect = sourceTrayEl.getBoundingClientRect();

      const newFlyingItems = diceValues.map((val, idx) => ({
        id: `${isBot ? 'bot' : 'player'}-fly-${idx}-${Date.now()}`,
        val,
        isBot,
        startX: sourceRect.left + (sourceRect.width / 5) * idx + 10,
        startY: sourceRect.top + sourceRect.height / 2,
        endX: targetRect.left + targetRect.width / 2 - 12,
        endY: targetRect.top + targetRect.height / 2 - 12,
      }));

      setFlyingDice((prev) => [...prev, ...newFlyingItems]);

      // Force a slight timeout so CSS transition registers starting coordinates before shifting to target
      setTimeout(() => {
        setFlyingDice((prev) =>
          prev.map((item) => {
            if (newFlyingItems.some((f) => f.id === item.id)) {
              return { ...item, animate: true };
            }
            return item;
          })
        );
      }, 30);

      setTimeout(() => {
        setFlyingDice((prev) => prev.filter((item) => !newFlyingItems.some((f) => f.id === item.id)));

        if (!isBot) {
          const score = calcFn(diceValues);
          const updatedScores = { ...playerScores, [catId]: score };
          setPlayerScores(updatedScores);
          setPlayerDice(emptyDice);
          setHeld(emptyHeld);
          setRollsLeft(3);
          finishGameIfNeeded(updatedScores);

          if (!gameOver && Object.keys(updatedScores).length < totalCategoriesCount) {
            startBotTurn();
          }
        } else {
          const calcMap = {
            ones: (d) => sumDice(d, 1),
            twos: (d) => sumDice(d, 2),
            threes: (d) => sumDice(d, 3),
            fours: (d) => sumDice(d, 4),
            fives: (d) => sumDice(d, 5),
            sixes: (d) => sumDice(d, 6),
            threeOfAKind: (d) => checkNOfAKind(d, 3),
            fourOfAKind: (d) => checkNOfAKind(d, 4),
            fullHouse: (d) => checkFullHouse(d),
            smallStraight: (d) => checkSmallStraight(d),
            largeStraight: (d) => checkLargeStraight(d),
            yatzy: (d) => checkYatzy(d),
            chance: (d) => d.reduce((a, b) => a + b, 0),
          };
          const opponentScore = calcMap[catId](diceValues);
          const nextOpponentScores = { ...opponentScores, [catId]: opponentScore };

          setOpponentScores(nextOpponentScores);
          setTurn('player');
          setBotMessage('Waiting for turn...');
          setBotHeld([false, false, false, false, false]);
          if (Object.keys(nextOpponentScores).length === totalCategoriesCount) {
            setGameOver(true);
          }
        }
      }, 650);
    } else {
      if (!isBot) {
        const score = calcFn(diceValues);
        const updatedScores = { ...playerScores, [catId]: score };
        setPlayerScores(updatedScores);
        setPlayerDice(emptyDice);
        setHeld(emptyHeld);
        setRollsLeft(3);
        finishGameIfNeeded(updatedScores);
        if (!gameOver && Object.keys(updatedScores).length < totalCategoriesCount) startBotTurn();
      }
    }
  };

  const handleSelectScore = (catId, calcFn) => {
    if (turn !== 'player' || playerScores[catId] !== undefined || rollsLeft === 3 || gameOver) return;
    triggerFlyAndScore(catId, calcFn, false, playerDice);
  };

  const startBotTurn = () => {
    setTurn('opponent');
    setBotRollsLeft(3);
    setBotMessage('AI is rolling...');
    setIsBotRolling(true);
    setBotHeld([false, false, false, false, false]);

    let currentBotDice = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
    let heldMask = [false, false, false, false, false];
    let rollStep = 0;

    const runBotRoll = () => {
      if (rollStep >= 3) {
        setIsBotRolling(false);
        setBotMessage('AI choosing category...');

        setTimeout(() => {
          const chosenCategory = getBestBotCategory(currentBotDice, opponentScores);
          if (chosenCategory) {
            triggerFlyAndScore(chosenCategory, null, true, currentBotDice);
          } else {
            setTurn('player');
          }
        }, 700);

        return;
      }

      if (rollStep === 0) {
        currentBotDice = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
        heldMask = [false, false, false, false, false];
      } else {
        currentBotDice = currentBotDice.map((value, idx) => {
          if (heldMask[idx]) return value;
          return Math.floor(Math.random() * 6) + 1;
        });
      }

      if (rollStep < 2) {
        const nextHoldChoices = chooseBotHeldDice(currentBotDice);
        heldMask = heldMask.map((isHeld, idx) => isHeld || nextHoldChoices[idx]);
        setBotHeld([...heldMask]);
        setBotMessage(
          heldMask.some(Boolean)
            ? `AI holding ${heldMask.filter(Boolean).length} dice...`
            : 'AI re-rolling...'
        );
      } else {
        setBotHeld([...heldMask]);
        setBotMessage('AI finalizing turn...');
      }

      setBotDice(currentBotDice);
      setIsBotRolling(true);
      setBotRollsLeft(Math.max(0, 3 - (rollStep + 1)));

      rollStep += 1;
      setTimeout(runBotRoll, 700);
    };

    setTimeout(runBotRoll, 500);
  };

  const resetGame = () => {
    setPlayerDice(emptyDice);
    setHeld(emptyHeld);
    setRollsLeft(3);
    setTurn('player');
    setPlayerScores({});
    setOpponentScores({});
    setGameOver(false);
    setBotHeld([false, false, false, false, false]);
    setBotDice([1, 1, 1, 1, 1]);
    setBotRollsLeft(3);
    setBotMessage('Waiting for turn...');
  };

  const renderCellContent = (item) => {
    if (item.isBonus) {
      return (
        <div className="bg-emerald-950/70 rounded-xl px-2.5 py-1.5 flex justify-between items-center border border-emerald-600/30 shadow-sm w-full">
          <div>
            <span className="text-[8px] uppercase font-black text-emerald-400 block leading-none">Bonus</span>
            <span className="text-[10px] font-black text-amber-300">+35 PTS</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-emerald-100">{upperSubtotal}</span>
            <span className="text-[8px] text-emerald-400 block leading-none">/ 63</span>
          </div>
        </div>
      );
    }

    const isScored = playerScores[item.id] !== undefined;
    const canScore = turn === 'player' && !isScored && rollsLeft < 3;
    const potentialScore = item.calc(playerDice);
    const aiScore = opponentScores[item.id];

    return (
      <button
        id={`score-box-${item.id}`}
        disabled={!canScore}
        onClick={() => handleSelectScore(item.id, item.calc)}
        className={`flex items-center justify-between px-2 py-1 rounded-xl border transition-all w-full relative overflow-visible ${
          isScored
            ? 'bg-emerald-950/30 border-emerald-900/30 text-emerald-500/40'
            : canScore
            ? 'bg-emerald-900/90 hover:bg-emerald-800 border-amber-400 text-white shadow-md ring-1 ring-amber-400/30'
            : 'bg-emerald-950/50 border-emerald-700/30 text-emerald-200'
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <MiniDiceIcon value={item.diceVal} label={item.iconLabel} />
          <span className="text-[10px] font-bold tracking-tight truncate">{item.label}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isScored ? (
            <span className="font-black text-amber-300 text-[11px]" title="Your Score">
              {playerScores[item.id]}
            </span>
          ) : canScore ? (
            <span className="px-1.5 py-0.5 bg-amber-400 text-emerald-950 rounded font-black text-[8px] shadow whitespace-nowrap">
              +{potentialScore}
            </span>
          ) : (
            <span className="w-5 h-5 bg-emerald-950/60 rounded border border-emerald-700/30 flex items-center justify-center text-emerald-400/50 text-[9px]">-</span>
          )}

          <span className="text-emerald-600 font-bold text-[9px]">|</span>

          {aiScore !== undefined ? (
            <span className="font-black text-rose-300 text-[11px]" title="AI Score">
              {aiScore}
            </span>
          ) : (
            <span className="w-5 h-5 bg-emerald-950/60 rounded border border-rose-950/30 flex items-center justify-center text-rose-400/40 text-[9px]">-</span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="h-screen w-screen bg-emerald-950 flex items-center justify-center p-0 font-mono select-none overflow-hidden relative">
      
      {/* Fixed Global Flying Dice Overlay Layer */}
      {flyingDice.map((item) => {
        const xCoord = item.animate ? item.endX : item.startX;
        const yCoord = item.animate ? item.endY : item.startY;

        return (
          <div
            key={item.id}
            className={`fixed z-50 pointer-events-none transition-all duration-600 ease-out flex items-center justify-center w-6 h-6 rounded-lg shadow-xl border ${
              item.isBot 
                ? 'bg-violet-400 border-violet-200 text-violet-950' 
                : 'bg-amber-400 border-amber-200 text-emerald-950'
            }`}
            style={{
              left: `${xCoord}px`,
              top: `${yCoord}px`,
              transform: item.animate ? 'scale(0.5) rotate(360deg)' : 'scale(1) rotate(0deg)',
              opacity: item.animate ? 0.3 : 1,
            }}
          >
            <span className="text-[10px] font-black">{item.val}</span>
          </div>
        );
      })}

      <div className="w-full h-full sm:max-w-md sm:h-[840px] sm:rounded-3xl bg-gradient-to-b from-emerald-900 via-emerald-950 to-stone-950 border-0 sm:border-2 border-emerald-600/40 shadow-2xl flex flex-col justify-between overflow-hidden relative">
        
        {/* Compact Header */}
        <div className="bg-emerald-950/90 px-3 py-2 border-b border-emerald-700/40 flex justify-between items-center shrink-0 text-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400 border border-amber-200 flex items-center justify-center font-black text-emerald-950 text-xs shadow">🎲</div>
            <div>
              <h1 className="text-[11px] font-black tracking-wider text-emerald-100">CASINO YATZY</h1>
              <p className="text-[9px] text-emerald-300/80">{turn === 'player' ? (rollsLeft === 3 ? 'Roll dice to begin' : 'Select a score box') : botMessage}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-600/50">
            <span className="text-xs font-black text-amber-300">{grandTotal}</span>
            <span className="text-[9px] text-emerald-400 font-bold">VS</span>
            <span className="text-xs font-black text-rose-300">{opponentTotal}</span>
          </div>
        </div>

        {gameOver ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-emerald-950/90 border border-emerald-600/50 rounded-2xl p-6 w-full max-w-sm shadow-xl">
              <h2 className="text-2xl font-black text-emerald-100 mb-2">Game Over!</h2>
              <p className="text-emerald-200 mb-5 text-xs">Your Score: <strong className="text-amber-400 text-base">{grandTotal}</strong><br/>AI Score: <strong className="text-rose-400 text-base">{opponentTotal}</strong></p>
              <button 
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black py-3 rounded-xl shadow transition-all text-xs tracking-wider uppercase"
              >
                Play Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Bot Live Roll Indicator Bar */}
            <div className={`px-3 py-1.5 flex justify-between items-center transition-all ${turn === 'opponent' ? 'opacity-100' : 'opacity-60'}`}>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                <span className="text-[9px] font-black text-rose-200 uppercase tracking-wider">AI Board</span>
                <span className="text-[8px] text-rose-300/80">{turn === 'opponent' ? `${botRollsLeft} rolls left` : 'ready'}</span>
              </div>
              <div id="bot-tray-container" className="flex gap-1.5 items-center">
                {botDice.map((val, idx) => (
                  <Die
                    key={idx}
                    value={val}
                    held={botHeld[idx]}
                    disabled={true}
                    isBot={true}
                    isRolling={isBotRolling}
                  />
                ))}
              </div>
            </div>

            {/* Grid Area - Dual Column Layout */}
            <div className="flex-1 px-3 py-1.5 flex flex-col justify-between gap-1 overflow-hidden">
              {COLUMN_PAIRS.map((row, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2 flex-1 min-h-0">
                  {renderCellContent(row.left)}
                  {renderCellContent(row.right)}
                </div>
              ))}
            </div>

            {/* Bottom Dice Tray & Roll Button */}
            <div className="bg-emerald-950/95 px-3 py-2.5 border-t border-emerald-700/40 shrink-0 shadow-lg">
              <div className="flex justify-between items-center mb-1.5 px-1 text-white">
                <span className="text-[9px] font-bold text-emerald-300">
                  {turn === 'player' ? `Rolls Left: ${rollsLeft}/3` : 'AI turn in progress...'}
                </span>
                <span className="text-[9px] text-amber-300 font-bold">
                  {rollsLeft < 3 ? 'Tap die to lock' : 'Ready to Roll'}
                </span>
              </div>

              {/* Dice Row */}
              <div id="player-tray-container" className="flex justify-center gap-2 mb-2">
                {playerDice.map((val, idx) => (
                  <Die
                    key={idx}
                    value={val}
                    held={held[idx]}
                    disabled={rollsLeft === 3 || turn !== 'player'}
                    onClick={() => toggleHold(idx)}
                    isRolling={isRolling}
                  />
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={rollDice}
                disabled={turn !== 'player' || rollsLeft === 0 || isRolling}
                className={`w-full py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase transition-all shadow-md ${
                  turn !== 'player' || rollsLeft === 0 || isRolling
                    ? 'bg-emerald-950/50 text-emerald-500/40 cursor-not-allowed border border-emerald-800'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 shadow-amber-500/20 border border-amber-300'
                }`}
              >
                {rollsLeft === 3 ? 'Roll Dice' : rollsLeft > 0 ? `Roll Again (${rollsLeft})` : 'Choose Score Above'}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}