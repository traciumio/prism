import type { RuntimeEvent, GraphNode } from "../../types/prism.js";

type RuntimeSidebarProps = {
  mode: "runtime";
  events: RuntimeEvent[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  isLive: boolean;
  sessionId: string;
  onRun: () => void;
  isLoading: boolean;
};

type ArchitectureSidebarProps = {
  mode: "architecture";
  nodes: GraphNode[];
  selectedId: string;
  onSelect: (id: string) => void;
};

type Props = RuntimeSidebarProps | ArchitectureSidebarProps;

export function Sidebar(props: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <p className="eyebrow">Workspace</p>
        <h2>{props.mode === "runtime"
          ? props.isLive ? "Active runtime session" : "Runtime timeline"
          : "Architecture map"}</h2>
      </div>

      {props.mode === "runtime" && (
        <div style={{ padding: "0 22px 8px" }}>
          <button type="button" onClick={props.onRun}
            disabled={props.isLoading}
            style={{
              width: "100%", padding: "10px 16px",
              background: props.isLoading ? "#8a7060" : "#b55233",
              color: "#fff", border: "none", borderRadius: 10,
              fontWeight: 700, fontSize: "0.85rem",
              cursor: props.isLoading ? "wait" : "pointer",
              fontFamily: "inherit",
            }}>
            {props.isLoading ? "Executing via JDI..." : props.isLive ? "Run Again" : "Run Code"}
          </button>
          {props.isLive && (
            <p style={{ fontSize: "0.72rem", color: "#506177", marginTop: 6, textAlign: "center" }}>
              {props.events.length} steps captured &middot; {props.sessionId}
            </p>
          )}
        </div>
      )}

      <div className="sidebar-list">
        {props.mode === "runtime"
          ? props.events.map((event, idx) => (
              <button key={event.id} type="button"
                className={props.selectedIndex === idx ? "sidebar-item active" : "sidebar-item"}
                onClick={() => props.onSelect(idx)}>
                <span className="sidebar-index">{event.step}</span>
                <div>
                  <strong>{event.event}</strong>
                  <p>{event.line}</p>
                </div>
              </button>
            ))
          : props.nodes.map((node) => (
              <button key={node.id} type="button"
                className={props.selectedId === node.id ? "sidebar-item active" : "sidebar-item"}
                onClick={() => props.onSelect(node.id)}>
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
  );
}
