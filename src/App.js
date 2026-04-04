import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const surfaces = [
    {
        id: "runtime",
        label: "Runtime Studio",
        caption: "UEF sessions from Tracium Engine",
    },
    {
        id: "architecture",
        label: "Architecture Lens",
        caption: "UGF topology from Atlas",
    },
];
const lenses = [
    {
        id: "debug",
        label: "Debug Truth",
        caption: "Expose precise frames, refs, and transitions",
    },
    {
        id: "learn",
        label: "Learning Lens",
        caption: "Keep the same signal, but explain it more gently",
    },
];
const runtimeEvents = [
    {
        id: "evt-01",
        step: 38,
        line: "Main.java:4",
        event: "FRAME_CREATED",
        delta: "main -> frame#1",
        summary: "The runtime opens a frame for main and anchors local scope.",
        stack: ["main(args) -> frame#1", "locals: arr, i, j"],
        heap: ["ref#01 int[3] = [3, 1, 2]"],
    },
    {
        id: "evt-02",
        step: 39,
        line: "Main.java:6",
        event: "CONDITION_EVALUATED",
        delta: "arr[j] > arr[j + 1] == true",
        summary: "The branch resolves true, so Prism keeps focus on the swap path.",
        stack: ["main(frame#1)", "i = 0", "j = 0"],
        heap: ["ref#01 int[3] = [3, 1, 2]"],
    },
    {
        id: "evt-03",
        step: 40,
        line: "Main.java:7",
        event: "VARIABLE_ASSIGNED",
        delta: "tmp = 3",
        summary: "A temporary variable captures the left value before mutation.",
        stack: ["main(frame#1)", "tmp = 3", "j = 0"],
        heap: ["ref#01 int[3] = [3, 1, 2]"],
    },
    {
        id: "evt-04",
        step: 41,
        line: "Main.java:8",
        event: "ARRAY_WRITE",
        delta: "arr[0] = 1",
        summary: "Heap state changes in place, and the reference identity stays stable.",
        stack: ["main(frame#1)", "tmp = 3", "j = 0"],
        heap: ["ref#01 int[3] = [1, 1, 2]"],
    },
    {
        id: "evt-05",
        step: 42,
        line: "Main.java:9",
        event: "ARRAY_WRITE",
        delta: "arr[1] = 3",
        summary: "The swap completes and the tracked heap object settles to the new order.",
        stack: ["main(frame#1)", "tmp = 3", "j = 0"],
        heap: ["ref#01 int[3] = [1, 3, 2]"],
    },
];
const graphNodes = [
    {
        id: "prism-ui",
        label: "Prism UI",
        kind: "product surface",
        owner: "frontend-platform",
        summary: "Hosts runtime and architecture workspaces while staying contract-driven.",
        stress: "High user traffic",
        contracts: ["GET /sessions/runtime/:id", "GET /graphs/:id"],
        x: 14,
        y: 18,
    },
    {
        id: "nerva",
        label: "Nerva API",
        kind: "control plane",
        owner: "platform-core",
        summary: "Brokers sessions, auth, and client-facing orchestration.",
        stress: "Central routing boundary",
        contracts: ["POST /sessions/runtime", "POST /analysis/repos"],
        x: 42,
        y: 16,
    },
    {
        id: "engine",
        label: "Tracium Engine",
        kind: "runtime service",
        owner: "runtime-intelligence",
        summary: "Produces UEF timelines from execution adapters and state normalization.",
        stress: "Trace-heavy workloads",
        contracts: ["UEF trace stream", "Runtime session state"],
        x: 73,
        y: 28,
    },
    {
        id: "atlas",
        label: "Atlas",
        kind: "analysis service",
        owner: "graph-intelligence",
        summary: "Builds UGF topology from repo parsing, symbol extraction, and graph synthesis.",
        stress: "Repository graph computation",
        contracts: ["UGF snapshot", "Dependency diagnostics"],
        x: 69,
        y: 66,
    },
    {
        id: "quanta",
        label: "Quanta",
        kind: "spec source",
        owner: "shared-contracts",
        summary: "Defines UEF, UGF, diagnostics, and source-anchor contracts for every surface.",
        stress: "Versioned compatibility",
        contracts: ["UEF v1", "UGF v1", "Diagnostics schema"],
        x: 36,
        y: 72,
    },
    {
        id: "pulse",
        label: "Pulse",
        kind: "IDE plugin",
        owner: "developer-workflows",
        summary: "Launches analysis from editors and links source anchors back into Prism.",
        stress: "Context-switch reduction",
        contracts: ["Open session in Prism", "Source anchor deep links"],
        x: 12,
        y: 64,
    },
];
const graphEdges = [
    { from: "prism-ui", to: "nerva", label: "sessions" },
    { from: "nerva", to: "engine", label: "runtime jobs" },
    { from: "nerva", to: "atlas", label: "repo analysis" },
    { from: "engine", to: "quanta", label: "UEF" },
    { from: "atlas", to: "quanta", label: "UGF" },
    { from: "pulse", to: "prism-ui", label: "open insight" },
];
const integrationCards = [
    {
        name: "Tracium Engine",
        role: "Runtime truth",
        body: "Supplies execution timelines, heap identity, and frame-level transitions.",
    },
    {
        name: "Atlas",
        role: "Repo structure",
        body: "Supplies graph structure, ownership signals, and architectural coupling.",
    },
    {
        name: "Nerva",
        role: "Orchestration",
        body: "Keeps sessions, access, and integrations outside the UI layer.",
    },
    {
        name: "Quanta",
        role: "Shared contracts",
        body: "Lets Prism evolve without inventing its own private payload shapes.",
    },
];
const runtimeCode = [
    "1  class Main {",
    "2    public static void main(String[] args) {",
    "3      int[] arr = {3, 1, 2};",
    "4      for (int i = 0; i < arr.length; i++) {",
    "5        for (int j = 0; j < arr.length - 1; j++) {",
    "6          if (arr[j] > arr[j + 1]) {",
    "7            int tmp = arr[j];",
    "8            arr[j] = arr[j + 1];",
    "9            arr[j + 1] = tmp;",
    "10         }",
    "11       }",
    "12     }",
    "13   }",
    "14 }",
];
function getNode(nodeId) {
    return graphNodes.find((node) => node.id === nodeId);
}
export function App() {
    const [surface, setSurface] = useState("runtime");
    const [lens, setLens] = useState("debug");
    const [selectedRuntimeId, setSelectedRuntimeId] = useState(runtimeEvents[2].id);
    const [selectedGraphNodeId, setSelectedGraphNodeId] = useState("nerva");
    const selectedRuntime = runtimeEvents.find((event) => event.id === selectedRuntimeId) ?? runtimeEvents[0];
    const selectedGraphNode = graphNodes.find((node) => node.id === selectedGraphNodeId) ?? graphNodes[0];
    const lensCopy = lens === "debug"
        ? {
            workspace: "Expose exact state transitions and memory truth.",
            summary: "Precise runtime and topology inspection",
            inspectorTitle: "Technical inspection",
            inspectorBody: "Keep line anchors, event names, and contract boundaries visible for debugging-grade review.",
        }
        : {
            workspace: "Simplify the signal without changing the underlying trace.",
            summary: "Guided explanation for learning and walkthroughs",
            inspectorTitle: "Guided explanation",
            inspectorBody: "Keep the same source of truth, but soften the presentation so complex flows are easier to understand.",
        };
    const runtimeSummary = lens === "debug"
        ? selectedRuntime.summary
        : "Prism explains the active step in plain language while staying attached to the same trace.";
    const graphSummary = lens === "debug"
        ? selectedGraphNode.summary
        : "Prism turns structural boundaries into a friendlier system map without hiding ownership or dependencies.";
    return (_jsxs("main", { className: "prism-shell", children: [_jsx("div", { className: "prism-ambient prism-ambient-left" }), _jsx("div", { className: "prism-ambient prism-ambient-right" }), _jsxs("section", { className: "hero-card", children: [_jsxs("div", { className: "hero-copy", children: [_jsx("p", { className: "eyebrow", children: "Prism" }), _jsx("h1", { children: "One visual workspace for runtime truth and repo structure." }), _jsx("p", { className: "hero-body", children: "Prism is the product surface for Tracium. It keeps runtime and architecture as distinct intelligence tracks, then lets people move between them without collapsing the ecosystem into one oversized app." }), _jsxs("div", { className: "hero-badges", children: [_jsx("span", { children: "UEF playback" }), _jsx("span", { children: "UGF topology" }), _jsx("span", { children: lensCopy.summary })] })] }), _jsxs("div", { className: "hero-metrics", children: [_jsxs("article", { children: [_jsx("p", { children: "Runtime sessions" }), _jsx("strong", { children: "1,284" }), _jsx("span", { children: "recent traces processed" })] }), _jsxs("article", { children: [_jsx("p", { children: "Repo snapshots" }), _jsx("strong", { children: "317" }), _jsx("span", { children: "graph states cached" })] }), _jsxs("article", { children: [_jsx("p", { children: "Current lens" }), _jsx("strong", { children: lens === "debug" ? "Debug Truth" : "Learning Lens" }), _jsx("span", { children: lensCopy.workspace })] })] })] }), _jsxs("section", { className: "control-deck", children: [_jsxs("div", { className: "control-group", children: [_jsx("p", { className: "control-label", children: "Surface" }), _jsx("div", { className: "segmented-control", children: surfaces.map((item) => (_jsxs("button", { type: "button", className: surface === item.id ? "segment active" : "segment", onClick: () => setSurface(item.id), children: [_jsx("strong", { children: item.label }), _jsx("span", { children: item.caption })] }, item.id))) })] }), _jsxs("div", { className: "control-group", children: [_jsx("p", { className: "control-label", children: "Lens" }), _jsx("div", { className: "segmented-control segmented-control-compact", children: lenses.map((item) => (_jsxs("button", { type: "button", className: lens === item.id ? "segment active" : "segment", onClick: () => setLens(item.id), children: [_jsx("strong", { children: item.label }), _jsx("span", { children: item.caption })] }, item.id))) })] })] }), _jsxs("section", { className: "workspace-shell", children: [_jsxs("aside", { className: "workspace-rail", children: [_jsxs("div", { className: "rail-header", children: [_jsx("p", { className: "eyebrow", children: "Workspace" }), _jsx("h2", { children: surface === "runtime" ? "Active runtime session" : "Active repo map" }), _jsx("p", { children: lensCopy.workspace })] }), surface === "runtime" ? (_jsx("div", { className: "selection-list", children: runtimeEvents.map((event) => (_jsxs("button", { type: "button", className: selectedRuntimeId === event.id
                                        ? "selection-card selection-card-active"
                                        : "selection-card", onClick: () => setSelectedRuntimeId(event.id), children: [_jsx("span", { className: "selection-index", children: event.step }), _jsxs("div", { children: [_jsx("strong", { children: event.event }), _jsx("p", { children: event.line })] })] }, event.id))) })) : (_jsx("div", { className: "selection-list", children: graphNodes.map((node) => (_jsxs("button", { type: "button", className: selectedGraphNodeId === node.id
                                        ? "selection-card selection-card-active"
                                        : "selection-card", onClick: () => setSelectedGraphNodeId(node.id), children: [_jsx("span", { className: "selection-index selection-index-soft", children: node.label
                                                .split(" ")
                                                .map((part) => part[0])
                                                .join("")
                                                .slice(0, 2) }), _jsxs("div", { children: [_jsx("strong", { children: node.label }), _jsx("p", { children: node.kind })] })] }, node.id))) }))] }), _jsxs("div", { className: "workspace-main", children: [_jsxs("div", { className: "stage-banner", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Now viewing" }), _jsx("h2", { children: surface === "runtime"
                                                    ? `Step ${selectedRuntime.step} at ${selectedRuntime.line}`
                                                    : selectedGraphNode.label })] }), _jsxs("div", { className: "stage-pills", children: [_jsx("span", { children: surface === "runtime" ? "UEF session" : "UGF graph" }), _jsx("span", { children: lens === "debug" ? "Technical lens" : "Guided lens" })] })] }), surface === "runtime" ? (_jsxs("div", { className: "studio-grid", children: [_jsxs("article", { className: "studio-panel studio-panel-dark", children: [_jsxs("div", { className: "panel-head", children: [_jsxs("div", { children: [_jsx("p", { className: "panel-eyebrow", children: "Trace timeline" }), _jsx("h3", { children: selectedRuntime.event })] }), _jsxs("span", { className: "panel-chip", children: ["Delta: ", selectedRuntime.delta] })] }), _jsx("p", { className: "panel-description", children: runtimeSummary }), _jsxs("div", { className: "code-surface", children: [_jsxs("div", { className: "code-header", children: [_jsx("span", { children: "Main.java" }), _jsx("span", { children: "Line synced to selected step" })] }), _jsx("div", { className: "code-lines", children: runtimeCode.map((line) => {
                                                            const isActive = line.startsWith(selectedRuntime.line.split(":")[1]);
                                                            return (_jsx("div", { className: isActive ? "code-line code-line-active" : "code-line", children: line }, line));
                                                        }) })] })] }), _jsxs("article", { className: "studio-panel", children: [_jsxs("div", { className: "panel-head", children: [_jsxs("div", { children: [_jsx("p", { className: "panel-eyebrow", children: "Memory view" }), _jsx("h3", { children: "Frames and heap" })] }), _jsx("span", { className: "panel-chip panel-chip-soft", children: "Truth-first model" })] }), _jsxs("div", { className: "memory-grid", children: [_jsxs("div", { className: "memory-card", children: [_jsx("p", { className: "memory-title", children: "Stack" }), selectedRuntime.stack.map((item) => (_jsx("span", { className: "memory-item", children: item }, item)))] }), _jsxs("div", { className: "memory-card", children: [_jsx("p", { className: "memory-title", children: "Heap" }), selectedRuntime.heap.map((item) => (_jsx("span", { className: "memory-item", children: item }, item)))] })] }), _jsx("div", { className: "memory-note", children: lens === "debug"
                                                    ? "References stay stable even as heap values mutate, which keeps debugging honest."
                                                    : "Prism can explain stack vs heap gently without inventing a second fake model." })] })] })) : (_jsxs("div", { className: "studio-grid", children: [_jsxs("article", { className: "studio-panel studio-panel-dark", children: [_jsxs("div", { className: "panel-head", children: [_jsxs("div", { children: [_jsx("p", { className: "panel-eyebrow", children: "Topology canvas" }), _jsx("h3", { children: "System relationships" })] }), _jsxs("span", { className: "panel-chip", children: ["Selected: ", selectedGraphNode.label] })] }), _jsx("p", { className: "panel-description", children: graphSummary }), _jsxs("div", { className: "graph-surface", children: [_jsx("svg", { className: "graph-svg", viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true", children: graphEdges.map((edge) => {
                                                            const from = getNode(edge.from);
                                                            const to = getNode(edge.to);
                                                            if (!from || !to) {
                                                                return null;
                                                            }
                                                            return (_jsx("line", { x1: from.x, y1: from.y, x2: to.x, y2: to.y, className: "graph-edge" }, `${edge.from}-${edge.to}`));
                                                        }) }), graphNodes.map((node) => (_jsxs("button", { type: "button", className: selectedGraphNodeId === node.id
                                                            ? "graph-node graph-node-active"
                                                            : "graph-node", style: { left: `${node.x}%`, top: `${node.y}%` }, onClick: () => setSelectedGraphNodeId(node.id), children: [_jsx("span", { children: node.label }), _jsx("small", { children: node.kind })] }, node.id)))] })] }), _jsxs("article", { className: "studio-panel", children: [_jsxs("div", { className: "panel-head", children: [_jsxs("div", { children: [_jsx("p", { className: "panel-eyebrow", children: "Dependency ledger" }), _jsx("h3", { children: "Contract movement" })] }), _jsx("span", { className: "panel-chip panel-chip-soft", children: "Source of truth: UGF" })] }), _jsx("div", { className: "ledger-list", children: graphEdges.map((edge) => (_jsxs("div", { className: "ledger-row", children: [_jsxs("strong", { children: [getNode(edge.from)?.label, " ", "->", " ", getNode(edge.to)?.label] }), _jsx("span", { children: edge.label })] }, `${edge.from}-${edge.to}-ledger`))) }), _jsx("div", { className: "memory-note", children: lens === "debug"
                                                    ? "Prism should make system coupling visible without flattening service boundaries."
                                                    : "The same graph can be presented as a guided story for onboarding and learning." })] })] }))] }), _jsxs("aside", { className: "workspace-inspector", children: [_jsxs("div", { className: "inspector-card", children: [_jsx("p", { className: "eyebrow", children: lensCopy.inspectorTitle }), _jsx("h3", { children: surface === "runtime" ? selectedRuntime.event : selectedGraphNode.label }), _jsx("p", { children: surface === "runtime" ? runtimeSummary : graphSummary })] }), _jsxs("div", { className: "inspector-card", children: [_jsx("p", { className: "inspector-label", children: surface === "runtime" ? "Source anchor" : "Ownership" }), _jsx("strong", { children: surface === "runtime" ? selectedRuntime.line : selectedGraphNode.owner }), _jsx("p", { children: lensCopy.inspectorBody })] }), _jsxs("div", { className: "inspector-card", children: [_jsx("p", { className: "inspector-label", children: surface === "runtime" ? "Observed state" : "Contracts" }), _jsx("div", { className: "inspector-list", children: (surface === "runtime"
                                            ? [selectedRuntime.delta, ...selectedRuntime.heap]
                                            : selectedGraphNode.contracts).map((item) => (_jsx("span", { children: item }, item))) })] }), surface === "architecture" && (_jsxs("div", { className: "inspector-card", children: [_jsx("p", { className: "inspector-label", children: "System pressure" }), _jsx("strong", { children: selectedGraphNode.stress }), _jsx("p", { children: "Keep architectural hotspots visible so the graph becomes an operational tool, not just a static diagram." })] }))] })] }), _jsx("section", { className: "integration-strip", children: integrationCards.map((card) => (_jsxs("article", { className: "integration-card", children: [_jsx("p", { className: "integration-role", children: card.role }), _jsx("h3", { children: card.name }), _jsx("p", { children: card.body })] }, card.name))) })] }));
}
