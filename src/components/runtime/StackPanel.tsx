type Props = {
  stack: string[];
};

export function StackPanel({ stack }: Props) {
  return (
    <div className="memory-column">
      <p className="memory-label">Stack</p>
      {stack.map((item, i) => (
        <span key={i} className="memory-pill">{item}</span>
      ))}
    </div>
  );
}
