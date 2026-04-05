/**
 * Nerva API client for Prism.
 * Talks to Nerva (port 4000) which proxies to Tracium Engine and persists traces.
 */
const NERVA_BASE = import.meta.env.VITE_NERVA_URL ?? "http://localhost:4000";
// ── API calls ──
export async function executeCode(code, entrypoint = "Main.main", language = "java") {
    const res = await fetch(`${NERVA_BASE}/v1/sessions/runtime`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            language,
            entrypoint,
            code,
            limits: { timeoutMs: 10000, maxSteps: 500 },
        }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message ?? `Engine error: ${res.status}`);
    }
    return res.json();
}
export async function fetchTrace(sessionId) {
    const res = await fetch(`${NERVA_BASE}/v1/traces/${sessionId}`);
    if (!res.ok)
        throw new Error(`Trace not found: ${sessionId}`);
    return res.json();
}
export async function listTraces() {
    const res = await fetch(`${NERVA_BASE}/v1/traces`);
    if (!res.ok)
        throw new Error("Failed to list traces");
    return res.json();
}
export async function healthCheck() {
    const res = await fetch(`${NERVA_BASE}/health`);
    return res.json();
}
