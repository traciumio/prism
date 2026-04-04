import { useState, useCallback } from "react";
import {
  executeCode,
  fetchTrace,
  type UefTrace,
  type UefStep,
  type UefValue,
  type UefFrame,
} from "../api/nerva-client.js";

// ── Types that match Prism's existing UI ──

export type RuntimeEvent = {
  id: string;
  step: number;
  line: string;
  event: string;
  delta: string;
  summary: string;
  stack: string[];
  heap: string[];
};

export type RuntimeSession = {
  sessionId: string;
  trace: UefTrace;
  events: RuntimeEvent[];
  codeLines: string[];
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
};

// ── Transform UEF into Prism display format ──

function formatValue(v: UefValue): string {
  if (v.kind === "null") return "null";
  if (v.kind === "primitive") return String(v.value);
  if (v.kind === "reference") return `-> ${v.ref}`;
  if (v.kind === "symbolic") return String(v.value);
  return v.kind;
}

function formatFrame(frame: UefFrame): string[] {
  const lines: string[] = [];
  lines.push(`${frame.name}(${frame.declaringType}) [${frame.status}]`);

  for (const [name, val] of Object.entries(frame.parameters)) {
    lines.push(`  param ${name} = ${formatValue(val)}`);
  }
  for (const [name, val] of Object.entries(frame.locals)) {
    lines.push(`  ${name} = ${formatValue(val)}`);
  }
  return lines;
}

function formatHeap(heap: Record<string, { kind: string; type: string; fields?: Record<string, UefValue>; elements?: UefValue[] }>): string[] {
  const lines: string[] = [];
  for (const [id, obj] of Object.entries(heap)) {
    if (obj.kind === "array" && obj.elements) {
      const elems = obj.elements.map(formatValue).join(", ");
      lines.push(`${id}: ${obj.type} [${elems}]`);
    } else if (obj.kind === "object" && obj.fields) {
      const fields = Object.entries(obj.fields)
        .map(([k, v]) => `${k}=${formatValue(v)}`)
        .join(", ");
      lines.push(`${id}: ${obj.type} {${fields}}`);
    }
  }
  return lines.length > 0 ? lines : ["(empty heap)"];
}

function formatDelta(step: UefStep): string {
  const parts: string[] = [];

  for (const fc of step.delta.frameChanges) {
    const before = fc.before ? formatValue(fc.before) : "unset";
    const after = fc.after ? formatValue(fc.after) : "unset";
    parts.push(`${fc.local}: ${before} -> ${after}`);
  }
  for (const hc of step.delta.heapChanges) {
    const before = hc.before ? formatValue(hc.before) : "?";
    const after = hc.after ? formatValue(hc.after) : "?";
    parts.push(`${hc.objectId}.${hc.path}: ${before} -> ${after}`);
  }

  return parts.length > 0 ? parts.join(", ") : "(no changes)";
}

function summarizeStep(step: UefStep): string {
  switch (step.event) {
    case "SESSION_STARTED": return "Execution session begins.";
    case "SESSION_FINISHED": return "Execution session ends.";
    case "METHOD_ENTERED": return `Entered ${step.source?.symbol ?? "method"}.`;
    case "METHOD_EXITED": return `Exited ${step.source?.symbol ?? "method"}.`;
    case "VARIABLE_ASSIGNED": {
      const changes = step.delta.frameChanges.map(fc => `${fc.local} = ${fc.after ? formatValue(fc.after) : "?"}`).join(", ");
      return changes ? `Assigned: ${changes}` : "Variable assigned.";
    }
    case "OBJECT_ALLOCATED": return "New object allocated on heap.";
    case "FIELD_UPDATED": {
      const changes = step.delta.heapChanges.map(hc => `${hc.objectId}.${hc.path}`).join(", ");
      return changes ? `Field updated: ${changes}` : "Object field updated.";
    }
    case "ARRAY_ELEMENT_UPDATED": return "Array element updated.";
    case "LINE_CHANGED": return `Execution at line ${step.source?.line ?? "?"}.`;
    default: return step.event;
  }
}

function transformTrace(trace: UefTrace): { events: RuntimeEvent[]; codeLines: string[] } {
  const events: RuntimeEvent[] = trace.steps
    .filter(s => s.event !== "SESSION_STARTED" && s.event !== "SESSION_FINISHED")
    .map(step => ({
      id: `step-${step.step}`,
      step: step.step,
      line: step.source ? `${step.source.file}:${step.source.line}` : "?",
      event: step.event,
      delta: formatDelta(step),
      summary: summarizeStep(step),
      stack: step.state.frames.flatMap(formatFrame),
      heap: formatHeap(step.state.heap),
    }));

  // Extract code from the trace's entrypoint -- we use a placeholder
  // since the actual source isn't in UEF (it's in the request)
  const codeLines: string[] = [];

  return { events, codeLines };
}

// ── Hook ──

export function useRuntimeSession() {
  const [session, setSession] = useState<RuntimeSession>({
    sessionId: "",
    trace: null as unknown as UefTrace,
    events: [],
    codeLines: [],
    status: "idle",
    error: null,
  });

  const run = useCallback(async (code: string, entrypoint?: string) => {
    setSession(prev => ({ ...prev, status: "loading", error: null }));

    try {
      const result = await executeCode(code, entrypoint);
      const trace = await fetchTrace(result.sessionId);
      const { events } = transformTrace(trace);

      // Build code lines from the submitted source
      const codeLines = code.split("\n").map((line, i) => `${String(i + 1).padStart(3)}  ${line}`);

      setSession({
        sessionId: result.sessionId,
        trace,
        events,
        codeLines,
        status: "ready",
        error: null,
      });
    } catch (err: any) {
      setSession(prev => ({
        ...prev,
        status: "error",
        error: err.message ?? "Unknown error",
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setSession({
      sessionId: "",
      trace: null as unknown as UefTrace,
      events: [],
      codeLines: [],
      status: "idle",
      error: null,
    });
  }, []);

  return { session, run, reset };
}
