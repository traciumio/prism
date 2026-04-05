/**
 * Nerva API client for Prism.
 * Talks to Nerva (port 4000) which proxies to Tracium Engine and persists traces.
 */

import type { UefTrace, TraceMetadata, SessionCreateResponse } from "../types/uef.js";

export type {
  UefValue, UefFrame, UefHeapObject, UefState, UefDelta,
  UefStep, UefTrace, TraceMetadata, SessionCreateResponse,
} from "../types/uef.js";

const NERVA_BASE = import.meta.env.VITE_NERVA_URL ?? "http://localhost:4000";

// ── API calls ──

export async function executeCode(
  code: string,
  entrypoint: string = "Main.main",
  language: string = "java",
): Promise<SessionCreateResponse> {
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
    throw new Error((err as any)?.error?.message ?? `Engine error: ${res.status}`);
  }

  return res.json() as Promise<SessionCreateResponse>;
}

export async function fetchTrace(sessionId: string): Promise<UefTrace> {
  const res = await fetch(`${NERVA_BASE}/v1/traces/${sessionId}`);
  if (!res.ok) throw new Error(`Trace not found: ${sessionId}`);
  return res.json() as Promise<UefTrace>;
}

export async function listTraces(): Promise<{ traces: TraceMetadata[]; total: number }> {
  const res = await fetch(`${NERVA_BASE}/v1/traces`);
  if (!res.ok) throw new Error("Failed to list traces");
  return res.json() as Promise<{ traces: TraceMetadata[]; total: number }>;
}

export async function healthCheck(): Promise<{ status: string }> {
  const res = await fetch(`${NERVA_BASE}/health`);
  return res.json() as Promise<{ status: string }>;
}
