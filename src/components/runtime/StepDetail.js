import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { lensText } from "../../types/prism.js";
export function StepDetail({ step, lens }) {
    const copy = lensText(lens);
    return (_jsxs("article", { className: "support-panel", children: [_jsx("p", { className: "panel-eyebrow", children: copy.headline }), _jsx("h3", { children: step.event }), _jsx("p", { className: "panel-body", children: copy.body }), _jsxs("div", { className: "detail-block", children: [_jsx("p", { className: "detail-label", children: "Source anchor" }), _jsx("strong", { children: step.line })] }), _jsxs("div", { className: "detail-block", children: [_jsx("p", { className: "detail-label", children: "Observed state" }), _jsx("div", { className: "detail-pills", children: [step.delta, ...step.heap].map((item, i) => (_jsx("span", { children: item }, i))) })] })] }));
}
