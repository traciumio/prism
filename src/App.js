import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { platformCards } from "./types/prism.js";
import { useRuntimeSession } from "./hooks/use-runtime-session.js";
import { usePlayback } from "./hooks/use-playback.js";
import { Topbar } from "./components/layout/Topbar.js";
import { RuntimeWorkspace } from "./components/runtime/RuntimeWorkspace.js";
import { ArchitectureWorkspace } from "./components/architecture/ArchitectureWorkspace.js";
export function App() {
    const [surface, setSurface] = useState("runtime");
    const [lens, setLens] = useState("debug");
    const { session, run } = useRuntimeSession();
    const isLive = session.status === "ready";
    const eventCount = isLive ? session.events.length : 5; // 5 mock events
    const { playback, ...playbackActions } = usePlayback(eventCount);
    return (_jsxs("main", { className: "prism-shell", children: [_jsx("div", { className: "ambient ambient-left" }), _jsx("div", { className: "ambient ambient-right" }), _jsx(Topbar, { surface: surface, lens: lens, onSurfaceChange: setSurface, onLensChange: setLens }), surface === "runtime" ? (_jsx(RuntimeWorkspace, { session: session, playback: playback, playbackActions: playbackActions, lens: lens, onRun: run })) : (_jsx(ArchitectureWorkspace, { lens: lens })), _jsx("section", { className: "platform-strip", children: platformCards.map((card) => (_jsxs("article", { className: "platform-card", children: [_jsx("p", { className: "panel-eyebrow", children: card.title }), _jsx("p", { children: card.body })] }, card.title))) })] }));
}
