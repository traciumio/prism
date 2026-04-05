import { type Surface, type Lens, surfaces, lenses, lensText, platformCards } from "../../types/prism.js";

type Props = {
  surface: Surface;
  lens: Lens;
  onSurfaceChange: (s: Surface) => void;
  onLensChange: (l: Lens) => void;
};

export function Topbar({ surface, lens, onSurfaceChange, onLensChange }: Props) {
  const copy = lensText(lens);

  return (
    <section className="topbar">
      <div className="topbar-copy">
        <p className="eyebrow">PRISM</p>
        <h1>One visual workspace for runtime truth and repo structure.</h1>
        <p>
          Prism is the product surface for Tracium. It keeps runtime and
          architecture as distinct intelligence tracks, then lets people move
          between them without collapsing the ecosystem into one oversized app.
        </p>
        <div className="topbar-pills">
          <span>UEF playback</span>
          <span>UGF topology</span>
          <span>{copy.modePill}</span>
        </div>
      </div>

      <div className="topbar-controls">
        <div className="control-block">
          <p className="control-label">Surface</p>
          <div className="segmented">
            {surfaces.map((s) => (
              <button key={s.id} type="button"
                className={surface === s.id ? "segment active" : "segment"}
                onClick={() => onSurfaceChange(s.id)}>
                <strong>{s.label}</strong>
                <span>{s.caption}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="control-block">
          <p className="control-label">Lens</p>
          <div className="segmented compact">
            {lenses.map((l) => (
              <button key={l.id} type="button"
                className={lens === l.id ? "segment active" : "segment"}
                onClick={() => onLensChange(l.id)}>
                <strong>{l.label}</strong>
                <span>{l.caption}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
