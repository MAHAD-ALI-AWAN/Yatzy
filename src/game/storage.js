export const STORAGE_KEYS = {
  gameStarted: 'yatzy_gameStarted',
  gameMode: 'yatzy_gameMode',
  playerDice: 'yatzy_playerDice',
  held: 'yatzy_held',
  rollsLeft: 'yatzy_rollsLeft',
  turn: 'yatzy_turn',
  playerScores: 'yatzy_playerScores',
  opponentScores: 'yatzy_opponentScores',
  gameOver: 'yatzy_gameOver',
  stats: 'yatzy_stats',
  p2Dice: 'yatzy_p2Dice',
  p2Held: 'yatzy_p2Held',
  p2RollsLeft: 'yatzy_p2RollsLeft',
  resultRecorded: 'yatzy_resultRecorded',
};

export const clearGameState = () => {
  [
    STORAGE_KEYS.gameStarted,
    STORAGE_KEYS.gameMode,
    STORAGE_KEYS.playerDice,
    STORAGE_KEYS.held,
    STORAGE_KEYS.rollsLeft,
    STORAGE_KEYS.turn,
    STORAGE_KEYS.playerScores,
    STORAGE_KEYS.opponentScores,
    STORAGE_KEYS.gameOver,
    STORAGE_KEYS.p2Dice,
    STORAGE_KEYS.p2Held,
    STORAGE_KEYS.p2RollsLeft,
    STORAGE_KEYS.resultRecorded,
  ].forEach((key) => localStorage.removeItem(key));
};
