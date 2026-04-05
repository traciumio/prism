import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function HeapPanel({ heap }) {
    return (_jsxs("div", { className: "memory-column", children: [_jsx("p", { className: "memory-label", children: "Heap" }), heap.map((item, i) => (_jsx("span", { className: "memory-pill", children: item }, i)))] }));
}
