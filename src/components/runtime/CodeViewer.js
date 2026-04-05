import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function CodeViewer({ codeLines, activeLine, isLive }) {
    return (_jsxs("div", { className: "code-frame", children: [_jsxs("div", { className: "code-head", children: [_jsx("span", { children: "Main.java" }), _jsx("span", { children: "Line synced to selected step" })] }), _jsx("div", { className: "code-body", children: codeLines.map((line, idx) => {
                    const lineNum = idx + 1;
                    const isActive = isLive
                        ? activeLine?.includes(`:${lineNum}`)
                        : line.startsWith(activeLine.split(":")[1]);
                    return (_jsx("div", { className: isActive ? "code-line active" : "code-line", children: line }, idx));
                }) })] }));
}
