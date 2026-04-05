import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { DEFAULT_CODE } from "../../types/prism.js";
import { Sidebar } from "../layout/Sidebar.js";
import { CodeViewer } from "./CodeViewer.js";
import { PlaybackControls } from "./PlaybackControls.js";
import { StackPanel } from "./StackPanel.js";
import { HeapPanel } from "./HeapPanel.js";
import { StepDetail } from "./StepDetail.js";
export function RuntimeWorkspace({ session, playback, playbackActions, lens, onRun }) {
    const [code, setCode] = useState(DEFAULT_CODE);
    const isLive = session.status === "ready";
    const isLoading = session.status === "loading";
    const hasError = session.status === "error";
    function handleRun() {
        onRun(code);
    }
    // ── Editor mode: no trace yet, or error ──
    if (!isLive) {
        return (_jsxs("section", { className: "workspace", children: [_jsxs("aside", { className: "sidebar", children: [_jsxs("div", { className: "sidebar-head", children: [_jsx("p", { className: "eyebrow", children: "Workspace" }), _jsx("h2", { children: "Code Editor" }), _jsx("p", { children: "Write Java code below, then click Run to capture an execution trace." })] }), _jsx("div", { style: { padding: "0 22px 8px" }, children: _jsx("button", { type: "button", className: "editor-action-btn", style: { width: "100%" }, onClick: handleRun, disabled: isLoading || !code.trim(), children: isLoading ? "Executing via JDI..." : "Run Code" }) }), hasError && (_jsx("div", { style: { padding: "0 22px" }, children: _jsx("p", { style: { fontSize: "0.82rem", color: "#d63031", lineHeight: 1.5 }, children: session.error }) }))] }), _jsxs("section", { className: "content", children: [_jsxs("div", { className: "content-head", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: isLoading ? "Executing" : "Code Input" }), _jsx("h2", { children: isLoading ? "Running your code..." : "Write your Java code" })] }), _jsxs("div", { className: "content-pills", children: [_jsx("span", { children: "Java" }), _jsx("span", { children: lens === "debug" ? "Technical lens" : "Guided lens" })] })] }), isLoading ? (_jsxs("article", { className: "primary-panel", style: { textAlign: "center", padding: "64px 22px" }, children: [_jsx("p", { className: "panel-eyebrow", children: "Tracium Engine" }), _jsx("h3", { children: "Compiling and capturing execution trace..." }), _jsx("p", { className: "panel-body", children: "Your code is being compiled, executed via JDI adapter, and every step is recorded into a UEF trace." })] })) : (_jsx("article", { className: "primary-panel code-editor-panel", children: _jsx("textarea", { className: "code-editor-textarea", value: code, onChange: (e) => setCode(e.target.value), spellCheck: false, placeholder: "Write your Java code here...", rows: 18 }) }))] })] }));
    }
    // ── Trace mode: live trace loaded ──
    const events = session.events;
    const codeLines = session.codeLines;
    const currentStep = events[playback.currentIndex] ?? events[0];
    return (_jsxs("section", { className: "workspace", children: [_jsx(Sidebar, { mode: "runtime", events: events, selectedIndex: playback.currentIndex, onSelect: playbackActions.goTo, isLive: true, sessionId: session.sessionId, onRun: handleRun, isLoading: false }), _jsxs("section", { className: "content", children: [_jsxs("div", { className: "content-head", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Now Viewing" }), _jsxs("h2", { children: ["Step ", currentStep.step, " at ", currentStep.line] })] }), _jsxs("div", { className: "content-pills", children: [_jsx("span", { children: "UEF session" }), _jsx("span", { children: lens === "debug" ? "Technical lens" : "Guided lens" })] })] }), _jsx(PlaybackControls, { ...playback, ...playbackActions, totalSteps: events.length }), _jsxs("article", { className: "primary-panel primary-panel-dark", children: [_jsxs("div", { className: "panel-head", children: [_jsxs("div", { children: [_jsx("p", { className: "panel-eyebrow", children: "Trace timeline" }), _jsx("h3", { children: currentStep.event })] }), _jsx("span", { className: "panel-pill", children: currentStep.delta })] }), _jsx("p", { className: "panel-body", children: currentStep.summary }), _jsx(CodeViewer, { codeLines: codeLines, activeLine: currentStep.line, isLive: true })] }), _jsxs("div", { className: "support-grid", children: [_jsxs("article", { className: "support-panel", children: [_jsxs("div", { className: "panel-head", children: [_jsxs("div", { children: [_jsx("p", { className: "panel-eyebrow", children: "Memory view" }), _jsx("h3", { children: "Frames and heap" })] }), _jsx("span", { className: "panel-pill panel-pill-soft", children: "Stable references" })] }), _jsxs("div", { className: "memory-grid", children: [_jsx(StackPanel, { stack: currentStep.stack }), _jsx(HeapPanel, { heap: currentStep.heap })] })] }), _jsx(StepDetail, { step: currentStep, lens: lens })] })] })] }));
}
