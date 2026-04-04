import { useState } from "react";
import { useRuntimeSession, type RuntimeEvent } from "./hooks/use-runtime-session.js";

type Surface = "runtime" | "architecture";
type Lens = "debug" | "learn";

type GraphNode = {
  id: string;
  label: string;
  kind: string;
  owner: string;
  summary: string;
  stress: string;
  contracts: string[];
  x: number;
  y: number;
};

type GraphEdge = { from: string; to: string; label: string };

const surfaces = [
  { id: "runtime" as const, label: "Runtime Studio", caption: "UEF sessions from Tracium Engine" },
  { id: "architecture" as const, label: "Architecture Lens", caption: "UGF topology from Atlas" },
];

const lenses = [
  { id: "debug" as const, label: "Debug Truth", caption: "Expose precise frames, refs, and transitions" },
  { id: "learn" as const, label: "Learning Lens", caption: "Keep the same signal, but explain it more gently" },
];

const graphNodes: GraphNode[] = [
  { id: "prism-ui", label: "Prism UI", kind: "product surface", owner: "frontend-platform", summary: "Hosts runtime and architecture workspaces while staying contract-driven.", stress: "High user traffic", contracts: ["GET /sessions/runtime/:id", "GET /graphs/:id"], x: 16, y: 20 },
  { id: "nerva", label: "Nerva API", kind: "control plane", owner: "platform-core", summary: "Brokers sessions, auth, and client-facing orchestration.", stress: "Central routing boundary", contracts: ["POST /sessions/runtime", "POST /analysis/repos"], x: 41, y: 16 },
  { id: "engine", label: "Tracium Engine", kind: "runtime service", owner: "runtime-intelligence", summary: "Produces UEF timelines from execution adapters and state normalization.", stress: "Trace-heavy workloads", contracts: ["UEF trace stream", "Runtime session state"], x: 73, y: 28 },
  { id: "atlas", label: "Atlas", kind: "analysis service", owner: "graph-intelligence", summary: "Builds UGF topology from repo parsing, symbol extraction, and graph synthesis.", stress: "Repository graph computation", contracts: ["UGF snapshot", "Dependency diagnostics"], x: 68, y: 66 },
  { id: "quanta", label: "Quanta", kind: "spec source", owner: "shared-contracts", summary: "Defines UEF, UGF, diagnostics, and source-anchor contracts for every surface.", stress: "Versioned compatibility", contracts: ["UEF v1", "UGF v1", "Diagnostics schema"], x: 36, y: 74 },
  { id: "pulse", label: "Pulse", kind: "IDE plugin", owner: "developer-workflows", summary: "Launches analysis from editors and links source anchors back into Prism.", stress: "Context-switch reduction", contracts: ["Open session in Prism", "Source anchor deep links"], x: 13, y: 66 },
];

const graphEdges: GraphEdge[] = [
  { from: "prism-ui", to: "nerva", label: "sessions" },
  { from: "nerva", to: "engine", label: "runtime jobs" },
  { from: "nerva", to: "atlas", label: "repo analysis" },
  { from: "engine", to: "quanta", label: "UEF" },
  { from: "atlas", to: "quanta", label: "UGF" },
  { from: "pulse", to: "prism-ui", label: "open insight" },
];

// Default mock events shown before any real trace is loaded
const mockEvents: RuntimeEvent[] = [
  { id: "evt-01", step: 38, line: "Main.java:4", event: "FRAME_CREATED", delta: "main -> frame#1", summary: "The runtime opens a frame for main and anchors local scope.", stack: ["main(args) -> frame#1", "locals: arr, i, j"], heap: ["ref#01 int[3] = [3, 1, 2]"] },
  { id: "evt-02", step: 39, line: "Main.java:6", event: "CONDITION_EVALUATED", delta: "arr[j] > arr[j + 1] == true", summary: "The branch resolves true, so Prism keeps focus on the swap path.", stack: ["main(frame#1)", "i = 0", "j = 0"], heap: ["ref#01 int[3] = [3, 1, 2]"] },
  { id: "evt-03", step: 40, line: "Main.java:7", event: "VARIABLE_ASSIGNED", delta: "tmp = 3", summary: "A temporary variable captures the left value before mutation.", stack: ["main(frame#1)", "tmp = 3", "j = 0"], heap: ["ref#01 int[3] = [3, 1, 2]"] },
  { id: "evt-04", step: 41, line: "Main.java:8", event: "ARRAY_WRITE", delta: "arr[0] = 1", summary: "Heap state changes in place, and the reference identity stays stable.", stack: ["main(frame#1)", "tmp = 3", "j = 0"], heap: ["ref#01 int[3] = [1, 1, 2]"] },
  { id: "evt-05", step: 42, line: "Main.java:9", event: "ARRAY_WRITE", delta: "arr[1] = 3", summary: "The swap completes and the tracked heap object settles to the new order.", stack: ["main(frame#1)", "tmp = 3", "j = 0"], heap: ["ref#01 int[3] = [1, 3, 2]"] },
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

const DEFAULT_CODE = `class Main {
  public static void main(String[] args) {
    int[] arr = {3, 1, 2};
    for (int i = 0; i < arr.length; i++) {
      for (int j = 0; j < arr.length - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          int tmp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = tmp;
        }
      }
    }
  }
}`;

const platformCards = [
  { title: "Runtime", body: "Tracium Engine supplies UEF traces. Prism only renders them." },
  { title: "Structure", body: "Atlas supplies UGF graphs so architecture stays distinct from execution." },
  { title: "Contracts", body: "Quanta keeps payload shapes stable while Prism focuses on interaction." },
];

function getNode(nodeId: string) {
  return graphNodes.find((n) => n.id === nodeId);
}

export function App() {
  const [surface, setSurface] = useState<Surface>("runtime");
  const [lens, setLens] = useState<Lens>("debug");
  const [selectedRuntimeId, setSelectedRuntimeId] = useState(mockEvents[2].id);
  const [selectedGraphNodeId, setSelectedGraphNodeId] = useState("nerva");

  const { session, run } = useRuntimeSession();

  // Use real data when a trace is ready, otherwise show mock
  const isLive = session.status === "ready";
  const runtimeEvents = isLive ? session.events : mockEvents;
  const activeCode = isLive ? session.codeLines : runtimeCode;

  // Auto-select first meaningful event when new trace arrives
  if (isLive && !runtimeEvents.find((e) => e.id === selectedRuntimeId)) {
    const first = runtimeEvents.find((e) => e.event === "VARIABLE_ASSIGNED") ?? runtimeEvents[0];
    if (first) setSelectedRuntimeId(first.id);
  }

  const selectedRuntime = runtimeEvents.find((e) => e.id === selectedRuntimeId) ?? runtimeEvents[0];
  const selectedGraphNode = graphNodes.find((n) => n.id === selectedGraphNodeId) ?? graphNodes[0];
  const relatedEdges = graphEdges.filter((e) => e.from === selectedGraphNode.id || e.to === selectedGraphNode.id);

  const lensCopy = lens === "debug"
    ? { headline: "Technical inspection", body: "Expose exact state transitions and memory truth.", modePill: "Precise runtime and topology inspection" }
    : { headline: "Guided explanation", body: "Use the same source of truth but present it with calmer, more teachable framing.", modePill: "Learning-first" };

  return (
    <main className="prism-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      {/* ── Topbar: exactly 2 children for the CSS grid ── */}
      <section className="topbar">
        <div className="topbar-copy">
          <p className="eyebrow">PRISM</p>
          <h1>One visual workspace for runtime truth and repo structure.</h1>
          <p>
            Prism is the product surface for Tracium. It keeps runtime and
            architecture as distinct intelligence tracks, then lets people move
            between them without collapsing the ecosystem into one oversized app.
          </p>
          <div className="topbar-pills">
            <span>UEF playback</span>
            <span>UGF topology</span>
            <span>{lensCopy.modePill}</span>
          </div>
        </div>

        <div className="topbar-controls">
          <div className="control-block">
            <p className="control-label">Surface</p>
            <div className="segmented">
              {surfaces.map((s) => (
                <button key={s.id} type="button"
                  className={surface === s.id ? "segment active" : "segment"}
                  onClick={() => setSurface(s.id)}>
                  <strong>{s.label}</strong>
                  <span>{s.caption}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="control-block">
            <p className="control-label">Lens</p>
            <div className="segmented compact">
              {lenses.map((l) => (
                <button key={l.id} type="button"
                  className={lens === l.id ? "segment active" : "segment"}
                  onClick={() => setLens(l.id)}>
                  <strong>{l.label}</strong>
                  <span>{l.caption}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Workspace: exactly sidebar + content for the CSS grid ── */}
      <section className="workspace">
        <aside className="sidebar">
          <div className="sidebar-head">
            <p className="eyebrow">Workspace</p>
            <h2>{surface === "runtime"
              ? isLive ? "Active runtime session" : "Runtime timeline"
              : "Architecture map"}</h2>
            <p>{lensCopy.body}</p>
          </div>

          {/* Run button inside sidebar-list area */}
          {surface === "runtime" && (
            <div style={{ padding: "0 22px 8px" }}>
              <button type="button" onClick={() => run(DEFAULT_CODE)}
                disabled={session.status === "loading"}
                style={{
                  width: "100%", padding: "10px 16px",
                  background: session.status === "loading" ? "#8a7060" : "#b55233",
                  color: "#fff", border: "none", borderRadius: 10,
                  fontWeight: 700, fontSize: "0.85rem", cursor: session.status === "loading" ? "wait" : "pointer",
                  fontFamily: "inherit",
                }}>
                {session.status === "loading" ? "Executing via JDI..." : isLive ? "Run Again" : "Run Code"}
              </button>
              {isLive && (
                <p style={{ fontSize: "0.72rem", color: "#506177", marginTop: 6, textAlign: "center" }}>
                  {session.events.length} steps captured &middot; {session.sessionId}
                </p>
              )}
            </div>
          )}

          <div className="sidebar-list">
            {surface === "runtime"
              ? runtimeEvents.map((event) => (
                  <button key={event.id} type="button"
                    className={selectedRuntimeId === event.id ? "sidebar-item active" : "sidebar-item"}
                    onClick={() => setSelectedRuntimeId(event.id)}>
                    <span className="sidebar-index">{event.step}</span>
                    <div>
                      <strong>{event.event}</strong>
                      <p>{event.line}</p>
                    </div>
                  </button>
                ))
              : graphNodes.map((node) => (
                  <button key={node.id} type="button"
                    className={selectedGraphNodeId === node.id ? "sidebar-item active" : "sidebar-item"}
                    onClick={() => setSelectedGraphNodeId(node.id)}>
                    <span className="sidebar-index glyph">
                      {node.label.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                    </span>
                    <div>
                      <strong>{node.label}</strong>
                      <p>{node.kind}</p>
                    </div>
                  </button>
                ))}
          </div>
        </aside>

        <section className="content">
          <div className="content-head">
            <div>
              <p className="eyebrow">Now Viewing</p>
              <h2>{surface === "runtime"
                ? `Step ${selectedRuntime.step} at ${selectedRuntime.line}`
                : selectedGraphNode.label}</h2>
            </div>
            <div className="content-pills">
              <span>{surface === "runtime" ? "UEF session" : "UGF graph"}</span>
              <span>{lens === "debug" ? "Technical lens" : "Guided lens"}</span>
            </div>
          </div>

          {surface === "runtime" ? (
            <>
              <article className="primary-panel primary-panel-dark">
                <div className="panel-head">
                  <div>
                    <p className="panel-eyebrow">Trace timeline</p>
                    <h3>{selectedRuntime.event}</h3>
                  </div>
                  <span className="panel-pill">{selectedRuntime.delta}</span>
                </div>
                <p className="panel-body">{selectedRuntime.summary}</p>

                <div className="code-frame">
                  <div className="code-head">
                    <span>Main.java</span>
                    <span>Line synced to selected step</span>
                  </div>
                  <div className="code-body">
                    {activeCode.map((line, idx) => {
                      const lineNum = idx + 1;
                      const isActive = isLive
                        ? selectedRuntime.line?.includes(`:${lineNum}`)
                        : line.startsWith(selectedRuntime.line.split(":")[1]);
                      return (
                        <div key={idx} className={isActive ? "code-line active" : "code-line"}>
                          {line}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>

              <div className="support-grid">
                <article className="support-panel">
                  <div className="panel-head">
                    <div>
                      <p className="panel-eyebrow">Memory view</p>
                      <h3>Frames and heap</h3>
                    </div>
                    <span className="panel-pill panel-pill-soft">Stable references</span>
                  </div>
                  <div className="memory-grid">
                    <div className="memory-column">
                      <p className="memory-label">Stack</p>
                      {selectedRuntime.stack.map((item, i) => (
                        <span key={i} className="memory-pill">{item}</span>
                      ))}
                    </div>
                    <div className="memory-column">
                      <p className="memory-label">Heap</p>
                      {selectedRuntime.heap.map((item, i) => (
                        <span key={i} className="memory-pill">{item}</span>
                      ))}
                    </div>
                  </div>
                </article>

                <article className="support-panel">
                  <p className="panel-eyebrow">{lensCopy.headline}</p>
                  <h3>{selectedRuntime.event}</h3>
                  <p className="panel-body">{lensCopy.body}</p>
                  <div className="detail-block">
                    <p className="detail-label">Source anchor</p>
                    <strong>{selectedRuntime.line}</strong>
                  </div>
                  <div className="detail-block">
                    <p className="detail-label">Observed state</p>
                    <div className="detail-pills">
                      {[selectedRuntime.delta, ...selectedRuntime.heap].map((item, i) => (
                        <span key={i}>{item}</span>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
            </>
          ) : (
            <>
              <article className="primary-panel primary-panel-dark">
                <div className="panel-head">
                  <div>
                    <p className="panel-eyebrow">Topology canvas</p>
                    <h3>{selectedGraphNode.label}</h3>
                  </div>
                  <span className="panel-pill">{selectedGraphNode.kind}</span>
                </div>
                <p className="panel-body">{selectedGraphNode.summary}</p>
                <div className="graph-frame">
                  <svg className="graph-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    {graphEdges.map((edge) => {
                      const from = getNode(edge.from); const to = getNode(edge.to);
                      if (!from || !to) return null;
                      return <line key={`${edge.from}-${edge.to}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="graph-edge" />;
                    })}
                  </svg>
                  {graphNodes.map((node) => (
                    <button key={node.id} type="button"
                      className={selectedGraphNodeId === node.id ? "graph-node active" : "graph-node"}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      onClick={() => setSelectedGraphNodeId(node.id)}>
                      <span>{node.label}</span><small>{node.kind}</small>
                    </button>
                  ))}
                </div>
              </article>

              <div className="support-grid">
                <article className="support-panel">
                  <div className="panel-head">
                    <div>
                      <p className="panel-eyebrow">Connected edges</p>
                      <h3>System relationships</h3>
                    </div>
                    <span className="panel-pill panel-pill-soft">{relatedEdges.length} links</span>
                  </div>
                  <div className="edge-list">
                    {relatedEdges.map((edge) => (
                      <div key={`${edge.from}-${edge.to}`} className="edge-row">
                        <strong>{getNode(edge.from)?.label} → {getNode(edge.to)?.label}</strong>
                        <span>{edge.label}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="support-panel">
                  <p className="panel-eyebrow">{lensCopy.headline}</p>
                  <h3>{selectedGraphNode.label}</h3>
                  <p className="panel-body">{lensCopy.body}</p>
                  <div className="detail-block">
                    <p className="detail-label">Owner</p>
                    <strong>{selectedGraphNode.owner}</strong>
                  </div>
                  <div className="detail-block">
                    <p className="detail-label">Contracts</p>
                    <div className="detail-pills">
                      {selectedGraphNode.contracts.map((c) => <span key={c}>{c}</span>)}
                    </div>
                  </div>
                  <div className="detail-block">
                    <p className="detail-label">Pressure</p>
                    <strong>{selectedGraphNode.stress}</strong>
                  </div>
                </article>
              </div>
            </>
          )}
        </section>
      </section>

      <section className="platform-strip">
        {platformCards.map((card) => (
          <article key={card.title} className="platform-card">
            <p className="panel-eyebrow">{card.title}</p>
            <p>{card.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
