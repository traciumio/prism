import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Sidebar(props) {
    return (_jsxs("aside", { className: "sidebar", children: [_jsxs("div", { className: "sidebar-head", children: [_jsx("p", { className: "eyebrow", children: "Workspace" }), _jsx("h2", { children: props.mode === "runtime"
                            ? props.isLive ? "Active runtime session" : "Runtime timeline"
                            : "Architecture map" })] }), props.mode === "runtime" && (_jsxs("div", { style: { padding: "0 22px 8px" }, children: [_jsx("button", { type: "button", onClick: props.onRun, disabled: props.isLoading, style: {
                            width: "100%", padding: "10px 16px",
                            background: props.isLoading ? "#8a7060" : "#b55233",
                            color: "#fff", border: "none", borderRadius: 10,
                            fontWeight: 700, fontSize: "0.85rem",
                            cursor: props.isLoading ? "wait" : "pointer",
                            fontFamily: "inherit",
                        }, children: props.isLoading ? "Executing via JDI..." : props.isLive ? "Run Again" : "Run Code" }), props.isLive && (_jsxs("p", { style: { fontSize: "0.72rem", color: "#506177", marginTop: 6, textAlign: "center" }, children: [props.events.length, " steps captured \u00B7 ", props.sessionId] }))] })), _jsx("div", { className: "sidebar-list", children: props.mode === "runtime"
                    ? props.events.map((event, idx) => (_jsxs("button", { type: "button", className: props.selectedIndex === idx ? "sidebar-item active" : "sidebar-item", onClick: () => props.onSelect(idx), children: [_jsx("span", { className: "sidebar-index", children: event.step }), _jsxs("div", { children: [_jsx("strong", { children: event.event }), _jsx("p", { children: event.line })] })] }, event.id)))
                    : props.nodes.map((node) => (_jsxs("button", { type: "button", className: props.selectedId === node.id ? "sidebar-item active" : "sidebar-item", onClick: () => props.onSelect(node.id), children: [_jsx("span", { className: "sidebar-index glyph", children: node.label.split(" ").map((p) => p[0]).join("").slice(0, 2) }), _jsxs("div", { children: [_jsx("strong", { children: node.label }), _jsx("p", { children: node.kind })] })] }, node.id))) })] }));
}
