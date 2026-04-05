import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function StackPanel({ stack }) {
    return (_jsxs("div", { className: "memory-column", children: [_jsx("p", { className: "memory-label", children: "Stack" }), stack.map((item, i) => (_jsx("span", { className: "memory-pill", children: item }, i)))] }));
}
