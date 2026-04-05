import type { GraphNode, GraphEdge, Lens } from "../../types/prism.js";
import { lensText, getNode } from "../../types/prism.js";

type Props = {
  node: GraphNode;
  edges: GraphEdge[];
  lens: Lens;
};

export function NodeDetail({ node, edges, lens }: Props) {
  const copy = lensText(lens);

  return (
    <div className="support-grid">
      <article className="support-panel">
        <div className="panel-head">
          <div>
            <p className="panel-eyebrow">Connected edges</p>
            <h3>System relationships</h3>
          </div>
          <span className="panel-pill panel-pill-soft">{edges.length} links</span>
        </div>
        <div className="edge-list">
          {edges.map((edge) => (
            <div key={`${edge.from}-${edge.to}`} className="edge-row">
              <strong>{getNode(edge.from)?.label} → {getNode(edge.to)?.label}</strong>
              <span>{edge.label}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="support-panel">
        <p className="panel-eyebrow">{copy.headline}</p>
        <h3>{node.label}</h3>
        <p className="panel-body">{copy.body}</p>
        <div className="detail-block">
          <p className="detail-label">Owner</p>
          <strong>{node.owner}</strong>
        </div>
        <div className="detail-block">
          <p className="detail-label">Contracts</p>
          <div className="detail-pills">
            {node.contracts.map((c) => <span key={c}>{c}</span>)}
          </div>
        </div>
        <div className="detail-block">
          <p className="detail-label">Pressure</p>
          <strong>{node.stress}</strong>
        </div>
      </article>
    </div>
  );
}
