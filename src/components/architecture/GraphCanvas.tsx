import type { GraphNode, GraphEdge } from "../../types/prism.js";
import { getNode } from "../../types/prism.js";

type Props = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function GraphCanvas({ nodes, edges, selectedId, onSelect }: Props) {
  return (
    <div className="graph-frame">
      <svg className="graph-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {edges.map((edge) => {
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
      {nodes.map((node) => (
        <button key={node.id} type="button"
          className={selectedId === node.id ? "graph-node active" : "graph-node"}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          onClick={() => onSelect(node.id)}>
          <span>{node.label}</span>
          <small>{node.kind}</small>
        </button>
      ))}
    </div>
  );
}
