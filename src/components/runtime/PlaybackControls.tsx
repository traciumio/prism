import type { PlaybackState, PlaybackActions } from "../../hooks/use-playback.js";

type Props = PlaybackState & PlaybackActions & {
  totalSteps: number;
};

const speeds = [
  { label: "0.5x", ms: 2000 },
  { label: "1x", ms: 1000 },
  { label: "2x", ms: 500 },
];

export function PlaybackControls({
  currentIndex, isPlaying, speed, totalSteps,
  goTo, next, prev, play, pause, setSpeed,
}: Props) {
  return (
    <div className="playback-controls">
      <div className="playback-buttons">
        <button type="button" className="playback-btn" onClick={prev} disabled={currentIndex <= 0}>
          &#9664;&#9664;
        </button>
        {isPlaying ? (
          <button type="button" className="playback-btn playback-btn-primary" onClick={pause}>
            &#9646;&#9646;
          </button>
        ) : (
          <button type="button" className="playback-btn playback-btn-primary" onClick={play} disabled={totalSteps === 0}>
            &#9654;
          </button>
        )}
        <button type="button" className="playback-btn" onClick={next} disabled={currentIndex >= totalSteps - 1}>
          &#9654;&#9654;
        </button>
      </div>

      <input
        type="range"
        className="playback-slider"
        min={0}
        max={Math.max(0, totalSteps - 1)}
        value={currentIndex}
        onChange={(e) => goTo(Number(e.target.value))}
      />

      <div className="playback-info">
        <span className="playback-step">Step {currentIndex + 1} of {totalSteps}</span>
        <div className="playback-speed">
          {speeds.map((s) => (
            <button key={s.label} type="button"
              className={speed === s.ms ? "speed-btn active" : "speed-btn"}
              onClick={() => setSpeed(s.ms)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
