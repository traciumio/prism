type Props = {
  heap: string[];
};

export function HeapPanel({ heap }: Props) {
  return (
    <div className="memory-column">
      <p className="memory-label">Heap</p>
      {heap.map((item, i) => (
        <span key={i} className="memory-pill">{item}</span>
      ))}
    </div>
  );
}
