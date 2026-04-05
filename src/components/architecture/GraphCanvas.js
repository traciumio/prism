import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getNode } from "../../types/prism.js";
export function GraphCanvas({ nodes, edges, selectedId, onSelect }) {
    return (_jsxs("div", { className: "graph-frame", children: [_jsx("svg", { className: "graph-svg", viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true", children: edges.map((edge) => {
                    const from = getNode(edge.from);
                    const to = getNode(edge.to);
                    if (!from || !to)
                        return null;
                    return (_jsx("line", { x1: from.x, y1: from.y, x2: to.x, y2: to.y, className: "graph-edge" }, `${edge.from}-${edge.to}`));
                }) }), nodes.map((node) => (_jsxs("button", { type: "button", className: selectedId === node.id ? "graph-node active" : "graph-node", style: { left: `${node.x}%`, top: `${node.y}%` }, onClick: () => onSelect(node.id), children: [_jsx("span", { children: node.label }), _jsx("small", { children: node.kind })] }, node.id)))] }));
}
