export default function ModeSelector({ onSelectMode }) {
  return (
    <div class="mode-selector">
      <h2>Select Game Mode</h2>
      <button onClick={() => onSelectMode("player")} className="mode-button">
        2 Players
      </button>
      <button onClick={() => onSelectMode("computer")} className="mode-button">
        Play with Computer
      </button>
    </div>
  );
}
