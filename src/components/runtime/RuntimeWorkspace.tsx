import { useState } from "react";
import type { Lens } from "../../types/prism.js";
import type { PlaybackState, PlaybackActions } from "../../hooks/use-playback.js";
import { DEFAULT_CODE } from "../../types/prism.js";
import { Sidebar } from "../layout/Sidebar.js";
import { CodeViewer } from "./CodeViewer.js";
import { PlaybackControls } from "./PlaybackControls.js";
import { StackPanel } from "./StackPanel.js";
import { HeapPanel } from "./HeapPanel.js";
import { StepDetail } from "./StepDetail.js";
import type { RuntimeSession } from "../../hooks/use-runtime-session.js";

type Props = {
  session: RuntimeSession;
  playback: PlaybackState;
  playbackActions: PlaybackActions;
  lens: Lens;
  onRun: (code: string) => void;
};

export function RuntimeWorkspace({ session, playback, playbackActions, lens, onRun }: Props) {
  const [code, setCode] = useState(DEFAULT_CODE);

  const isLive = session.status === "ready";
  const isLoading = session.status === "loading";
  const hasError = session.status === "error";

  function handleRun() {
    onRun(code);
  }

  // ── Editor mode: no trace yet, or error ──
  if (!isLive) {
    return (
      <section className="workspace">
        <aside className="sidebar">
          <div className="sidebar-head">
            <p className="eyebrow">Workspace</p>
            <h2>Code Editor</h2>
            <p>Write Java code below, then click Run to capture an execution trace.</p>
          </div>

          <div style={{ padding: "0 22px 8px" }}>
            <button type="button" className="editor-action-btn" style={{ width: "100%" }}
              onClick={handleRun} disabled={isLoading || !code.trim()}>
              {isLoading ? "Executing via JDI..." : "Run Code"}
            </button>
          </div>

          {hasError && (
            <div style={{ padding: "0 22px" }}>
              <p style={{ fontSize: "0.82rem", color: "#d63031", lineHeight: 1.5 }}>
                {session.error}
              </p>
            </div>
          )}
        </aside>

        <section className="content">
          <div className="content-head">
            <div>
              <p className="eyebrow">{isLoading ? "Executing" : "Code Input"}</p>
              <h2>{isLoading ? "Running your code..." : "Write your Java code"}</h2>
            </div>
            <div className="content-pills">
              <span>Java</span>
              <span>{lens === "debug" ? "Technical lens" : "Guided lens"}</span>
            </div>
          </div>

          {isLoading ? (
            <article className="primary-panel" style={{ textAlign: "center", padding: "64px 22px" }}>
              <p className="panel-eyebrow">Tracium Engine</p>
              <h3>Compiling and capturing execution trace...</h3>
              <p className="panel-body">
                Your code is being compiled, executed via JDI adapter, and every step is recorded into a UEF trace.
              </p>
            </article>
          ) : (
            <article className="primary-panel code-editor-panel">
              <textarea
                className="code-editor-textarea"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                placeholder="Write your Java code here..."
                rows={18}
              />
            </article>
          )}
        </section>
      </section>
    );
  }

  // ── Trace mode: live trace loaded ──
  const events = session.events;
  const codeLines = session.codeLines;
  const currentStep = events[playback.currentIndex] ?? events[0];

  return (
    <section className="workspace">
      <Sidebar
        mode="runtime"
        events={events}
        selectedIndex={playback.currentIndex}
        onSelect={playbackActions.goTo}
        isLive={true}
        sessionId={session.sessionId}
        onRun={handleRun}
        isLoading={false}
      />

      <section className="content">
        <div className="content-head">
          <div>
            <p className="eyebrow">Now Viewing</p>
            <h2>Step {currentStep.step} at {currentStep.line}</h2>
          </div>
          <div className="content-pills">
            <span>UEF session</span>
            <span>{lens === "debug" ? "Technical lens" : "Guided lens"}</span>
          </div>
        </div>

        <PlaybackControls
          {...playback}
          {...playbackActions}
          totalSteps={events.length}
        />

        <article className="primary-panel primary-panel-dark">
          <div className="panel-head">
            <div>
              <p className="panel-eyebrow">Trace timeline</p>
              <h3>{currentStep.event}</h3>
            </div>
            <span className="panel-pill">{currentStep.delta}</span>
          </div>
          <p className="panel-body">{currentStep.summary}</p>
          <CodeViewer codeLines={codeLines} activeLine={currentStep.line} isLive={true} />
        </article>

        <div className="support-grid">
          <article className="support-panel">
            <div className="panel-head">
              <div>
                <p className="panel-eyebrow">Memory view</p>
                <h3>Frames and heap</h3>
              </div>
              <span className="panel-pill panel-pill-soft">Stable references</span>
            </div>
            <div className="memory-grid">
              <StackPanel stack={currentStep.stack} />
              <HeapPanel heap={currentStep.heap} />
            </div>
          </article>

          <StepDetail step={currentStep} lens={lens} />
        </div>
      </section>
    </section>
  );
}
