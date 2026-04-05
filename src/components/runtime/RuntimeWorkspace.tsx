import type { RuntimeEvent, Lens } from "../../types/prism.js";
import type { PlaybackState, PlaybackActions } from "../../hooks/use-playback.js";
import { mockEvents, mockCodeLines, DEFAULT_CODE } from "../../types/prism.js";
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
  const isLive = session.status === "ready";
  const events = isLive ? session.events : mockEvents;
  const codeLines = isLive ? session.codeLines : mockCodeLines;
  const currentStep = events[playback.currentIndex] ?? events[0];

  return (
    <section className="workspace">
      <Sidebar
        mode="runtime"
        events={events}
        selectedIndex={playback.currentIndex}
        onSelect={playbackActions.goTo}
        isLive={isLive}
        sessionId={session.sessionId}
        onRun={() => onRun(DEFAULT_CODE)}
        isLoading={session.status === "loading"}
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
          <CodeViewer codeLines={codeLines} activeLine={currentStep.line} isLive={isLive} />
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
