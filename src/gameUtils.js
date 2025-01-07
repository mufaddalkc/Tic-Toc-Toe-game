import { WINNING_COMBINATIONS } from "./winning-combinations";

// Initialize the board based on game turns
export const initializeBoard = (gameTurns) => {
  const board = Array(3)
    .fill(null)
    .map(() => Array(3).fill(null));

  gameTurns.forEach(({ cell, player }) => {
    board[cell.row][cell.col] = player;
  });

  return board;
};

// Determine the active player
export const deriveActivePlayer = (gameTurns) => {
  return gameTurns.length % 2 === 0 ? "X" : "O";
};

// Check for a winner or draw
export const checkGameOver = (board, gameTurns, playerMap) => {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (
      board[a.row][a.column] &&
      board[a.row][a.column] === board[b.row][b.column] &&
      board[a.row][a.column] === board[c.row][c.column]
    ) {
      return { isOver: true, winner: playerMap[board[a.row][a.column]] };
    }
  }

  if (gameTurns.length === 9) {
    return { isOver: true, winner: null };
  }

  return { isOver: false, winner: null };
};

// Minimax-based AI for smart moves
export const playComputerTurn = (board, aiSymbol, userSymbol) => {
  let bestScore = -Infinity;
  let move = { row: -1, col: -1 };

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) {
        board[row][col] = aiSymbol;
        const score = minimax(board, 0, false, aiSymbol, userSymbol);
        board[row][col] = null;

        if (score > bestScore) {
          bestScore = score;
          move = { row, col };
        }
      }
    }
  }

  return move;
};

// Minimax algorithm for AI decision-making
const minimax = (board, depth, isMaximizing, aiSymbol, userSymbol) => {
  const result = evaluateBoard(board, aiSymbol, userSymbol);
  if (result !== null) {
    return result;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === null) {
          board[row][col] = aiSymbol;
          const score = minimax(board, depth + 1, false, aiSymbol, userSymbol);
          board[row][col] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === null) {
          board[row][col] = userSymbol;
          const score = minimax(board, depth + 1, true, aiSymbol, userSymbol);
          board[row][col] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
};

const evaluateBoard = (board, aiSymbol, userSymbol) => {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (
      board[a.row][a.column] &&
      board[a.row][a.column] === board[b.row][b.column] &&
      board[a.row][a.column] === board[c.row][c.column]
    ) {
      return board[a.row][a.column] === aiSymbol ? 1 : -1;
    }
  }

  if (board.flat().every((cell) => cell !== null)) {
    return 0;
  }

  return null;
};
