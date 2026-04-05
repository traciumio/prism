/**
 * UEF (Universal Execution Format) type definitions.
 * Extracted from the Quanta schema contracts.
 */

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
