/**
 * Prism internal view models, constants, and mock data.
 */

export type Surface = "runtime" | "architecture";
export type Lens = "debug" | "learn";

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

export type GraphNode = {
  id: string;
  label: string;
  kind: string;
  owner: string;
  summary: string;
  stress: string;
  contracts: string[];
  x: number;
  y: number;
};

export type GraphEdge = { from: string; to: string; label: string };

// ── Surface / Lens definitions ──

export const surfaces = [
  { id: "runtime" as const, label: "Runtime Studio", caption: "UEF sessions from Tracium Engine" },
  { id: "architecture" as const, label: "Architecture Lens", caption: "UGF topology from Atlas" },
];

export const lenses = [
  { id: "debug" as const, label: "Debug Truth", caption: "Expose precise frames, refs, and transitions" },
  { id: "learn" as const, label: "Learning Lens", caption: "Keep the same signal, but explain it more gently" },
];

export function lensText(lens: Lens) {
  return lens === "debug"
    ? { headline: "Technical inspection", body: "Expose exact state transitions and memory truth.", modePill: "Precise runtime and topology inspection" }
    : { headline: "Guided explanation", body: "Use the same source of truth but present it with calmer, more teachable framing.", modePill: "Learning-first" };
}

// ── Architecture graph data ──

export const graphNodes: GraphNode[] = [
  { id: "prism-ui", label: "Prism UI", kind: "product surface", owner: "frontend-platform", summary: "Hosts runtime and architecture workspaces while staying contract-driven.", stress: "High user traffic", contracts: ["GET /sessions/runtime/:id", "GET /graphs/:id"], x: 16, y: 20 },
  { id: "nerva", label: "Nerva API", kind: "control plane", owner: "platform-core", summary: "Brokers sessions, auth, and client-facing orchestration.", stress: "Central routing boundary", contracts: ["POST /sessions/runtime", "POST /analysis/repos"], x: 41, y: 16 },
  { id: "engine", label: "Tracium Engine", kind: "runtime service", owner: "runtime-intelligence", summary: "Produces UEF timelines from execution adapters and state normalization.", stress: "Trace-heavy workloads", contracts: ["UEF trace stream", "Runtime session state"], x: 73, y: 28 },
  { id: "atlas", label: "Atlas", kind: "analysis service", owner: "graph-intelligence", summary: "Builds UGF topology from repo parsing, symbol extraction, and graph synthesis.", stress: "Repository graph computation", contracts: ["UGF snapshot", "Dependency diagnostics"], x: 68, y: 66 },
  { id: "quanta", label: "Quanta", kind: "spec source", owner: "shared-contracts", summary: "Defines UEF, UGF, diagnostics, and source-anchor contracts for every surface.", stress: "Versioned compatibility", contracts: ["UEF v1", "UGF v1", "Diagnostics schema"], x: 36, y: 74 },
  { id: "pulse", label: "Pulse", kind: "IDE plugin", owner: "developer-workflows", summary: "Launches analysis from editors and links source anchors back into Prism.", stress: "Context-switch reduction", contracts: ["Open session in Prism", "Source anchor deep links"], x: 13, y: 66 },
];

export const graphEdges: GraphEdge[] = [
  { from: "prism-ui", to: "nerva", label: "sessions" },
  { from: "nerva", to: "engine", label: "runtime jobs" },
  { from: "nerva", to: "atlas", label: "repo analysis" },
  { from: "engine", to: "quanta", label: "UEF" },
  { from: "atlas", to: "quanta", label: "UGF" },
  { from: "pulse", to: "prism-ui", label: "open insight" },
];

export function getNode(nodeId: string) {
  return graphNodes.find((n) => n.id === nodeId);
}

// ── Mock data (shown before backend connection) ──

export const mockEvents: RuntimeEvent[] = [
  { id: "evt-01", step: 38, line: "Main.java:4", event: "FRAME_CREATED", delta: "main -> frame#1", summary: "The runtime opens a frame for main and anchors local scope.", stack: ["main(args) -> frame#1", "locals: arr, i, j"], heap: ["ref#01 int[3] = [3, 1, 2]"] },
  { id: "evt-02", step: 39, line: "Main.java:6", event: "CONDITION_EVALUATED", delta: "arr[j] > arr[j + 1] == true", summary: "The branch resolves true, so Prism keeps focus on the swap path.", stack: ["main(frame#1)", "i = 0", "j = 0"], heap: ["ref#01 int[3] = [3, 1, 2]"] },
  { id: "evt-03", step: 40, line: "Main.java:7", event: "VARIABLE_ASSIGNED", delta: "tmp = 3", summary: "A temporary variable captures the left value before mutation.", stack: ["main(frame#1)", "tmp = 3", "j = 0"], heap: ["ref#01 int[3] = [3, 1, 2]"] },
  { id: "evt-04", step: 41, line: "Main.java:8", event: "ARRAY_WRITE", delta: "arr[0] = 1", summary: "Heap state changes in place, and the reference identity stays stable.", stack: ["main(frame#1)", "tmp = 3", "j = 0"], heap: ["ref#01 int[3] = [1, 1, 2]"] },
  { id: "evt-05", step: 42, line: "Main.java:9", event: "ARRAY_WRITE", delta: "arr[1] = 3", summary: "The swap completes and the tracked heap object settles to the new order.", stack: ["main(frame#1)", "tmp = 3", "j = 0"], heap: ["ref#01 int[3] = [1, 3, 2]"] },
];

export const mockCodeLines = [
  "1  class Main {",
  "2    public static void main(String[] args) {",
  "3      int[] arr = {3, 1, 2};",
  "4      for (int i = 0; i < arr.length; i++) {",
  "5        for (int j = 0; j < arr.length - 1; j++) {",
  "6          if (arr[j] > arr[j + 1]) {",
  "7            int tmp = arr[j];",
  "8            arr[j] = arr[j + 1];",
  "9            arr[j + 1] = tmp;",
  "10         }",
  "11       }",
  "12     }",
  "13   }",
  "14 }",
];

export const DEFAULT_CODE = `class Main {
  public static void main(String[] args) {
    int[] arr = {3, 1, 2};
    for (int i = 0; i < arr.length; i++) {
      for (int j = 0; j < arr.length - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          int tmp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = tmp;
        }
      }
    }
  }
}`;

export const platformCards = [
  { title: "Runtime", body: "Tracium Engine supplies UEF traces. Prism only renders them." },
  { title: "Structure", body: "Atlas supplies UGF graphs so architecture stays distinct from execution." },
  { title: "Contracts", body: "Quanta keeps payload shapes stable while Prism focuses on interaction." },
];
