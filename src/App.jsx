import { useMemo, useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import MenuScreen from './components/MenuScreen';
import StatsModal from './components/StatsModal';
import ConfirmModal from './components/ConfirmModal';
import { chooseBotHeldDice, getBestBotCategory } from './game/ai';
import { clearGameState, STORAGE_KEYS } from './game/storage';
import { sumDice, checkNOfAKind, checkFullHouse, checkSmallStraight, checkLargeStraight, checkYatzy, emptyDice, emptyHeld } from './game/logic';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  
  const [gameMode, setGameMode] = useState(() => localStorage.getItem(STORAGE_KEYS.gameMode) || 'ai');
  const [playerDice, setPlayerDice] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.playerDice);
    return saved ? JSON.parse(saved) : emptyDice;
  });
  const [held, setHeld] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.held);
    return saved ? JSON.parse(saved) : emptyHeld;
  });
  const [rollsLeft, setRollsLeft] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.rollsLeft);
    return saved !== null ? Number(saved) : 3;
  });
  const [turn, setTurn] = useState(() => localStorage.getItem(STORAGE_KEYS.turn) || 'player');
  const [playerScores, setPlayerScores] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.playerScores);
    return saved ? JSON.parse(saved) : {};
  });
  const [opponentScores, setOpponentScores] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.opponentScores);
    return saved ? JSON.parse(saved) : {};
  });
  const [gameOver, setGameOver] = useState(() => localStorage.getItem(STORAGE_KEYS.gameOver) === 'true');
  const [resultRecorded, setResultRecorded] = useState(() => localStorage.getItem(STORAGE_KEYS.resultRecorded) === 'true');
  
  // Track if bonus sound has already played using localStorage persistence
  const [bonusPlayed, setBonusPlayed] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.bonusPlayed) === 'true';
  });

  // Safe stats initialization with default fallbacks for all properties
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.stats);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          played: parsed.played || 0,
          wins: parsed.wins || 0,
          losses: parsed.losses || 0,
          draws: parsed.draws || 0,
          highestScore: parsed.highestScore || 0,
          totalScore: parsed.totalScore || 0,
          currentStreak: parsed.currentStreak || 0,
          highestStreak: parsed.highestStreak || 0,
        };
      } catch (e) {
        // Fallback if JSON parse fails
      }
    }
    return { 
      played: 0, 
      wins: 0, 
      losses: 0, 
      draws: 0, 
      highestScore: 0, 
      totalScore: 0, 
      currentStreak: 0, 
      highestStreak: 0 
    };
  });

  const [showStatsModal, setShowStatsModal] = useState(false);
  
  const [pendingMode, setPendingMode] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [isRolling, setIsRolling] = useState(false);
  const [flyingDice, setFlyingDice] = useState([]);
  const [p2Dice, setP2Dice] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.p2Dice);
    return saved ? JSON.parse(saved) : emptyDice;
  });
  const [p2Held, setP2Held] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.p2Held);
    return saved ? JSON.parse(saved) : emptyHeld;
  });
  const [p2RollsLeft, setP2RollsLeft] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.p2RollsLeft);
    return saved !== null ? Number(saved) : 3;
  });
  const [isP2Rolling, setIsP2Rolling] = useState(false);
  const [p2Message, setP2Message] = useState('Waiting for turn...');

  const totalCategoriesCount = 13;

  // Bulletproof DOM-based Sound Helper Workaround
  const playSound = (fileName) => {
    try {
      const cleanName = fileName.replace('.wav', '').trim();
      const audioElement = document.getElementById(`sound-${cleanName}`);
      if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.volume = 0.6;
        audioElement.play().catch((err) => {
          console.log("Browser autoplay policy restricted sound:", err.message);
        });
      }
    } catch (e) {
      console.log("Audio playback error:", e);
    }
  };

  const hasSavedGame = useMemo(() => {
    const pScores = JSON.parse(localStorage.getItem(STORAGE_KEYS.playerScores) || '{}');
    const aScores = JSON.parse(localStorage.getItem(STORAGE_KEYS.opponentScores) || '{}');
    const isOver = localStorage.getItem(STORAGE_KEYS.gameOver) === 'true';
    const totalFilled = Object.keys(pScores).length + Object.keys(aScores).length;
    return totalFilled > 0 && !isOver;
  }, [playerScores, opponentScores, gameOver]);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => setShowSplash(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  useEffect(() => {
    if (gameStarted) {
      localStorage.setItem(STORAGE_KEYS.gameStarted, 'true');
    }
    localStorage.setItem(STORAGE_KEYS.gameMode, gameMode);
    localStorage.setItem(STORAGE_KEYS.playerDice, JSON.stringify(playerDice));
    localStorage.setItem(STORAGE_KEYS.held, JSON.stringify(held));
    localStorage.setItem(STORAGE_KEYS.rollsLeft, rollsLeft);
    localStorage.setItem(STORAGE_KEYS.turn, turn);
    localStorage.setItem(STORAGE_KEYS.playerScores, JSON.stringify(playerScores));
    localStorage.setItem(STORAGE_KEYS.opponentScores, JSON.stringify(opponentScores));
    localStorage.setItem(STORAGE_KEYS.gameOver, gameOver);
    localStorage.setItem(STORAGE_KEYS.p2Dice, JSON.stringify(p2Dice));
    localStorage.setItem(STORAGE_KEYS.p2Held, JSON.stringify(p2Held));
    localStorage.setItem(STORAGE_KEYS.p2RollsLeft, p2RollsLeft);
    localStorage.setItem(STORAGE_KEYS.resultRecorded, resultRecorded);
  }, [gameStarted, gameMode, playerDice, held, rollsLeft, turn, playerScores, opponentScores, gameOver, p2Dice, p2Held, p2RollsLeft, resultRecorded]);

  const upperSubtotal = useMemo(
    () => ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].reduce((acc, id) => acc + (playerScores[id] || 0), 0),
    [playerScores],
  );
  
  const bonus = upperSubtotal >= 63 ? 35 : 0;

  // Check and play bonus sound when upper subtotal reaches 63+
  useEffect(() => {
    if (upperSubtotal >= 63 && !bonusPlayed) {
      playSound('bonus.wav');
      setBonusPlayed(true);
      localStorage.setItem(STORAGE_KEYS.bonusPlayed, 'true');
    }
  }, [upperSubtotal, bonusPlayed]);

  const upperTotal = upperSubtotal + bonus;
  const lowerTotal = useMemo(
    () => ['threeOfAKind', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yatzy', 'chance'].reduce((acc, id) => acc + (playerScores[id] || 0), 0),
    [playerScores],
  );
  const grandTotal = upperTotal + lowerTotal;
  const opponentTotal = useMemo(() => {
    const upperIds = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
    const lowerIds = ['threeOfAKind', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yatzy', 'chance'];
    const upperSubtotalLocal = upperIds.reduce((acc, id) => acc + (opponentScores[id] || 0), 0);
    const bonusLocal = upperSubtotalLocal >= 63 ? 35 : 0;
    const lowerTotalLocal = lowerIds.reduce((acc, id) => acc + (opponentScores[id] || 0), 0);
    return upperSubtotalLocal + bonusLocal + lowerTotalLocal;
  }, [opponentScores]);

  const recordGameResult = (pTotal, aTotal) => {
    if (gameMode === 'friend' || resultRecorded) return;

    setStats((prev) => {
      const prevPlayed = prev?.played || 0;
      const prevTotalScore = prev?.totalScore || 0;
      const prevHighestScore = prev?.highestScore || 0;
      const prevWins = prev?.wins || 0;
      const prevLosses = prev?.losses || 0;
      const prevDraws = prev?.draws || 0;
      const prevCurrentStreak = prev?.currentStreak || 0;
      const prevHighestStreak = prev?.highestStreak || 0;

      const nextPlayed = prevPlayed + 1;
      const nextTotalScore = prevTotalScore + pTotal;
      const nextHighestScore = Math.max(prevHighestScore, pTotal);
      
      let nextWins = prevWins;
      let nextLosses = prevLosses;
      let nextDraws = prevDraws;
      let nextCurrentStreak = prevCurrentStreak;
      let nextHighestStreak = prevHighestStreak;

      if (pTotal > aTotal) {
        nextWins += 1;
        nextCurrentStreak += 1;
        if (nextCurrentStreak > nextHighestStreak) {
          nextHighestStreak = nextCurrentStreak;
        }
      } else if (pTotal < aTotal) {
        nextLosses += 1;
        nextCurrentStreak = 0;
      } else {
        nextDraws += 1;
        nextCurrentStreak = 0;
      }

      const nextStats = {
        played: nextPlayed,
        wins: nextWins,
        losses: nextLosses,
        draws: nextDraws,
        highestScore: nextHighestScore,
        totalScore: nextTotalScore,
        currentStreak: nextCurrentStreak,
        highestStreak: nextHighestStreak,
      };

      localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(nextStats));
      return nextStats;
    });

    localStorage.setItem(STORAGE_KEYS.resultRecorded, 'true');
    setResultRecorded(true);
  };

  useEffect(() => {
    const pCount = Object.keys(playerScores).length;
    const oCount = Object.keys(opponentScores).length;
    if (pCount === totalCategoriesCount && oCount === totalCategoriesCount) {
      if (!gameOver) {
        setGameOver(true);
        setTurn('player');

        // Play win/lose sound directly via hidden DOM audio elements
        if (gameMode !== 'friend' && !resultRecorded) {
          if (grandTotal > opponentTotal) {
            playSound('win.wav');
          } else if (grandTotal < opponentTotal) {
            playSound('lose.wav');
          }
        }
      }
      if (!resultRecorded && gameMode !== 'friend') {
        recordGameResult(grandTotal, opponentTotal);
      }
    }
  }, [playerScores, opponentScores, gameOver, totalCategoriesCount, grandTotal, opponentTotal, gameMode, resultRecorded]);

  const rollDice = () => {
    const pCount = Object.keys(playerScores).length;
    const oCount = Object.keys(opponentScores).length;
    if (pCount === totalCategoriesCount && oCount === totalCategoriesCount) {
      if (!gameOver) setGameOver(true);
      return;
    }

    if (turn !== 'player' && gameMode === 'friend' && turn !== 'opponent') return;
    const currentRolls = turn === 'player' ? rollsLeft : p2RollsLeft;
    if (currentRolls <= 0 || gameOver) return;

    if (turn === 'player') setIsRolling(true);
    else setIsP2Rolling(true);

    setTimeout(() => {
      if (turn === 'player') {
        const nextDice = playerDice.map((val, idx) => (held[idx] ? val : Math.floor(Math.random() * 6) + 1));
        setPlayerDice(nextDice);
        setRollsLeft((current) => current - 1);
        setIsRolling(false);
      } else {
        const nextDice = p2Dice.map((val, idx) => (p2Held[idx] ? val : Math.floor(Math.random() * 6) + 1));
        setP2Dice(nextDice);
        setP2RollsLeft((current) => current - 1);
        setIsP2Rolling(false);
      }
    }, 200);
  };

  const toggleHold = (idx) => {
    if (gameOver) return;
    const pCount = Object.keys(playerScores).length;
    const oCount = Object.keys(opponentScores).length;
    if (pCount === totalCategoriesCount && oCount === totalCategoriesCount) {
      if (!gameOver) setGameOver(true);
      return;
    }
    if (turn === 'player') {
      if (rollsLeft === 3) return;
      setHeld((current) => {
        const next = [...current];
        next[idx] = !next[idx];
        return next;
      });
    } else if (gameMode === 'friend' && turn === 'opponent') {
      if (p2RollsLeft === 3) return;
      setP2Held((current) => {
        const next = [...current];
        next[idx] = !next[idx];
        return next;
      });
    }
  };

  const finalizeScore = (catId, calcFn, isP2 = false, diceValues = turn === 'player' ? playerDice : p2Dice) => {
    const computeTotal = (scoresObj) => {
      const upperIds = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
      const lowerIds = ['threeOfAKind', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yatzy', 'chance'];
      const upperSubtotalLocal = upperIds.reduce((acc, id) => acc + (scoresObj[id] || 0), 0);
      const bonusLocal = upperSubtotalLocal >= 63 ? 35 : 0;
      const lowerTotalLocal = lowerIds.reduce((acc, id) => acc + (scoresObj[id] || 0), 0);
      return upperSubtotalLocal + bonusLocal + lowerTotalLocal;
    };

    if (!isP2) {
      const score = calcFn ? calcFn(diceValues) : 0;
      
      // Play Yatzy sound if scored successfully
      if (catId === 'yatzy' && score > 0) {
        playSound('yatzy.wav');
      }

      const updatedScores = { ...playerScores, [catId]: score };
      setPlayerScores(updatedScores);
      setPlayerDice(emptyDice);
      setHeld(emptyHeld);
      setRollsLeft(3);

      if (Object.keys(updatedScores).length === totalCategoriesCount && Object.keys(opponentScores).length === totalCategoriesCount) {
        setGameOver(true);
        setTurn('player');
        const pTotalLocal = computeTotal(updatedScores);
        const aTotalLocal = computeTotal(opponentScores);
        recordGameResult(pTotalLocal, aTotalLocal);
      } else if (!gameOver) {
        if (gameMode === 'ai') startBotTurn();
        else {
          setTurn('opponent');
          setP2Dice(emptyDice);
          setP2Held(emptyHeld);
          setP2RollsLeft(3);
          setP2Message("Player 2's Turn");
        }
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
      const p2Score = calcFn ? calcFn(diceValues) : (calcMap[catId] ? calcMap[catId](diceValues) : 0);
      const nextOpponentScores = { ...opponentScores, [catId]: p2Score };

      setOpponentScores(nextOpponentScores);
      setP2Held(emptyHeld);
      setP2Dice(emptyDice);
      setP2RollsLeft(3);

      if (Object.keys(playerScores).length === totalCategoriesCount && Object.keys(nextOpponentScores).length === totalCategoriesCount) {
        setGameOver(true);
        setTurn('player');
        setP2Message('Game Over');
        const pTotalLocal = computeTotal(playerScores);
        const aTotalLocal = computeTotal(nextOpponentScores);
        recordGameResult(pTotalLocal, aTotalLocal);
      } else {
        setTurn('player');
        setP2Message('Waiting for turn...');
      }
    }
  };

  const triggerFlyAndScore = (catId, calcFn, isP2 = false, diceValues = turn === 'player' ? playerDice : p2Dice) => {
    const scoreBoxEl = document.getElementById(`score-box-${catId}`);
    const sourceTrayEl = document.getElementById(isP2 ? 'p2-tray-container' : 'player-tray-container');

    if (!scoreBoxEl || !sourceTrayEl) {
      finalizeScore(catId, calcFn, isP2, diceValues);
      return;
    }

    const targetRect = scoreBoxEl.getBoundingClientRect();
    const sourceRect = sourceTrayEl.getBoundingClientRect();
    const newFlyingItems = diceValues.map((val, idx) => ({
      id: `${isP2 ? 'p2' : 'player'}-fly-${idx}-${Date.now()}`,
      val,
      isP2,
      startX: sourceRect.left + (sourceRect.width / 5) * idx + 10,
      startY: sourceRect.top + sourceRect.height / 2,
      endX: targetRect.left + targetRect.width / 2 - 10,
      endY: targetRect.top + targetRect.height / 2 - 10,
    }));

    setFlyingDice((prev) => [...prev, ...newFlyingItems]);
    setTimeout(() => {
      setFlyingDice((prev) => prev.map((item) => (newFlyingItems.some((f) => f.id === item.id) ? { ...item, animate: true } : item)));
    }, 30);
    setTimeout(() => {
      setFlyingDice((prev) => prev.filter((item) => !newFlyingItems.some((f) => f.id === item.id)));
      finalizeScore(catId, calcFn, isP2, diceValues);
    }, 650);
  };

  const handleSelectScore = (catId, calcFn) => {
    if (gameOver) return;
    if (turn === 'player') {
      if (playerScores[catId] !== undefined || rollsLeft === 3) return;
      triggerFlyAndScore(catId, calcFn, false, playerDice);
    } else if (gameMode === 'friend' && turn === 'opponent') {
      if (opponentScores[catId] !== undefined || p2RollsLeft === 3) return;
      triggerFlyAndScore(catId, calcFn, true, p2Dice);
    }
  };

  const startBotTurn = () => {
    setTurn('opponent');
    setP2RollsLeft(3);
    setP2Message('AI is rolling...');
    setIsP2Rolling(true);
    setP2Held([false, false, false, false, false]);

    let currentBotDice = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
    let heldMask = [false, false, false, false, false];
    let rollStep = 0;

    const runBotRoll = () => {
      if (rollStep >= 3) {
        setIsP2Rolling(false);
        setP2Message('AI choosing category...');
        setTimeout(() => {
          let chosenCategory = getBestBotCategory(currentBotDice, opponentScores);
          
          if (!chosenCategory || opponentScores[chosenCategory] !== undefined) {
            const allCategories = [
              'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
              'threeOfAKind', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yatzy', 'chance'
            ];
            chosenCategory = allCategories.find((cat) => opponentScores[cat] === undefined);
          }

          if (chosenCategory) {
            triggerFlyAndScore(chosenCategory, null, true, currentBotDice);
          } else {
            setGameOver(true);
            setTurn('player');
          }
        }, 700);
        return;
      }

      if (rollStep === 0) {
        currentBotDice = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
        heldMask = [false, false, false, false, false];
      } else {
        currentBotDice = currentBotDice.map((value, idx) => (heldMask[idx] ? value : Math.floor(Math.random() * 6) + 1));
      }

      if (rollStep < 2) {
        const nextHoldChoices = chooseBotHeldDice(currentBotDice);
        heldMask = heldMask.map((isHeld, idx) => isHeld || nextHoldChoices[idx]);
        setP2Held([...heldMask]);
        setP2Message(heldMask.some(Boolean) ? `AI holding ${heldMask.filter(Boolean).length} dice...` : 'AI re-rolling...');
      } else {
        setP2Held([...heldMask]);
        setP2Message('AI finalizing turn...');
      }

      setP2Dice(currentBotDice);
      setIsP2Rolling(true);
      setP2RollsLeft(Math.max(0, 3 - (rollStep + 1)));
      rollStep += 1;
      setTimeout(runBotRoll, 700);
    };

    setTimeout(runBotRoll, 500);
  };

  const continueGame = () => {
    setGameStarted(true);
  };

  const startGameWithMode = (mode) => {
    const pScores = JSON.parse(localStorage.getItem(STORAGE_KEYS.playerScores) || '{}');
    const aScores = JSON.parse(localStorage.getItem(STORAGE_KEYS.opponentScores) || '{}');
    const isOver = localStorage.getItem(STORAGE_KEYS.gameOver) === 'true';
    const totalFilled = Object.keys(pScores).length + Object.keys(aScores).length;
    const savedNow = totalFilled > 0 && !isOver;

    if (savedNow) {
      setPendingMode(mode);
      setShowConfirmModal(true);
      return;
    }

    executeNewGame(mode);
  };

  const executeNewGame = (mode) => {
    clearGameState();
    setGameMode(mode);
    setPlayerDice(emptyDice);
    setHeld(emptyHeld);
    setRollsLeft(3);
    setTurn('player');
    setPlayerScores({});
    setOpponentScores({});
    setGameOver(false);
    setResultRecorded(false);
    setBonusPlayed(false);
    localStorage.removeItem(STORAGE_KEYS.bonusPlayed);
    localStorage.removeItem(STORAGE_KEYS.resultRecorded);
    setP2Held(emptyHeld);
    setP2Dice(emptyDice);
    setP2RollsLeft(3);
    setP2Message('Waiting for turn...');
    setGameStarted(true);
    setShowConfirmModal(false);
  };

  const resetGame = () => {
    setGameStarted(false);
  };

  return (
    <div className="h-screen w-screen bg-emerald-950 flex items-center justify-center p-0 font-mono select-none overflow-hidden relative">
      {/* Hidden DOM Audio Elements for Bulletproof Autoplay Compatibility */}
      <audio id="sound-win" src="/win.wav" preload="auto" />
      <audio id="sound-lose" src="/lose.wav" preload="auto" />
      <audio id="sound-bonus" src="/bonus.wav" preload="auto" />
      <audio id="sound-yatzy" src="/yatzy.wav" preload="auto" />

      {showConfirmModal && (
        <ConfirmModal
          title="Game in Progress"
          message="You already have a game in progress. Do you want to continue it?"
          confirmText="Yes"
          cancelText="No"
          onConfirm={() => {
            setShowConfirmModal(false);
            setGameStarted(true);
          }}
          onCancel={() => {
            executeNewGame(pendingMode);
          }}
        />
      )}

      {flyingDice.map((item) => {
        const xCoord = item.animate ? item.endX : item.startX;
        const yCoord = item.animate ? item.endY : item.startY;
        return (
          <div
            key={item.id}
            className={`fixed z-50 pointer-events-none transition-all duration-600 ease-out flex items-center justify-center w-5 h-5 rounded-lg shadow-xl border ${
              item.isP2 ? 'bg-violet-400 border-violet-200 text-violet-950' : 'bg-amber-400 border-amber-200 text-emerald-950'
            }`}
            style={{
              left: `${xCoord}px`,
              top: `${yCoord}px`,
              transform: item.animate ? 'scale(0.5) rotate(360deg)' : 'scale(1) rotate(0deg)',
              opacity: item.animate ? 0.3 : 1,
            }}
          >
            <span className="text-[9px] font-black">{item.val}</span>
          </div>
        );
      })}

      {showStatsModal && <StatsModal stats={stats} onClose={() => setShowStatsModal(false)} />}
      <div className="w-full h-full sm:max-w-md sm:h-[90vh] sm:max-h-[720px] sm:rounded-3xl bg-gradient-to-b from-emerald-900 via-emerald-950 to-stone-950 border-0 sm:border-2 border-emerald-600/40 shadow-2xl flex flex-col justify-between overflow-hidden relative">
        <MenuScreen 
          showSplash={showSplash} 
          gameStarted={gameStarted} 
          hasSavedGame={hasSavedGame}
          continueGame={continueGame}
          startGameWithMode={startGameWithMode} 
          setShowStatsModal={setShowStatsModal} 
        />

        {gameStarted && !showSplash && (
          <GameBoard
            turn={turn}
            gameMode={gameMode}
            rollsLeft={rollsLeft}
            p2RollsLeft={p2RollsLeft}
            p2Message={p2Message}
            playerDice={playerDice}
            held={held}
            isRolling={isRolling}
            p2Dice={p2Dice}
            p2Held={p2Held}
            isP2Rolling={isP2Rolling}
            playerScores={playerScores}
            opponentScores={opponentScores}
            grandTotal={grandTotal}
            opponentTotal={opponentTotal}
            gameOver={gameOver}
            resetGame={resetGame}
            handleSelectScore={handleSelectScore}
            toggleHold={toggleHold}
            rollDice={rollDice}
            upperSubtotal={upperSubtotal}
            onOpenStats={() => setShowStatsModal(true)}
          />
        )}
      </div>
    </div>
  );
}