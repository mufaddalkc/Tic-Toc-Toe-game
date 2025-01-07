import React from "react";

export default function Players({ player, activePlayer, onChangePlayerName }) {
  return (
    <ol id="players" className="highlight-player">
      {Object.entries(player).map(([symbol, name]) => (
        <li key={symbol} className={activePlayer === symbol ? "active" : ""}>
          <span className="player">
            {name}
            <span className="player-symbol">{symbol}</span>
          </span>
          <button
            onClick={() =>
              onChangePlayerName(
                symbol,
                prompt(`Enter a new name for ${name}:`, name)
              )
            }
          >
            Edit
          </button>
        </li>
      ))}
    </ol>
  );
}
