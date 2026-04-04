/**
 * Nerva API client for Prism.
 * Talks to Nerva (port 4000) which proxies to Tracium Engine and persists traces.
 */

const NERVA_BASE = import.meta.env.VITE_NERVA_URL ?? "http://localhost:4000";

// ── Types matching UEF spec ──

export type UefValue = {
  kind: string;
  type?: string;
  value?: unknown;
  ref?: string;
};

export type UefFrame = {
  id: string;
  name: string;
  declaringType: string;
  source: { file: string; symbol: string; line: number; column: number };
  locals: Record<string, UefValue>;
  parameters: Record<string, UefValue>;
  status: string;
};

export type UefHeapObject = {
  kind: string;
  type: string;
  fields?: Record<string, UefValue>;
  elements?: UefValue[];
};

export type UefState = {
  frames: UefFrame[];
  heap: Record<string, UefHeapObject>;
  globals: Record<string, unknown>;
  stdout: string[];
  stderr: string[];
};

export type UefDelta = {
  frameChanges: Array<{
    frameId: string;
    local: string;
    before: UefValue | null;
    after: UefValue | null;
  }>;
  heapChanges: Array<{
    objectId: string;
    path: string;
    before: UefValue | null;
    after: UefValue | null;
  }>;
};

export type UefStep = {
  step: number;
  event: string;
  threadId: string;
  source: { file: string; symbol: string; line: number; column: number } | null;
  delta: UefDelta;
  state: UefState;
  metadata: Record<string, unknown>;
};

export type UefTrace = {
  uefVersion: string;
  session: {
    id: string;
    language: string;
    adapter: string;
    runtimeVersion: string;
    entrypoint: string;
    startedAt: string;
    completedAt: string | null;
  };
  recording: {
    mode: string;
    fidelity: string;
    samplingStrategy: string;
    environment: string;
  };
  correlation: {
    correlationId: string | null;
    parentSessionId: string | null;
    serviceName: string | null;
    tags: Record<string, string>;
  };
  steps: UefStep[];
  diagnostics: Array<{ level: string; code: string; message: string }>;
};

export type TraceMetadata = {
  sessionId: string;
  language: string;
  entrypoint: string;
  totalSteps: number;
  startedAt: string;
  completedAt: string | null;
  recordingMode: string;
  fidelity: string;
};

export type SessionCreateResponse = {
  sessionId: string;
  status: string;
  totalSteps: number;
  persisted: boolean;
  metadata: TraceMetadata;
};

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
