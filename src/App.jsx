import { useState, useEffect } from "react";
import ModeSelector from "./components/ModeSelector";
import Players from "./components/Players";
import GameBoard from "./components/GameBoard";
import GameOver from "./components/GameOver";
import {
  deriveActivePlayer,
  initializeBoard,
  playComputerTurn,
  checkGameOver,
} from "./components/GameLogic";

const initialMode = null;
const initialBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function App() {
  const [mode, setMode] = useState(initialMode);
  const [player, setPlayer] = useState({
    X: "Player 1",
    O: "Player 2",
  });
  const [gameTurns, setGameTurns] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = initializeBoard(gameTurns);

  useEffect(() => {
    if (mode === "computer" && activePlayer === "O" && !isGameOver) {
      const { row, col } = playComputerTurn(
        gameBoard,
        "O",
        "X",
        player,
        gameTurns
      );
      handleSelectCell(row, col, true); // Handle computer move
    }
  }, [activePlayer, mode, isGameOver]);

  const handleSelectCell = (row, col, isComputer = false) => {
    if (isGameOver || gameBoard[row][col]) return;

    const updatedBoard = gameBoard.map((row) => row.slice());
    const currentPlayer = isComputer ? "O" : deriveActivePlayer(gameTurns);

    updatedBoard[row][col] = currentPlayer;

    setGameTurns((prevTurns) => {
      const updatedTurns = [
        ...prevTurns,
        { cell: { row, col }, player: currentPlayer },
      ];

      const gameStatus = checkGameOver(updatedBoard, updatedTurns, player);
      if (gameStatus.isOver) {
        setIsGameOver(true);
        setWinner(gameStatus.winner);
      }

      return updatedTurns;
    });
  };

  const handleRestart = () => {
    setGameTurns([]);
    setIsGameOver(false);
    setWinner(null);
  };

  const handleChangePlayerName = ({ symbol, newName }) => {
    setPlayer((prevPlayers) => ({
      ...prevPlayers,
      [symbol]: newName,
    }));
  };

  if (!mode) {
    return <ModeSelector onSelectMode={setMode} />;
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Players
            player={player}
            activePlayer={activePlayer}
            onChangePlayerName={handleChangePlayerName}
          />
        </ol>
        {(winner || gameTurns.length === 9) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        <GameBoard onSelectCell={handleSelectCell} board={gameBoard} />
      </div>
      <button
        className="mode-button"
        onClick={() => {
          setMode(null);
          setGameTurns([]); // Clear game state when changing mode
          setIsGameOver(false);
          setWinner(null);
          window.scrollTo(0, 0);
        }}
      >
        Change Mode
      </button>
    </main>
  );
}

export default App;
