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

type GraphEdge = {
  from: string;
  to: string;
  label: string;
};

const surfaces = [
  {
    id: "runtime" as const,
    label: "Runtime Studio",
    caption: "UEF sessions from Tracium Engine",
  },
  {
    id: "architecture" as const,
    label: "Architecture Lens",
    caption: "UGF topology from Atlas",
  },
];

const lenses = [
  {
    id: "debug" as const,
    label: "Debug Truth",
    caption: "Precise frames, refs, and transitions",
  },
  {
    id: "learn" as const,
    label: "Learning Lens",
    caption: "Same signal, calmer explanation",
  },
];

// Architecture data stays hardcoded for now (Atlas not wired yet)
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

const platformCards = [
  { title: "Runtime", body: "Tracium Engine supplies UEF traces. Prism only renders them." },
  { title: "Structure", body: "Atlas supplies UGF graphs so architecture stays distinct from execution." },
  { title: "Contracts", body: "Quanta keeps payload shapes stable while Prism focuses on interaction." },
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

function getNode(nodeId: string) {
  return graphNodes.find((node) => node.id === nodeId);
}

export function App() {
  const [surface, setSurface] = useState<Surface>("runtime");
  const [lens, setLens] = useState<Lens>("debug");
  const [selectedRuntimeId, setSelectedRuntimeId] = useState<string>("");
  const [selectedGraphNodeId, setSelectedGraphNodeId] = useState("nerva");
  const [code, setCode] = useState(DEFAULT_CODE);

  const { session, run, reset } = useRuntimeSession();

  const runtimeEvents = session.events;
  const runtimeCode = session.codeLines.length > 0
    ? session.codeLines
    : code.split("\n").map((line, i) => `${String(i + 1).padStart(3)}  ${line}`);

  const selectedRuntime: RuntimeEvent = runtimeEvents.find(e => e.id === selectedRuntimeId)
    ?? runtimeEvents[0]
    ?? { id: "", step: 0, line: "?", event: "IDLE", delta: "", summary: "Submit code to see execution trace.", stack: [], heap: [] };

  const selectedGraphNode = graphNodes.find((node) => node.id === selectedGraphNodeId) ?? graphNodes[0];
  const relatedEdges = graphEdges.filter(
    (edge) => edge.from === selectedGraphNode.id || edge.to === selectedGraphNode.id,
  );

  const lensCopy = lens === "debug"
    ? { headline: "Technical inspection", body: "Expose exact state transitions and keep the raw structure visible.", modePill: "Truth-first" }
    : { headline: "Guided explanation", body: "Use the same source of truth but present it with calmer, more teachable framing.", modePill: "Learning-first" };

  async function handleRun() {
    await run(code);
    // Select the first meaningful step after run
    // (will be updated once session.events is populated via re-render)
  }

  // Auto-select first event when events change
  if (runtimeEvents.length > 0 && !runtimeEvents.find(e => e.id === selectedRuntimeId)) {
    // Pick the first non-trivial step (skip SESSION_STARTED which is filtered out)
    const firstMeaningful = runtimeEvents.find(e => e.event !== "LINE_CHANGED") ?? runtimeEvents[0];
    if (firstMeaningful) setSelectedRuntimeId(firstMeaningful.id);
  }

  return (
    <main className="prism-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <section className="topbar">
        <div className="topbar-copy">
          <p className="eyebrow">Prism Workspace</p>
          <h1>Runtime and architecture, without the clutter.</h1>
          <p>
            Prism should feel like a focused product surface, not a dashboard of
            competing cards. The active analysis stays central and everything
            else supports it.
          </p>
          <div className="topbar-pills">
            <span>UEF playback</span>
            <span>UGF topology</span>
            <span>{lensCopy.modePill}</span>
            {session.status === "ready" && <span>{session.events.length} steps</span>}
          </div>
        </div>

        <div className="topbar-controls">
          <div className="control-block">
            <p className="control-label">Surface</p>
            <div className="segmented">
              {surfaces.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={surface === item.id ? "segment active" : "segment"}
                  onClick={() => setSurface(item.id)}
                >
                  <strong>{item.label}</strong>
                  <span>{item.caption}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="control-block">
            <p className="control-label">Lens</p>
            <div className="segmented compact">
              {lenses.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={lens === item.id ? "segment active" : "segment"}
                  onClick={() => setLens(item.id)}
                >
                  <strong>{item.label}</strong>
                  <span>{item.caption}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="workspace">
        <aside className="sidebar">
          <div className="sidebar-head">
            <p className="eyebrow">Workspace</p>
            <h2>{surface === "runtime" ? "Runtime timeline" : "Architecture map"}</h2>
            <p>{lensCopy.body}</p>
          </div>

          {surface === "runtime" && (
            <div className="sidebar-head" style={{ paddingTop: 0 }}>
              <button
                type="button"
                className="segment active"
                onClick={handleRun}
                disabled={session.status === "loading"}
                style={{ width: "100%", justifyContent: "center", cursor: "pointer" }}
              >
                <strong>{session.status === "loading" ? "Executing..." : "Run Code"}</strong>
              </button>
            </div>
          )}

          <div className="sidebar-list">
            {surface === "runtime" ? (
              session.status === "idle" ? (
                <div className="sidebar-item" style={{ opacity: 0.5 }}>
                  <div><strong>No trace yet</strong><p>Click "Run Code" to execute</p></div>
                </div>
              ) : session.status === "loading" ? (
                <div className="sidebar-item" style={{ opacity: 0.5 }}>
                  <div><strong>Executing...</strong><p>Compiling and tracing via JDI</p></div>
                </div>
              ) : session.status === "error" ? (
                <div className="sidebar-item" style={{ opacity: 0.5, color: "#ff6b6b" }}>
                  <div><strong>Error</strong><p>{session.error}</p></div>
                </div>
              ) : (
                runtimeEvents.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    className={selectedRuntimeId === event.id ? "sidebar-item active" : "sidebar-item"}
                    onClick={() => setSelectedRuntimeId(event.id)}
                  >
                    <span className="sidebar-index">{event.step}</span>
                    <div>
                      <strong>{event.event}</strong>
                      <p>{event.line}</p>
                    </div>
                  </button>
                ))
              )
            ) : (
              graphNodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  className={selectedGraphNodeId === node.id ? "sidebar-item active" : "sidebar-item"}
                  onClick={() => setSelectedGraphNodeId(node.id)}
                >
                  <span className="sidebar-index glyph">
                    {node.label.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                  </span>
                  <div>
                    <strong>{node.label}</strong>
                    <p>{node.kind}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <section className="content">
          <div className="content-head">
            <div>
              <p className="eyebrow">Now Viewing</p>
              <h2>
                {surface === "runtime"
                  ? session.status === "ready"
                    ? `Step ${selectedRuntime.step} at ${selectedRuntime.line}`
                    : "Runtime Studio"
                  : selectedGraphNode.label}
              </h2>
            </div>
            <div className="content-pills">
              <span>{surface === "runtime" ? "UEF session" : "UGF graph"}</span>
              <span>{lens === "debug" ? "Technical lens" : "Guided lens"}</span>
              {session.status === "ready" && surface === "runtime" && (
                <span>{session.sessionId}</span>
              )}
            </div>
          </div>

          {surface === "runtime" ? (
            <>
              <article className="primary-panel primary-panel-dark">
                <div className="panel-head">
                  <div>
                    <p className="panel-eyebrow">
                      {session.status === "ready" ? "Trace timeline" : "Code editor"}
                    </p>
                    <h3>{session.status === "ready" ? selectedRuntime.event : "Submit Java code"}</h3>
                  </div>
                  {session.status === "ready" && (
                    <span className="panel-pill">{selectedRuntime.delta}</span>
                  )}
                </div>
                {session.status === "ready" && (
                  <p className="panel-body">{selectedRuntime.summary}</p>
                )}

                {session.status !== "ready" ? (
                  <div className="code-frame">
                    <div className="code-head">
                      <span>Main.java</span>
                      <span>Edit code below, then click Run</span>
                    </div>
                    <textarea
                      className="code-body"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      spellCheck={false}
                      style={{
                        width: "100%", minHeight: 220, background: "transparent",
                        color: "inherit", border: "none", resize: "vertical",
                        fontFamily: "inherit", fontSize: "inherit", lineHeight: "inherit",
                        padding: "1rem", outline: "none",
                      }}
                    />
                  </div>
                ) : (
                  <div className="code-frame">
                    <div className="code-head">
                      <span>{session.trace?.session?.entrypoint ?? "Main.java"}</span>
                      <span>Line-synced trace playback</span>
                    </div>
                    <div className="code-body">
                      {runtimeCode.map((line, idx) => {
                        const lineNum = idx + 1;
                        const isActive = selectedRuntime.line?.includes(`:${lineNum}`);

                        return (
                          <div
                            key={idx}
                            className={isActive ? "code-line active" : "code-line"}
                          >
                            {line}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
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
                      {(selectedRuntime.stack.length > 0 ? selectedRuntime.stack : ["(no frames)"]).map((item, i) => (
                        <span key={i} className="memory-pill">{item}</span>
                      ))}
                    </div>

                    <div className="memory-column">
                      <p className="memory-label">Heap</p>
                      {(selectedRuntime.heap.length > 0 ? selectedRuntime.heap : ["(empty heap)"]).map((item, i) => (
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
                      {[selectedRuntime.delta, ...selectedRuntime.heap].filter(Boolean).map((item, i) => (
                        <span key={i}>{item}</span>
                      ))}
                    </div>
                  </div>

                  {session.status === "ready" && session.trace?.session && (
                    <div className="detail-block">
                      <p className="detail-label">Session</p>
                      <div className="detail-pills">
                        <span>{session.trace.session.language}</span>
                        <span>{session.trace.session.adapter}</span>
                        <span>Java {session.trace.session.runtimeVersion}</span>
                        <span>{session.trace.recording.mode}</span>
                      </div>
                    </div>
                  )}
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
                      const from = getNode(edge.from);
                      const to = getNode(edge.to);
                      if (!from || !to) return null;
                      return (
                        <line key={`${edge.from}-${edge.to}`}
                          x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                          className="graph-edge" />
                      );
                    })}
                  </svg>
                  {graphNodes.map((node) => (
                    <button key={node.id} type="button"
                      className={selectedGraphNodeId === node.id ? "graph-node active" : "graph-node"}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      onClick={() => setSelectedGraphNodeId(node.id)}>
                      <span>{node.label}</span>
                      <small>{node.kind}</small>
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
                        <strong>{getNode(edge.from)?.label} {"->"} {getNode(edge.to)?.label}</strong>
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
                      {selectedGraphNode.contracts.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
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
