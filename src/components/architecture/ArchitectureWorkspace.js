import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { graphNodes, graphEdges } from "../../types/prism.js";
import { Sidebar } from "../layout/Sidebar.js";
import { GraphCanvas } from "./GraphCanvas.js";
import { NodeDetail } from "./NodeDetail.js";
export function ArchitectureWorkspace({ lens }) {
    const [selectedId, setSelectedId] = useState("nerva");
    const selectedNode = graphNodes.find((n) => n.id === selectedId) ?? graphNodes[0];
    const relatedEdges = graphEdges.filter((e) => e.from === selectedNode.id || e.to === selectedNode.id);
    return (_jsxs("section", { className: "workspace", children: [_jsx(Sidebar, { mode: "architecture", nodes: graphNodes, selectedId: selectedId, onSelect: setSelectedId }), _jsxs("section", { className: "content", children: [_jsxs("div", { className: "content-head", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Now Viewing" }), _jsx("h2", { children: selectedNode.label })] }), _jsxs("div", { className: "content-pills", children: [_jsx("span", { children: "UGF graph" }), _jsx("span", { children: lens === "debug" ? "Technical lens" : "Guided lens" })] })] }), _jsxs("article", { className: "primary-panel primary-panel-dark", children: [_jsxs("div", { className: "panel-head", children: [_jsxs("div", { children: [_jsx("p", { className: "panel-eyebrow", children: "Topology canvas" }), _jsx("h3", { children: selectedNode.label })] }), _jsx("span", { className: "panel-pill", children: selectedNode.kind })] }), _jsx("p", { className: "panel-body", children: selectedNode.summary }), _jsx(GraphCanvas, { nodes: graphNodes, edges: graphEdges, selectedId: selectedId, onSelect: setSelectedId })] }), _jsx(NodeDetail, { node: selectedNode, edges: relatedEdges, lens: lens })] })] }));
}
