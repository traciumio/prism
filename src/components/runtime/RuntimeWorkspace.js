import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { mockEvents, mockCodeLines, DEFAULT_CODE } from "../../types/prism.js";
import { Sidebar } from "../layout/Sidebar.js";
import { CodeViewer } from "./CodeViewer.js";
import { PlaybackControls } from "./PlaybackControls.js";
import { StackPanel } from "./StackPanel.js";
import { HeapPanel } from "./HeapPanel.js";
import { StepDetail } from "./StepDetail.js";
export function RuntimeWorkspace({ session, playback, playbackActions, lens, onRun }) {
    const isLive = session.status === "ready";
    const events = isLive ? session.events : mockEvents;
    const codeLines = isLive ? session.codeLines : mockCodeLines;
    const currentStep = events[playback.currentIndex] ?? events[0];
    return (_jsxs("section", { className: "workspace", children: [_jsx(Sidebar, { mode: "runtime", events: events, selectedIndex: playback.currentIndex, onSelect: playbackActions.goTo, isLive: isLive, sessionId: session.sessionId, onRun: () => onRun(DEFAULT_CODE), isLoading: session.status === "loading" }), _jsxs("section", { className: "content", children: [_jsxs("div", { className: "content-head", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Now Viewing" }), _jsxs("h2", { children: ["Step ", currentStep.step, " at ", currentStep.line] })] }), _jsxs("div", { className: "content-pills", children: [_jsx("span", { children: "UEF session" }), _jsx("span", { children: lens === "debug" ? "Technical lens" : "Guided lens" })] })] }), _jsx(PlaybackControls, { ...playback, ...playbackActions, totalSteps: events.length }), _jsxs("article", { className: "primary-panel primary-panel-dark", children: [_jsxs("div", { className: "panel-head", children: [_jsxs("div", { children: [_jsx("p", { className: "panel-eyebrow", children: "Trace timeline" }), _jsx("h3", { children: currentStep.event })] }), _jsx("span", { className: "panel-pill", children: currentStep.delta })] }), _jsx("p", { className: "panel-body", children: currentStep.summary }), _jsx(CodeViewer, { codeLines: codeLines, activeLine: currentStep.line, isLive: isLive })] }), _jsxs("div", { className: "support-grid", children: [_jsxs("article", { className: "support-panel", children: [_jsxs("div", { className: "panel-head", children: [_jsxs("div", { children: [_jsx("p", { className: "panel-eyebrow", children: "Memory view" }), _jsx("h3", { children: "Frames and heap" })] }), _jsx("span", { className: "panel-pill panel-pill-soft", children: "Stable references" })] }), _jsxs("div", { className: "memory-grid", children: [_jsx(StackPanel, { stack: currentStep.stack }), _jsx(HeapPanel, { heap: currentStep.heap })] })] }), _jsx(StepDetail, { step: currentStep, lens: lens })] })] })] }));
}
