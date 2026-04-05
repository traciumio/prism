import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const speeds = [
    { label: "0.5x", ms: 2000 },
    { label: "1x", ms: 1000 },
    { label: "2x", ms: 500 },
];
export function PlaybackControls({ currentIndex, isPlaying, speed, totalSteps, goTo, next, prev, play, pause, setSpeed, }) {
    return (_jsxs("div", { className: "playback-controls", children: [_jsxs("div", { className: "playback-buttons", children: [_jsx("button", { type: "button", className: "playback-btn", onClick: prev, disabled: currentIndex <= 0, children: "\u25C0\u25C0" }), isPlaying ? (_jsx("button", { type: "button", className: "playback-btn playback-btn-primary", onClick: pause, children: "\u25AE\u25AE" })) : (_jsx("button", { type: "button", className: "playback-btn playback-btn-primary", onClick: play, disabled: totalSteps === 0, children: "\u25B6" })), _jsx("button", { type: "button", className: "playback-btn", onClick: next, disabled: currentIndex >= totalSteps - 1, children: "\u25B6\u25B6" })] }), _jsx("input", { type: "range", className: "playback-slider", min: 0, max: Math.max(0, totalSteps - 1), value: currentIndex, onChange: (e) => goTo(Number(e.target.value)) }), _jsxs("div", { className: "playback-info", children: [_jsxs("span", { className: "playback-step", children: ["Step ", currentIndex + 1, " of ", totalSteps] }), _jsx("div", { className: "playback-speed", children: speeds.map((s) => (_jsx("button", { type: "button", className: speed === s.ms ? "speed-btn active" : "speed-btn", onClick: () => setSpeed(s.ms), children: s.label }, s.label))) })] })] }));
}
