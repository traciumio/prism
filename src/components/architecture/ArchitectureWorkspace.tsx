import { useState } from "react";
import type { Lens } from "../../types/prism.js";
import { graphNodes, graphEdges } from "../../types/prism.js";
import { Sidebar } from "../layout/Sidebar.js";
import { GraphCanvas } from "./GraphCanvas.js";
import { NodeDetail } from "./NodeDetail.js";

type Props = {
  lens: Lens;
};

export function ArchitectureWorkspace({ lens }: Props) {
  const [selectedId, setSelectedId] = useState("nerva");

  const selectedNode = graphNodes.find((n) => n.id === selectedId) ?? graphNodes[0];
  const relatedEdges = graphEdges.filter(
    (e) => e.from === selectedNode.id || e.to === selectedNode.id
  );

  return (
    <section className="workspace">
      <Sidebar
        mode="architecture"
        nodes={graphNodes}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <section className="content">
        <div className="content-head">
          <div>
            <p className="eyebrow">Now Viewing</p>
            <h2>{selectedNode.label}</h2>
          </div>
          <div className="content-pills">
            <span>UGF graph</span>
            <span>{lens === "debug" ? "Technical lens" : "Guided lens"}</span>
          </div>
        </div>

        <article className="primary-panel primary-panel-dark">
          <div className="panel-head">
            <div>
              <p className="panel-eyebrow">Topology canvas</p>
              <h3>{selectedNode.label}</h3>
            </div>
            <span className="panel-pill">{selectedNode.kind}</span>
          </div>
          <p className="panel-body">{selectedNode.summary}</p>
          <GraphCanvas
            nodes={graphNodes}
            edges={graphEdges}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </article>

        <NodeDetail node={selectedNode} edges={relatedEdges} lens={lens} />
      </section>
    </section>
  );
}
