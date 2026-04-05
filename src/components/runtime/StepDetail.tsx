import type { RuntimeEvent, Lens } from "../../types/prism.js";
import { lensText } from "../../types/prism.js";

type Props = {
  step: RuntimeEvent;
  lens: Lens;
};

export function StepDetail({ step, lens }: Props) {
  const copy = lensText(lens);

  return (
    <article className="support-panel">
      <p className="panel-eyebrow">{copy.headline}</p>
      <h3>{step.event}</h3>
      <p className="panel-body">{copy.body}</p>
      <div className="detail-block">
        <p className="detail-label">Source anchor</p>
        <strong>{step.line}</strong>
      </div>
      <div className="detail-block">
        <p className="detail-label">Observed state</p>
        <div className="detail-pills">
          {[step.delta, ...step.heap].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
