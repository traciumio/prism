import { useState } from "react";
import type { Surface, Lens } from "./types/prism.js";
import { platformCards } from "./types/prism.js";
import { useRuntimeSession } from "./hooks/use-runtime-session.js";
import { usePlayback } from "./hooks/use-playback.js";
import { Topbar } from "./components/layout/Topbar.js";
import { RuntimeWorkspace } from "./components/runtime/RuntimeWorkspace.js";
import { ArchitectureWorkspace } from "./components/architecture/ArchitectureWorkspace.js";

export function App() {
  const [surface, setSurface] = useState<Surface>("runtime");
  const [lens, setLens] = useState<Lens>("debug");

  const { session, run } = useRuntimeSession();

  const isLive = session.status === "ready";
  const eventCount = isLive ? session.events.length : 5; // 5 mock events
  const { playback, ...playbackActions } = usePlayback(eventCount);

  return (
    <main className="prism-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <Topbar
        surface={surface}
        lens={lens}
        onSurfaceChange={setSurface}
        onLensChange={setLens}
      />

      {surface === "runtime" ? (
        <RuntimeWorkspace
          session={session}
          playback={playback}
          playbackActions={playbackActions}
          lens={lens}
          onRun={run}
        />
      ) : (
        <ArchitectureWorkspace lens={lens} />
      )}

      <section className="platform-strip">
        {platformCards.map((card) => (
          <article key={card.title} className="platform-card">
            <p className="panel-eyebrow">{card.title}</p>
            <p>{card.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
